import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export class PurchaseOrderItemDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsDateString()
  @IsNotEmpty()
  expectedDeliveryDate: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}
export class ResponsePurchaseOrderDto {
  orderNumber: string;
  totalAmount: number;
  supplier: { id: string; name: string };
  history: { 
    status: PurchaseOrderStatus; 
    statusAt: Date; 
    user: { id: string; name: string } 
  }[];
}

export class ApprovePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  approvedBy: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CancelPurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  cancelledBy: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class PurchaseReceiptItemDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  quantityReceived: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePurchaseReceiptDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsDateString()
  @IsNotEmpty()
  invoiceDate: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  invoiceAmount: number;

  @IsString()
  @IsNotEmpty()
  receivedBy: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isPartial?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseReceiptItemDto)
  items: PurchaseReceiptItemDto[];
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsDateString()
  @IsNotEmpty()
  invoiceDate: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class PayInvoiceDto {
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  amount?: number;
} 