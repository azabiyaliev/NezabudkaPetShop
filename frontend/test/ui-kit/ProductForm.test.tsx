// ProductForm.test.tsx
import { ChangeEvent, ComponentProps, createElement } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

if (typeof global.URL.createObjectURL === 'undefined') {
  Object.defineProperty(global.URL, 'createObjectURL', {
    writable: true,
    value: vi.fn((file?: Blob | MediaSource) => `blob:mockObjectUrl/${(file as File)?.name || 'default'}`),
  });
}
if (typeof global.URL.revokeObjectURL === 'undefined') {
  Object.defineProperty(global.URL, 'revokeObjectURL', {
    writable: true,
    value: vi.fn(),
  });
}

import { toast } from 'react-toastify';
import { IBrand, ICategories, ProductRequest } from '../../src/types';
import ProductForm from '../../src/features/Admin/Product/components/ProductForm';

const { dispatchHoisted, mockedUseAppSelectorHoisted } = vi.hoisted(() => {
  const dispatchMockFn = vi.fn(action => {
    if (action && typeof action.unwrap === 'function') {
      return action;
    }
    return Promise.resolve(action);
  });
  return {
    dispatchHoisted: dispatchMockFn,
    mockedUseAppSelectorHoisted: vi.fn(),
  };
});

const { mockedGetBrands, mockedFetchCategoriesThunk } = vi.hoisted(() => {
  return {
    mockedGetBrands: vi.fn(() => ({
      type: 'brands/getBrands/mock',
      unwrap: vi.fn().mockResolvedValue([]),
    })),
    mockedFetchCategoriesThunk: vi.fn(() => ({
      type: 'categories/fetchCategoriesThunk/mock',
      unwrap: vi.fn().mockResolvedValue([]),
    })),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../src/app/hooks', () => ({
  useAppDispatch: () => dispatchHoisted,
  useAppSelector: mockedUseAppSelectorHoisted,
}));

vi.mock('../../src/store/brands/brandsThunk', () => ({
  getBrands: mockedGetBrands,
}));
vi.mock('../../src/store/categories/categoriesThunk', () => ({
  fetchCategoriesThunk: mockedFetchCategoriesThunk,
}));

vi.mock('../../src/components/FileInput/FileInput', () => ({
  __esModule: true,
  default: vi.fn(({ name, label, onGetFile, initialValue }) => (
    createElement('div', null,
      createElement('label', { htmlFor: name }, label),
      createElement('input', {
        type: 'file', 'data-testid': `file-input-${name}`, name: name,
        onChange: (e: ChangeEvent<HTMLInputElement>) => onGetFile(e),
      }),
      initialValue && createElement('p', null, `Initial value: ${typeof initialValue === 'string' ? initialValue : (initialValue as File).name}`)
    )
  )),
}));

vi.mock('../../src/components/TextEditor/TextEditor', () => ({
  __esModule: true,
  default: vi.fn(({ value, onChange, placeholder }) => (
    createElement('textarea', {
      'data-testid': 'text-editor', value: value, placeholder: placeholder,
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    })
  )),
}));

vi.mock('@mui/icons-material/Close', () => ({
  __esModule: true,
  default: vi.fn(() => createElement('div', { 'data-testid': "mock-close-icon" }, 'CloseIcon')),
}));

vi.mock('../../src/globalConstants', () => ({
  apiUrl: 'http://mockapi.com/',
  userRoleAdmin: 'admin',
  userRoleSuperAdmin: 'superadmin',
}));

vi.mock('../../src/globalStyles/globalTheme', () => ({
  default: {
    spacing: {
      xs: '4px'
    }
  }
}));

interface MockRootState {
  brands: { brands: IBrand[]; };
  categories: { Categories: ICategories[]; };
  products: { loadings: { addProductLoading: boolean; }; };
}

const getCleanMockInitialStateValues = (): ProductRequest => ({
  productName: "", productPhoto: null, productPrice: 0, productDescription: "",
  categoryId: [], existence: false, sales: false, brandId: "",
  startDateSales: null, endDateSales: null, promoPrice: 0, promoPercentage: 0,
  productSize: "", productAge: "", productWeight: 0,
  productFeedClass: "", productManufacturer: "",
});

const mockBrandsData: IBrand[] = [
  { id: 1, title: "Brand A", description: 'Desc A', logo: 'logoA.png' },
  { id: 2, title: "Brand B", description: 'Desc B', logo: 'logoB.png' }
];
const mockCategoriesData: ICategories[] = [
  {
    id: 10, title: "Category 1", parentId: null, image: null,
    subcategories: [
      { id: 11, title: "Subcategory 1.1", parentId: 10, image: null },
      { id: 12, title: "Subcategory 1.2", parentId: 10, image: null },
    ],
  },
  { id: 20, title: "Category 2", parentId: null, image: null }
];

