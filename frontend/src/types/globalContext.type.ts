import { GetResponse, Response } from "@/lib/api/queries";
import { ProductFormSchema } from "@/modules/Inventory/product/schema/product.schema";
import { Product } from "@/modules/Inventory/product/types/product";

export type GlobalContextType = {
  product: GetResponse<Product[]>;
  addProduct: (product: ProductFormSchema) => Promise<void>;
  getProducts: (page: number, search?: string) => Promise<void>;
  getProduct: (id: number) => Promise<GetResponse<Product> | undefined>;
  updateProduct: (id: number, product: ProductFormSchema) => Promise<void>;
  updateStock: (
    id: number,
    stock: number
  ) => Promise<Response<Product> | undefined>;
  deleteProduct: (id: number) => Promise<void>;
};
