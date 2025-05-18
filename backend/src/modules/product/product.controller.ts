import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { GetProductDto, ProductDto } from './dto/product.dto';
import { Public } from '../auth/common/decorators/public.decorator';
import { GetResponse } from '@/interfaces/getResponse';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(@Param('page') page: number = 1, @Param('limit') limit: number = 10): Promise<GetResponse<GetProductDto[]>> {
    return this.productService.getProducts(page, limit);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param('id') id: number): Promise<GetResponse<GetProductDto>> {
    return this.productService.getProduct(id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() product: ProductDto) {
    return this.productService.createProduct(product);
  }

  @Public()
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: number,
    @Body() product: Product,
  ): Promise<Product> {
    const productExist = await this.productService.getProduct(id);

    if (!productExist) {
      throw new NotFoundException('Product not found');
    }
    return this.productService.updateProduct(id, product);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: number): Promise<Product> {
    const productExist = await this.productService.getProduct(id);

    if (!productExist) {
      throw new NotFoundException('Product not found');
    }
    return this.productService.deleteProduct(id);
  }
}
