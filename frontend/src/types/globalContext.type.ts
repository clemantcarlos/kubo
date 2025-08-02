import { GetResponse } from "@/services/queries";
import { PurchaseFormSchema } from "@/modules/inventory/purchase/schema/purchase.schema";
import { Purchase } from "@/modules/inventory/purchase/types/purchase.type";

export type GlobalContextType = {
  purchase: {
    value: GetResponse<Purchase[]>;
    methods: {
      getPurchase: (id: number) => Promise<GetResponse<Purchase> | undefined>;
      getPurchases: (page: number, search?: string) => Promise<void>;
      addPurchase: (purchase: PurchaseFormSchema) => Promise<void>;
      updatePurchase: (
        id: number,
        purchase: PurchaseFormSchema
      ) => Promise<void>;
      deletePurchase: (id: number) => Promise<void>;
    };
  };
};
