import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// PRISMA
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// DTO
import { ResponseProductDto, ProductDto, updateStockDto } from './dto/product.dto';
// INTERFACES
import { GetResponse, ResponseDto } from '@/interfaces/getResponse';
// Utils
import { promises as fs } from 'fs';
import { productSelect } from './utils/const.prisma.query';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(
    page: number = 1, 
    limit: number = 10,
    search: string,
  ): Promise<GetResponse<ResponseProductDto[]>> {
    const formatedPage = Number(page);
    const formatedLimit = Number(limit);
    const formatedSearch = search.toLowerCase();
    try {
      if(formatedSearch && formatedSearch !== 'undefined' && formatedSearch.length > 0) {
        console.log(formatedSearch)
        const [products, total] = await this.prisma.$transaction(async(tx) => {
          const products = await tx.product.findMany({
            select: productSelect,
            skip: (formatedPage - 1) * formatedLimit,
            take: formatedLimit,
            orderBy: { id: 'desc' },
            where: {
              OR: [
                {
                  name: {
                    contains: formatedSearch,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: formatedSearch,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            
          });
          const total = await tx.product.count({
            where: {
              OR: [
                {
                  name: {
                    contains: formatedSearch,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: formatedSearch,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          })
          return [products, total];
        });

        return {
          success: true,
          data: products,
          meta: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
          },
        };
      }

      const [products, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          select: productSelect,
          skip: (formatedPage - 1) * formatedLimit,
          take: formatedLimit,
          orderBy: { id: 'desc' },
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

  async getProduct(id: number): Promise<GetResponse<ResponseProductDto>> {
    const parsedId = Number(id);
    try {
       const product = await this.prisma.product.findUnique({
        where: {
          id: parsedId,
        },
        select: productSelect
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

  async createProduct(
    product: ProductDto & { imageUrl?: string } & { imageHash?: string }
  ): Promise<ResponseDto<ResponseProductDto>> {
    try {
      if (product.imageHash) {
      const existing = await this.prisma.product.findUnique({
        where: { imageHash: product.imageHash },
      });

      if (existing) {
          await fs.unlink('.' + product.imageUrl); // ❌ elimina la imagen
          throw new BadRequestException('Esta imagen ya fue subida.');
        }
      }
      const newProduct = await this.prisma.product.create({
         data: {
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
          categoryId: Number(product.categoryId),
          storageUnitId: Number(product.storageUnitId),
        },
        select: productSelect,
      });
      return {
        success: true,
        data: newProduct,
      };
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

  async updateProduct(
    id: number,
    product: ProductDto & { imageUrl?: string } & { imageHash?: string }
  ): Promise<ResponseDto<ResponseProductDto>> {
    const parsedId = Number(id);
    try {
      if (product.imageHash) {
      const existing = await this.prisma.product.findUnique({
        where: { imageHash: product.imageHash },
      });

      if (existing) {
          await fs.unlink('.' + product.imageUrl); // ❌ elimina la imagen
          throw new BadRequestException('Esta imagen ya fue subida.');
        }
      }
      const updatedProduct = await this.prisma.product.update({
        where: {
          id: parsedId,
        },
        data: {
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
          categoryId: Number(product.categoryId),
          storageUnitId: Number(product.storageUnitId),
        },
        select: productSelect,
      })
      return {
        success: true,
        data: updatedProduct,
      };
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

  async updateStock(
    id: number, 
    { stock }: updateStockDto
  ): Promise<ResponseDto<ResponseProductDto>> 
  {
    const parsedId = Number(id);
    try{
      const transaction = await this.prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({where: {id: parsedId}});

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        return await tx.product.update({
          where: {
            id: parsedId,
          },
          data: {
            stock: {set: stock},
          },
          select: productSelect,
        });
      });
      return {
        success: true,
        data: transaction,
      }
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
