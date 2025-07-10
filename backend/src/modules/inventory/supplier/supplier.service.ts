import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateSupplierDto, ResponseSupplierDto } from "./dto/supplier.dto";
import { Prisma } from "@prisma/client";
import { GetResponse } from "@/interfaces/getResponse";

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
        const [suppliers, total] = await this.prisma.$transaction(async (tx) => {
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
        });

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
}
