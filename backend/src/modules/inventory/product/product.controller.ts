import {
  BadRequestException,
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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
// DTOS
import {
  ResponseProductDto,
  ProductDto,
  updateStockDto,
} from "./dto/product.dto";
import { ProductCategoryDto } from "./dto/product-category.dto";
// SERVICE
import { ProductService } from "./product.service";
// PRISMA MODELS
import { Product, ProductCategory, ProductStorageUnit } from "@prisma/client";
// Multer
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
// Auth
import { Public } from "../../auth/common/decorators/public.decorator";
// Interfaces
import { GetResponse, ResponseDto } from "@/interfaces/getResponse";
// Utils
import { extname } from "path";
import { createHash } from "crypto";
import {
  GetProductStorageUnitDto,
  ProductStorageUnitDto,
} from "./dto/product-storage-unit.dto";

@Controller("inventory/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  // --- CATEGORIES ---
  @Public()
  @Get('category')
  @HttpCode(HttpStatus.OK)
  async getAllCategories(): Promise<ProductCategory[]> {
    return this.productService.getAllCategories();
  }
  @Public()
  @Get("category/:id")
  @HttpCode(HttpStatus.FOUND)
  async getCategoryById(@Param("id") id: number): Promise<ProductCategory> {
    return this.productService.getByIdCategory(id);
  }
  @Public()
  @Post('category')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createCategory(@Body() product: ProductCategoryDto) {
    return this.productService.createCategory(product);
  }
  @Public()
  @Put("category/:id")
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Param("id") id: number,
    @Body() product: ProductCategory
  ): Promise<ProductCategory> {
    const categoryExist = await this.productService.getByIdCategory(id);

    if (!categoryExist) {
      throw new NotFoundException("Category not found");
    }
    return this.productService.updateCategory(id, product);
  }
  @Public()
  @Delete("category/:id")
  @HttpCode(HttpStatus.OK)
  async deleteCategory(@Param("id") id: number): Promise<{ message: string }> {
    const categoryExist = await this.productService.getByIdCategory(id);

    if (!categoryExist) {
      throw new NotFoundException("Category not found");
    }
    return this.productService.deleteCategory(id);
  }
  // --- STORAGE UNITS --- 
  @Public()
  @Get('storage-unit')
  async getAllProductStorageUnit(): Promise<GetProductStorageUnitDto[]> {
    return this.productService.getAllStorageUnits();
  }
  @Public()
  @Post('storage-unit')
  async createProductStorageUnit(
    @Body() productStorageUnit: ProductStorageUnitDto
  ): Promise<ProductStorageUnit> {
    return this.productService.createStorageUnit(productStorageUnit);
  }
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string
  ): Promise<GetResponse<ResponseProductDto[]>> {
    return this.productService.getProducts(page, limit, search);
  }
  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getProduct(
    @Param("id") id: number
  ) {
    return this.productService.getProduct(id);
  }
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./public/img", // guarda localmente por ahora
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/webp' 
          || extname(file.originalname).toLocaleLowerCase() === '.webp'
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image/webp is allowed'), false);
        }
      },
    })
  )
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() product: ProductDto
  ): Promise<ResponseDto<ResponseProductDto>> {
    return this.productService.createProduct(product, file);
  }
  @Public()
  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./public/img", // guarda localmente por ahora
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/webp' 
          || extname(file.originalname).toLocaleLowerCase() === '.webp'
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image/webp is allowed'), false);
        }
      },
    })
  )
  async updateProduct(
    @Param("id") id: number,
    @Body() product: ProductDto,
    @UploadedFile() file: Express.Multer.File
  )
  : Promise<ResponseDto<ResponseProductDto>> 
  {
    const productExist = await this.productService.getProduct(id);
    if (!productExist) {
      throw new NotFoundException("Product not found");
    }
    return this.productService.updateProduct(id, product, file);
  }
  @Public()
  @Put(":id/stock")
  @HttpCode(HttpStatus.OK)
  async updateStock(
    @Param("id") id: number,
    @Body() stock: updateStockDto
  ): Promise<ResponseDto<ResponseProductDto>> {
    const productExist = await this.productService.getProduct(id);
    if (!productExist) {
      throw new NotFoundException("Product not found");
    }
    return this.productService.updateStock(id, stock);
  }
  @Public()
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param("id") id: number): Promise<ResponseDto<ResponseProductDto>> {
    const productExist = await this.productService.getProduct(id);
    if (!productExist) {
      throw new NotFoundException("Product not found");
    }
    return this.productService.deleteProduct(id);
  }
}
