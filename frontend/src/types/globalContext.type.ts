import { GetResponse, Response } from "@/lib/api/queries";
import { ProductFormSchema } from "@/modules/Inventory/product/schema/product.schema";
import { Product } from "@/modules/Inventory/product/types/product";
import { SupplierFormSchema } from "@/modules/Inventory/suppliers/schema/supplier.schema";
import { Supplier } from "@/modules/Inventory/suppliers/types/supplier.type";

export type GlobalContextType = {
  product: {
    value: GetResponse<Product[]>;
    methods: {
      getProduct: (id: number) => Promise<GetResponse<Product> | undefined>;
      getProducts: (page: number, search?: string) => Promise<void>;
      addProduct: (product: ProductFormSchema) => Promise<void>;
      updateProduct: (id: number, product: ProductFormSchema) => Promise<void>;
      updateStock: (
        id: number,
        stock: number
      ) => Promise<Response<Product> | undefined>;
      deleteProduct: (id: number) => Promise<void>;
    };
  }
  supplier: {
    value: GetResponse<Supplier[]>;
    methods: {
      // TODO: FIX | VOID TYPE WHEN THE METHOD IS FINISHED
      getSupplier: (id: number) => Promise<GetResponse<Supplier> | undefined | void >;
      getSuppliers: (page: number, search?: string) => Promise<void>;
      addSupplier: (supplier: SupplierFormSchema) => Promise<void>;
      updateSupplier: (id: number, supplier: SupplierFormSchema) => Promise<void>;
      deleteSupplier: (id: number) => Promise<void>;
    };
  }
};
