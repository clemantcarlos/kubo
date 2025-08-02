import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
// PRISMA
import {
  Prisma,
  ProductCategory,
  Unit,
} from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
// DTO
import {
  ResponseProductDto,
  ProductDto,
  updateStockDto,
} from "./dto/product.dto";
// INTERFACES
import { GetResponse, ResponseDto } from "@/interfaces/getResponse";
// Utils
import { promises as fs } from "fs";
import { productSelect } from "./utils/const.prisma.query";
import { ProductCategoryDto } from "./dto/product-category.dto";
import {
  GetProductStorageUnitDto,
  ProductStorageUnitDto,
} from "./dto/product-storage-unit.dto";
import { createImage } from "./utils/imageHandlers";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(
    page: number = 1,
    limit: number = 10,
    search: string
  ): Promise<GetResponse<ResponseProductDto[]>> {
    const formatedPage = Number(page);
    const formatedLimit = Number(limit);
    const formatedSearch = search.toLowerCase();
    try {
      if (
        formatedSearch &&
        formatedSearch !== "undefined" &&
        formatedSearch.length > 0
      ) {
        const [products, total] = await this.prisma.$transaction(async (tx) => {
          const products = await tx.product.findMany({
            select: productSelect,
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
                  description: {
                    contains: formatedSearch,
                    mode: "insensitive",
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
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: formatedSearch,
                    mode: "insensitive",
                  },
                },
              ],
            },
          });
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
          orderBy: { id: "desc" },
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
        if (e.code === "P5010") {
          throw new NotFoundException("Products not found");
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
        select: productSelect,
      });

      return {
        success: true,
        data: product,
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

  async createProduct(
    product: ProductDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<ResponseProductDto>> {
    const { 
      name, 
      description, 
      stock, 
      price, 
      cost, 
      storageUnitId, 
      categoryId, 
      supplierId 
    } = product;

    try {
      const { imageUrl, imageHash } = await createImage(file); // ❌ crea la imagen
      const newProduct = await this.prisma.product.create({
        data: {
          supplier: { connect: { id: supplierId } },
          name,
          description,
          stock,
          price,
          cost,
          storageUnit: { connect: { id: storageUnitId } },
          category: { connect: { id: categoryId } },
          imageHash,
          imageUrl,
        },
        select: productSelect,
      });
      return {
        success: true,
        data: newProduct,
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

  async updateProduct(
    id: number,
    product: ProductDto,
    file?: Express.Multer.File
  ): Promise<ResponseDto<ResponseProductDto>> {
    const parsedId = Number(id);
    const { name, description, stock, price, cost, storageUnitId, categoryId } =
      product;

    try {
      if (file !== undefined && file !== null) {
        const existing = await this.prisma.product.findUnique({
          where: { id: parsedId },
          select: { imageUrl: true },
        });
        // CREATE FILE
        try {
          await fs.unlink("." + existing.imageUrl); // ❌ elimina la imagen
        } catch {
          console.log("The previous image was not found");
        }

        const { imageUrl, imageHash } = await createImage(file); // ❌ crea la imagen
        const updatedProduct = await this.prisma.product.update({
          where: { id: parsedId },
          data: {
            name,
            description,
            stock,
            price,
            cost,
            storageUnit: { connect: { id: storageUnitId } },
            category: { connect: { id: categoryId } },
            imageHash,
            imageUrl,
          },
          select: productSelect,
        });
        return {
          success: true,
          data: updatedProduct,
        };
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id: parsedId },
        data: {
          name,
          description,
          stock,
          price,
          storageUnit: { connect: { id: storageUnitId } },
          category: { connect: { id: categoryId } },
        },
        select: productSelect,
      });
      return {
        success: true,
        data: updatedProduct,
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

  async updateStock(
    id: number,
    { stock }: updateStockDto
  ): Promise<ResponseDto<ResponseProductDto>> {
    const parsedId = Number(id);
    try {
      const transaction = await this.prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
          where: { id: parsedId },
        });

        if (!product) {
          throw new NotFoundException("Product not found");
        }

        return await tx.product.update({
          where: {
            id: parsedId,
          },
          data: {
            stock: { set: stock },
          },
          select: productSelect,
        });
      });
      return {
        success: true,
        data: transaction,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async deleteProduct(id: number): Promise<ResponseDto<ResponseProductDto>> {
    const parsedId = Number(id);
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: {
          id: parsedId,
        },
        select: productSelect,
      });
      return {
        success: true,
        data: deletedProduct,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") {
          throw new BadRequestException(
            "This product is used in other places and cannot be deleted"
          );
        }
        throw new BadRequestException(e);
      }
    }
  }
  // CATEGORIES
  async getAllCategories(): Promise<ProductCategory[]> {
    try {
      return await this.prisma.productCategory.findMany();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getByIdCategory(id: number): Promise<ProductCategory> {
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

  async createCategory(productCategory: ProductCategoryDto) {
    try {
      return await this.prisma.productCategory.create({
        data: productCategory,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("Category already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Category category not found");
        }
        throw new BadRequestException(e);
      }
    }
  }

  async updateCategory(
    id: number,
    productCategory: ProductCategory
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

  async deleteCategory(id: number): Promise<{ message: string }> {
    const parsedId = Number(id);
    try {
      await this.prisma.productCategory.delete({
        where: {
          id: parsedId,
        },
      });
      return { message: "Category deleted" };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  // STORAGE UNITS
  async getAllStorageUnits(): Promise<GetProductStorageUnitDto[]> {
    try {
      return await this.prisma.unit.findMany({
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
  async createStorageUnit(
    unit: ProductStorageUnitDto
  ): Promise<Unit> {
    try {
      const newProductStorageUnit = await this.prisma.unit.create(
        {
          data: unit,
        }
      );
      return newProductStorageUnit;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("Unit already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException(
            "One relationship with unit is missing " + e.meta.field_name
          );
        }
        throw new BadRequestException(e);
      }
      throw new BadRequestException(e.message);
    }
  }
}