describe('ProductForm', () => {
  let onSubmitMock: vi.Mock;
  const user = userEvent.setup();

  beforeEach(() => {
    onSubmitMock = vi.fn();
    dispatchHoisted.mockClear();
    mockedUseAppSelectorHoisted.mockReset();

    mockedUseAppSelectorHoisted.mockImplementation((selector: (state: MockRootState) => unknown) => {
      const state: MockRootState = {
        brands: { brands: mockBrandsData },
        categories: { Categories: mockCategoriesData },
        products: { loadings: { addProductLoading: false } },
      };
      if (selector.name === 'brandsFromSlice') return state.brands.brands;
      if (selector.name === 'selectCategories') return state.categories.Categories;
      if (selector.name === 'addProductLoading') return state.products.loadings.addProductLoading;
      return undefined;
    });

    mockedGetBrands.mockClear();
    (mockedGetBrands() as { unwrap: vi.Mock }).unwrap.mockClear().mockResolvedValue([]);
    mockedFetchCategoriesThunk.mockClear();
    (mockedFetchCategoriesThunk() as { unwrap: vi.Mock }).unwrap.mockClear().mockResolvedValue([]);

    (toast.warning as vi.Mock).mockClear();
    (toast.success as vi.Mock).mockClear();
  });

  const renderProductForm = (props?: Partial<ComponentProps<typeof ProductForm>>) => {
    const defaultProps: ComponentProps<typeof ProductForm> = {
      onSubmit: onSubmitMock,
      editProduct: undefined,
      isProduct: false,
    };
    return render(createElement(ProductForm, { ...defaultProps, ...props }));
  };

  it('renders correctly in "create" mode and fetches initial data, displaying all default fields', async () => {
    renderProductForm();
    expect(screen.getByLabelText(/Название/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Цена/i)).toBeInTheDocument();
    expect(screen.getByTestId('text-editor')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Бренд' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Категория' })).toBeInTheDocument();

    expect(screen.getByText('Выберите изображение')).toBeInTheDocument(); // Проверяем наличие текста метки
    expect(screen.getByTestId('file-input-productPhoto')).toBeInTheDocument(); // Проверяем наличие инпута по data-testid

    expect(screen.getByRole('button', { name: /Показать дополнительные поля/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Есть в наличии/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Участвует в акции/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Добавить/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/Размер/i)).not.toBeInTheDocument();
    expect(dispatchHoisted).toHaveBeenCalledTimes(2);
    expect(mockedGetBrands).toHaveBeenCalled();
    expect(mockedFetchCategoriesThunk).toHaveBeenCalled();
  });

  it('renders message if no brands or categories are available', async () => {
    mockedUseAppSelectorHoisted.mockImplementation((selector: (state: MockRootState) => unknown) => {
      const state: MockRootState = {
        brands: { brands: [] }, categories: { Categories: [] },
        products: { loadings: { addProductLoading: false } },
      };
      if (selector.name === 'brandsFromSlice') return state.brands.brands;
      if (selector.name === 'selectCategories') return state.categories.Categories;
      return undefined;
    });
    renderProductForm();
    expect(screen.getByText('Брендов пока нет')).toBeInTheDocument();
    expect(screen.getByText('Категорий пока нет')).toBeInTheDocument();
  });

  it('pre-fills form correctly in "edit" mode including sanitized and formatted fields', async () => {
    const mockEditProductData: ProductRequest = {
      ...getCleanMockInitialStateValues(), id: 1, productName: 'Existing Product', productPrice: 100,
      productDescription: '<p>Good stuff</p>', brandId: String(mockBrandsData[0].id),
      categoryId: [mockCategoriesData[0].subcategories![0].id], productPhoto: 'existing_image.jpg',
      existence: true, sales: true, startDateSales: '2025-01-15T00:00:00.000Z',
      endDateSales: new Date('2025-01-20T00:00:00.000Z'), promoPercentage: 10,
      productSize: 'Large', productAge: 'null', productWeight: null, productManufacturer: undefined
    };
    renderProductForm({ editProduct: mockEditProductData, isProduct: true });
    expect(screen.getByLabelText(/Название/i)).toHaveValue('Existing Product');
    expect(screen.getByLabelText(/Цена/i)).toHaveValue(100);
    expect(screen.getByLabelText(/Дата начала акции/i)).toHaveValue('2025-01-15');
    expect(screen.getByLabelText(/Дата окончания акции/i)).toHaveValue('2025-01-20');
    await user.click(screen.getByRole('button', { name: /Показать дополнительные поля/i }));
    expect(screen.getByLabelText(/Размер/i)).toHaveValue('Large');
    expect(screen.getByLabelText(/Возраст/i)).toHaveValue('');
    expect(screen.getByLabelText(/Вес \(грамм\)/i)).toHaveValue(0);
    expect(screen.getByLabelText(/Производитель/i)).toHaveValue('');
  });

  it('updates all basic input fields and checkboxes correctly', async () => {
    renderProductForm();
    const nameInput = screen.getByLabelText(/Название/i);
    await user.type(nameInput, 'Test Name');
    expect(nameInput).toHaveValue('Test Name');

    const priceInput = screen.getByLabelText(/Цена/i);
    await user.clear(priceInput); await user.type(priceInput, '199');
    expect(priceInput).toHaveValue(199);

    const descEditor = screen.getByTestId('text-editor');
    await user.type(descEditor, 'Test Description');
    expect(descEditor).toHaveValue('Test Description');

    const existenceCheckbox = screen.getByLabelText(/Есть в наличии/i) as HTMLInputElement;
    await user.click(existenceCheckbox); expect(existenceCheckbox.checked).toBe(true);

    const salesCheckbox = screen.getByLabelText(/Участвует в акции/i) as HTMLInputElement;
    await user.click(salesCheckbox); expect(salesCheckbox.checked).toBe(true);
    expect(screen.getByLabelText(/Дата начала акции/i)).toBeInTheDocument();
  });

  it('updates brand selection correctly', async () => {
    renderProductForm();
    const brandSelect = screen.getByRole('combobox', { name: 'Бренд' });
    await user.click(brandSelect);
    await user.click(await screen.findByRole('option', { name: mockBrandsData[0].title }));
    expect(brandSelect).toHaveTextContent(mockBrandsData[0].title);
  });

  it('updates category selections correctly and checks checkboxes in dropdown', async () => {
    renderProductForm();
    const categorySelect = screen.getByRole('combobox', { name: 'Категория' }); // Предполагая исправление в компоненте
    await user.click(categorySelect);

    const menuItemsParent = await screen.findAllByRole('option', { name: new RegExp(`^${mockCategoriesData[0].title}$`) });
    const parentCategoryItem = menuItemsParent.find(item => item.tagName.toLowerCase() === 'li' && item.classList.contains('MuiMenuItem-root'));
    expect(parentCategoryItem).toBeDefined();
    if (!parentCategoryItem) throw new Error("Parent category MenuItem not found for click");

    const parentCheckbox = parentCategoryItem.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(parentCheckbox.checked).toBe(false);
    await user.click(parentCategoryItem);
    expect(parentCheckbox.checked).toBe(true);

    const menuItemsSub = await screen.findAllByRole('option', { name: new RegExp(`^${mockCategoriesData[0].subcategories![0].title}$`) });
    const subCategoryItem = menuItemsSub.find(item => item.tagName.toLowerCase() === 'li' && item.classList.contains('MuiMenuItem-root'));
    expect(subCategoryItem).toBeDefined();
    if (!subCategoryItem) throw new Error("Sub-category MenuItem not found for click");

    const subCheckbox = subCategoryItem.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(subCheckbox.checked).toBe(false);
    await user.click(subCategoryItem);
    expect(subCheckbox.checked).toBe(true);
    expect(parentCheckbox.checked).toBe(true);

    await user.keyboard('{escape}');
    expect(categorySelect).toHaveTextContent(new RegExp(mockCategoriesData[0].title));
    expect(categorySelect).toHaveTextContent(new RegExp(mockCategoriesData[0].subcategories![0].title));
  });

  it('displays calculated promotional price correctly', async () => {
    renderProductForm();
    await user.click(screen.getByLabelText(/Участвует в акции/i));
    const priceInput = screen.getByLabelText(/Цена/i);
    await user.clear(priceInput); await user.type(priceInput, '1000');
    const promoPercentageInput = screen.getByLabelText(/Скидка \(%\)/i);
    await user.clear(promoPercentageInput); await user.type(promoPercentageInput, '20');
    expect(await screen.findByText(/Цена со скидкой 20%/i)).toBeInTheDocument();
  });

  it('calls onSubmit and does NOT reset form in edit mode', async () => {
    const mockEditProduct: ProductRequest = {
      ...getCleanMockInitialStateValues(), id:1, productName: 'Old Name', productPrice: 99,
      productDescription: 'Old Desc', categoryId: [mockCategoriesData[0].id],
      brandId: String(mockBrandsData[0].id), productPhoto: 'old.jpg',
    };
    renderProductForm({ editProduct: mockEditProduct, isProduct: true });
    const nameInput = screen.getByLabelText(/Название/i);
    await user.clear(nameInput); await user.type(nameInput, 'Updated Name');
    await user.click(screen.getByRole('button', { name: /Сохранить/i }));
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/Название/i)).toHaveValue('Updated Name');
  });
});