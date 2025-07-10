import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "@/prisma/prisma.module";
// GUARDS
import { AtGuard } from "@/modules/auth/common/guards/at.guard";
//MODULES
import { PermissionModule } from "@/modules/permission/permission.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { UserModule } from "@/modules/user/user.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { SaleModule } from "./modules/sale/sale.module";
import { CartModule } from './modules/cart/cart.module';
@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PermissionModule,
    InventoryModule,
    SaleModule,
    CartModule
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
