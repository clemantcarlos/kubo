import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProductDto, ProductDto } from './dto/product.dto';
import { GetResponse } from '@/interfaces/getResponse';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(page: number = 1, limit: number = 10): Promise<GetResponse<GetProductDto[]>> {
    try {
      const [products, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            stock: true,
            price: true,
            isAvailable: true,
            category: { select: { name: true } },
            storageUnit: { select: { name: true } },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { id: 'asc' },
        }),
        this.prisma.product.count(),
      ]);

      return {
        success: true,
        data: products,
        meta: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P5010') {
          throw new NotFoundException('Products not found');
        }
      }
      throw new BadRequestException(e);
    }
  }

  async getProduct(id: number): Promise<GetResponse<GetProductDto>> {
    const parsedId = Number(id);
    try {
       const product = await this.prisma.product.findUnique({
        where: {
          id: parsedId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          stock: true,
          price: true,
          isAvailable: true,
          category: { select: { id:true, name: true } },
          storageUnit: { select: { id:true, name: true } },
        },
      });

      return {
        success: true,
        data: product,
        meta: {
          total: 1,
          page:1,
          totalPages: 1,
        },
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createProduct(product: ProductDto) {
    try {
      const newProduct = await this.prisma.product.create({
        data: product,
      });
      return newProduct;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Product already exists');
        }
        if (e.code === 'P2003') {
          throw new BadRequestException(
            'One relationship with product is missing ' + e.meta.field_name,
          );
        }
        throw new BadRequestException(e);
      }
      throw new BadRequestException(e);
    }
  }

  async updateProduct(id: number, product: Product): Promise<Product> {
    const parsedId = Number(id);
    try {
      return await this.prisma.product.update({
        where: {
          id: parsedId,
        },
        data: product,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    const parsedId = Number(id);
    try {
      return await this.prisma.product.delete({
        where: {
          id: parsedId,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
