import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// PRISMA
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// DTO
import { GetProductDto, ProductDto } from './dto/product.dto';
// INTERFACES
import { GetResponse } from '@/interfaces/getResponse';
// Utils
import { promises as fs } from 'fs';

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
            imageUrl: true,
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
          imageUrl: true, 
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

  async createProduct(product: ProductDto & { imageUrl?: string } & { imageHash?: string }) {
    try {
      const existing = await this.prisma.product.findUnique({
        where: { imageHash: product.imageHash },
      });

      if (existing) {
        await fs.unlink('.' + product.imageUrl); // ❌ elimina la imagen
        throw new BadRequestException('Esta imagen ya fue subida.');
      }
      const newProduct = await this.prisma.product.create({
         data: {
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
          categoryId: Number(product.categoryId),
          storageUnitId: Number(product.storageUnitId),
        },
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
      console.log(e);
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
