import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateSupplierDto, ResponseSupplierDto, SupplierDto } from "./dto/supplier.dto";
import { Prisma } from "@prisma/client";
import { GetResponse, ResponseDto } from "@/interfaces/getResponse";

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(data: CreateSupplierDto) {
    try {
      const newSupplier = await this.prisma.supplier.create({ data });
      return {
        success: true,
        data: newSupplier,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("Product already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException(
            "One relationship with product is missing " + e.meta.field_name
          );
        }
        throw new BadRequestException(e);
      }
      console.log(e);
      throw new BadRequestException(e);
    }
  }
  async getAllSuppliers(): Promise<GetResponse<Pick<SupplierDto, 'id' | 'name'>[]>> {
    try {
      const suppliers = await this.prisma.supplier.findMany({
        select: { id: true, name: true },
      });
      return {
        success: true,
        data: suppliers,
        meta: {
          total: suppliers.length,
          page: 1,
          totalPages: 1,
        },
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getSuppliers(
    page: number = 1,
    limit: number = 10,
    search: string
  ): Promise<GetResponse<ResponseSupplierDto[]>> {
    const formatedPage = Number(page);
    const formatedLimit = Number(limit);
    const formatedSearch = search.toLowerCase();
    try {
      if (
        formatedSearch &&
        formatedSearch !== "undefined" &&
        formatedSearch.length > 0
      ) {
        const [suppliers, total] = await this.prisma.$transaction(
          async (tx) => {
            const suppliers = await tx.supplier.findMany({
              skip: (formatedPage - 1) * formatedLimit,
              take: formatedLimit,
              orderBy: { id: "desc" },
              where: {
                OR: [
                  {
                    name: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                  {
                    phone: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                  {
                    address: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            });
            const total = await tx.supplier.count({
              where: {
                OR: [
                  {
                    name: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                  {
                    phone: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                  {
                    address: {
                      contains: formatedSearch,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            });
            return [suppliers, total];
          }
        );

        return {
          success: true,
          data: suppliers,
          meta: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
          },
        };
      }

      const [suppliers, total] = await this.prisma.$transaction([
        this.prisma.supplier.findMany({
          skip: (formatedPage - 1) * formatedLimit,
          take: formatedLimit,
          orderBy: { id: "desc" },
        }),
        this.prisma.supplier.count(),
      ]);
      return {
        success: true,
        data: suppliers,
        meta: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P5010") {
          throw new NotFoundException("Suppliers not found");
        }
      }
      throw new BadRequestException(e);
    }
  }
  async getSupplier(id: string): Promise<GetResponse<ResponseSupplierDto>> {
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: {
          id: id,
        },
      });

      return {
        success: true,
        data: supplier,
        meta: {
          total: 1,
          page: 1,
          totalPages: 1,
        },
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async updateSupplier(
    id: string,
    supplier: CreateSupplierDto
  ): Promise<ResponseDto<ResponseSupplierDto>> {
    try {
      const updatedSupplier = await this.prisma.supplier.update({
        where: {
          id: id,
        },
        data: supplier,
      });
      return {
        success: true,
        data: updatedSupplier,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("Product already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException(
            "One relationship with product is missing " + e.meta.field_name
          );
        }
        throw new BadRequestException(e);
      }
      throw new BadRequestException(e);
    }
  }
  async deleteSupplier(id: string): Promise<ResponseDto<ResponseSupplierDto>> {
    try {
      const deletedSupplier = await this.prisma.supplier.delete({
        where: {
          id: id,
        },
      });

      return {
        success: true,
        data: deletedSupplier,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
