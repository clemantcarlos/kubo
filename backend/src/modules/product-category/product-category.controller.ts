import {
  Body,
  Controller,
  Param,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Delete,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from '@prisma/client';
import { ProductCategoryDto } from './dto/product-category.dto';
import { Public } from '../auth/common/decorators/public.decorator';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<ProductCategory[]> {
    return this.productCategoryService.getAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  async getById(@Param('id') id: number): Promise<ProductCategory> {
    return this.productCategoryService.getById(id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(@Body() product: ProductCategoryDto) {
    return this.productCategoryService.create(product);
  }

  @Public()
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() product: ProductCategory,
  ): Promise<ProductCategory> {
    const categoryExist = await this.productCategoryService.getById(id);

    if (!categoryExist) {
      throw new NotFoundException('Category not found');
    }
    return this.productCategoryService.update(id, product);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    const categoryExist = await this.productCategoryService.getById(id);

    if (!categoryExist) {
      throw new NotFoundException('Category not found');
    }
    return this.productCategoryService.delete(id);
  }
}
