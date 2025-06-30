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
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// Product
import { ResponseProductDto, ProductDto, updateStockDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
// Multer
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
// Auth
import { Public } from '../auth/common/decorators/public.decorator';
// Interfaces
import { GetResponse, ResponseDto } from '@/interfaces/getResponse';
// Utils
import { extname } from 'path';
import { createHash } from 'crypto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
  ): Promise<GetResponse<ResponseProductDto[]>> {
    return this.productService.getProducts(page, limit, search);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param('id') id: number): Promise<GetResponse<ResponseProductDto>> {
    return this.productService.getProduct(id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
      FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // guarda localmente por ahora
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() product: ProductDto
  ): Promise<ResponseDto<ResponseProductDto>> {

    if (file) {
      const buffer = file.buffer ?? await import('fs/promises').then(fs => fs.readFile(file.path));
      const hash = createHash('sha256').update(buffer).digest('hex');
      const imageUrl = `/uploads/${file.filename}`;
      
      return this.productService.createProduct({
        ...product,
        imageUrl,
        imageHash: hash,
      });
    }

    const { image, ...productWithoutImage } = product

    return this.productService.createProduct({
      ...productWithoutImage,
      imageUrl: null,
      imageHash: null,
    });
  }
 
  @Public()
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // guarda localmente por ahora
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProduct(
    @Param('id') id: number,
    @Body() product: ProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<ResponseProductDto>> {
    const productExist = await this.productService.getProduct(id);
    if (!productExist) {
      throw new NotFoundException('Product not found');
    }
    if (file) {
      const buffer = file.buffer ?? await import('fs/promises').then(fs => fs.readFile(file.path));
      const hash = createHash('sha256').update(buffer).digest('hex');
      const imageUrl = `/uploads/${file.filename}`;
      
      return this.productService.updateProduct(id, {
        ...product,
        imageUrl,
        imageHash: hash,
      });
    }
    const { image, ...productWithoutImage } = product

    return this.productService.updateProduct(id, {
      ...productWithoutImage,
      imageUrl: null,
      imageHash: null,
    });
  }
  @Public()
  @Put(':id/stock')
  @HttpCode(HttpStatus.OK)
  async updateStock(
    @Param('id') id: number,
    @Body() stock: updateStockDto,
  ): Promise<ResponseDto<ResponseProductDto>>
  {
    const productExist = await this.productService.getProduct(id);
    if (!productExist) {
      throw new NotFoundException('Product not found');
    }
    return this.productService.updateStock(id, stock);
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
