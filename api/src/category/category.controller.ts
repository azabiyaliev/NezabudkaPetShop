import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() categoryDto: CategoryDto) {
    return this.categoryService.createCategory({
      title: categoryDto.title,
      parentId: categoryDto.parentId,
    });
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('subcategory')
  async findAllSubCategories() {
    return this.categoryService.getAllSubCategories();
  }

  @Get(':id')
  async findOneCategory(@Param('id') id: string) {
    return this.categoryService.getOneCategory(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryDto: CategoryDto,
  ) {
    return this.categoryService.updateCategory(id, categoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
