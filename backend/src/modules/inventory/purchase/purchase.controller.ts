import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { Public } from '@/modules/auth/common/decorators/public.decorator';
import {
  CreatePurchaseOrderDto,
  ApprovePurchaseOrderDto,
  CancelPurchaseOrderDto,
  CreatePurchaseReceiptDto,
} from './dto/purchase.dto';

@Controller('inventory/purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Public()
  @Get('order')
  @HttpCode(HttpStatus.OK)
  async getPurchaseOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('supplierId') supplierId?: string,
  ) {
    return this.purchaseService.getPurchaseOrders(page, limit, status, supplierId);
  }

  @Public()
  @Get('order/:id')
  @HttpCode(HttpStatus.OK)
  async getPurchaseOrder(@Param('id') id: number) {
    return this.purchaseService.getPurchaseOrder(id);
  }

  @Public()
  @Post('order')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.purchaseService.createPurchaseOrder(dto);
  }

  // @Public()
  // @Put('order/:id/approve')
  // @HttpCode(HttpStatus.OK)
  // async approvePurchaseOrder(@Param('id') id: number, @Body() dto: ApprovePurchaseOrderDto) {
  //   return this.purchaseService.approvePurchaseOrder(id, dto);
  // }

  // @Public()
  // @Put('order/:id/cancel')
  // @HttpCode(HttpStatus.OK)
  // async cancelPurchaseOrder(@Param('id') id: number, @Body() dto: CancelPurchaseOrderDto) {
  //   return this.purchaseService.cancelPurchaseOrder(id, dto);
  // }

  // @Public()
  // @Post('order/:id/receive')
  // @HttpCode(HttpStatus.OK)
  // async receivePurchase(@Param('id') id: number, @Body() dto: CreatePurchaseReceiptDto) {
  //   return this.purchaseService.receivePurchase(id, dto);
  // }
}
