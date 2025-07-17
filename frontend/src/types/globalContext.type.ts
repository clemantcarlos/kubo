import { GetResponse, Response } from "@/lib/api/queries";
import { ProductFormSchema } from "@/modules/Inventory/product/schema/product.schema";
import { Product } from "@/modules/Inventory/product/types/product";
import { PurchaseFormSchema } from "@/modules/Inventory/purchase/schema/purchase.schema";
import { Purchase } from "@/modules/Inventory/purchase/types/purchase.type";
import { SupplierFormSchema } from "@/modules/Inventory/supplier/schema/supplier.schema";
import { Supplier } from "@/modules/Inventory/supplier/types/supplier.type";

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
      getSupplier: (id: string) => Promise<GetResponse<Supplier> | undefined>;
      getSuppliers: (page: number, search?: string) => Promise<void>;
      addSupplier: (supplier: SupplierFormSchema) => Promise<void>;
      updateSupplier: (id: string, supplier: SupplierFormSchema) => Promise<void>;
      deleteSupplier: (id: string) => Promise<void>;
    };
  }
  purchase: {
    value: GetResponse<Supplier[]>;
    methods: {
      getPurchase: (id: string) => Promise<GetResponse<Purchase> | undefined>;
      getPurchases: (page: number, search?: string) => Promise<void>;
      addPurchase: (supplier: PurchaseFormSchema) => Promise<void>;
      updatePurchase: (id: string, supplier: PurchaseFormSchema) => Promise<void>;
      deletePurchase: (id: string) => Promise<void>;
    };
  }
};
