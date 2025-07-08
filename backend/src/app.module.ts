import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@/prisma/prisma.module';
// GUARDS
import { AtGuard } from '@/modules/auth/common/guards/at.guard';
//MODULES
import { PermissionModule } from '@/modules/permission/permission.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { OrderModule } from '@/modules/order/order.module';
import { TableModule } from '@/modules/table/table.module';
import { ProductModule } from '@/modules/product/product.module';
import { ProductCategoryModule } from '@/modules/product-category/product-category.module';
import { ProductStorageUnitModule } from '@/modules/product-storage-unit/product-storage-unit.module';
import { InventoryModule } from './modules/inventory/inventory.module';
@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ProductModule,
    PermissionModule,
    OrderModule,
    ProductCategoryModule,
    TableModule,
    ProductStorageUnitModule,
    InventoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
