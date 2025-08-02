import { User } from "@/components/auth/types/User";
import { Supplier } from "../../supplier/types/supplier.type";
import { Product } from "../../product/types/product";

export interface Purchase {
  id:                   number;
  orderNumber:          string;
  status:               PurchaseStatus;
  totalAmount:          number;
  notes:                string;
  supplier:             Pick<Supplier, 'id' | 'name'>;
  user:                 Pick<User, 'id' | 'name'>;
  history:              PurchaseHistory[];
} 

export enum PurchaseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}
export interface PurchaseHistory {
  status:               PurchaseStatus;
  statusAt:             Date;
  notes:                string;
  user:                 Pick<User, 'id' | 'name'>;
}
export interface Item {
  quantity:        number;
  unitPrice:       number;
  subtotal:        number;
  product:         Pick<Product, 'id' | 'name'>;
}