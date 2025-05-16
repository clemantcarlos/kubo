import { BadRequestException, Injectable } from '@nestjs/common';
// PRISMA
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, ProductCategory } from '@prisma/client';
// DTO
import { ProductCategoryDto } from './dto/product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<ProductCategory[]> {
    try {
      return await this.prisma.productCategory.findMany();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getById(id: number): Promise<ProductCategory> {
    const parsedId = Number(id);
    try {
      return await this.prisma.productCategory.findUnique({
        where: {
          id: parsedId,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async create(productCategory: ProductCategoryDto) {
    try {
      return await this.prisma.productCategory.create({
        data: productCategory,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Category already exists');
        }
        if (e.code === 'P2003') {
          throw new BadRequestException('Category category not found');
        }
        throw new BadRequestException(e);
      }
    }
  }

  async update(
    id: number,
    productCategory: ProductCategory,
  ): Promise<ProductCategory> {
    const parsedId = Number(id);
    try {
      return await this.prisma.productCategory.update({
        where: {
          id: parsedId,
        },
        data: {
          ...productCategory,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    const parsedId = Number(id);
    try {
      await this.prisma.productCategory.delete({
        where: {
          id: parsedId,
        },
      });
      return { message: 'Category deleted' };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
