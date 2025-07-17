import { User } from "@/components/auth/types/User";
import { Supplier } from "../../supplier/types/supplier.type";
import { Product } from "../../product/types/product";

export interface Purchase {
  id:                   number;
  orderNumber:          string;
  supplierId:           string;
  status:               PurchaseStatus;
  expectedDeliveryDate: Date;
  actualDeliveryDate?:  Date | null;
  totalAmount:          number;
  notes:                string;
  createdBy:            string;
  approvedBy?:          string | null; 
  approvedAt?:          Date | null;
  cancelledBy?:         string | null;
  cancelledAt?:         Date | null;
  cancellationReason?:  string | null;
  createdAt:            Date;
  updatedAt:            Date;
  supplier:             Pick<Supplier, 'id' | 'name'>;
  user:                 Pick<User, 'id' | 'name'>;
  items:                Item[];
}

export enum PurchaseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export interface Item {
    id:              number;
    purchaseOrderId: number;
    productId:       number;
    quantity:        number;
    unitPrice:       number;
    subtotal:        number;
    createdAt:       Date;
    updatedAt:       Date;
    product:         Pick<Product, 'id' | 'name' | 'price'>;
}