import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpCode, 
  HttpStatus, 
  NotFoundException, 
  Param, 
  Post, 
  Put, 
  Query 
} from '@nestjs/common';
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
    @Query('all') all: boolean = false,
  ): Promise<GetResponse<ResponseSupplierDto[] | Pick<ResponseSupplierDto, 'id' | 'name'>[]>> {

    if( all === true) { return this.supplierService.getAllSuppliers(); }

    return this.supplierService.getSuppliers(page, limit, search);
  }
  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getSupplier(
    @Param("id") id: string
  ): Promise<GetResponse<ResponseSupplierDto>> {
    return this.supplierService.getSupplier(id);
  }

  @Public()
  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async updateSupplier(
    @Param("id") id: string,
    @Body() supplier: CreateSupplierDto
  ): Promise<ResponseDto<ResponseSupplierDto>> {
    const supplierExist = await this.supplierService.getSupplier(id);
    if (!supplierExist) {
      throw new NotFoundException("Supplier not found");
    }
    return this.supplierService.updateSupplier(id, supplier);
  }

  @Public()
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteSupplier(
    @Param("id") id: string
  ): Promise<ResponseDto<ResponseSupplierDto>> {
    const supplierExist = await this.supplierService.getSupplier(id);
    if (!supplierExist) {
      throw new NotFoundException("Supplier not found");
    }
    return this.supplierService.deleteSupplier(id);
  }

}
