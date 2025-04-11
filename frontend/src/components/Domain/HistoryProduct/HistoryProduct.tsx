import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { historyProduct } from '../../../types';
import { useParams } from 'react-router-dom';
import { selectProduct } from '../../../store/products/productsSlice.ts';
import { useEffect } from 'react';
import { getOneProduct } from '../../../store/products/productsThunk.ts';
import { addProductToHistory } from '../../../store/historyProduct/historyProductSlice.ts';

const HistoryProduct = () => {
  const viewedProducts = useAppSelector((state) => state.history.history);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(selectProduct);

  useEffect(() => {
    dispatch(getOneProduct(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.id !== undefined) {
      dispatch(addProductToHistory({
        productId: product.id,
        product: product
      }));
    }
  }, [dispatch, product]);

  return (
    <div>
      <ul>
        {viewedProducts
          .filter((item): item is historyProduct => !!item.product && !!item.product.productName)
          .map((item) => (
            <li key={item.productId}>
              {item.product.productName}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default HistoryProduct;