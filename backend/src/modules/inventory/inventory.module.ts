import { Module } from '@nestjs/common';
import { PurchaseModule } from './purchase/purchase.module';
import { MovementModule } from './movement/movement.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PurchaseModule, MovementModule, SupplierModule, ProductModule],
})
export class InventoryModule {}
