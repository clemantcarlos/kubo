import { Module } from '@nestjs/common';
import { PurchaseModule } from './purchase/purchase.module';
import { MovementModule } from './movement/movement.module';
import { SaleModule } from './sale/sale.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [PurchaseModule, MovementModule, SaleModule, SupplierModule],
})
export class InventoryModule {}
