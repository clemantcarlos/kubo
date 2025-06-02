import { BadRequestException, Injectable } from '@nestjs/common';
import {
  GetProductStorageUnitDto,
  ProductStorageUnitDto,
} from './dto/product-storage-unit.dto';
import { Prisma, ProductStorageUnit } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProductStorageUnitService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<GetProductStorageUnitDto[]> {
    try {
      return await this.prisma.productStorageUnit.findMany({
        select: {
          id: true,
          name: true,
          unit: true,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async create(
    productStorageUnit: ProductStorageUnitDto,
  ): Promise<ProductStorageUnit> {
    try {
      const newProductStorageUnit = await this.prisma.productStorageUnit.create(
        {
          data: productStorageUnit,
        },
      );
      return newProductStorageUnit;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Unit already exists');
        }
        if (e.code === 'P2003') {
          throw new BadRequestException(
            'One relationship with unit is missing ' + e.meta.field_name,
          );
        }
        throw new BadRequestException(e);
      }
      throw new BadRequestException(e.message);
    }
  }
}
