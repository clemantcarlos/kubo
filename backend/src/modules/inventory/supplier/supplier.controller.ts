import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, ResponseSupplierDto } from './dto/supplier.dto';
import { Public } from '@/modules/auth/common/decorators/public.decorator';
import { GetResponse, ResponseDto } from '@/interfaces/getResponse';

@Controller('inventory/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSupplier(
    @Body() dto: CreateSupplierDto
  ): Promise<ResponseDto<ResponseSupplierDto>> {
    return this.supplierService.createSupplier(dto);
  }
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getSuppliers( 
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
  ): Promise<GetResponse<ResponseSupplierDto[]>> {
    return this.supplierService.getSuppliers(page, limit, search);
  }
}
