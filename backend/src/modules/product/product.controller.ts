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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// Product
import { GetProductDto, ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
// Multer
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
// Auth
import { Public } from '../auth/common/decorators/public.decorator';
// Interfaces
import { GetResponse } from '@/interfaces/getResponse';
// Utils
import { extname } from 'path';
import { randomUUID } from 'crypto';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `${randomUUID()}${ext}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() product: ProductDto
  ) {
    const imageUrl = file ? `/uploads/products/${file.filename}` : null;
    return this.productService.createProduct({ ...product, imageUrl });
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
