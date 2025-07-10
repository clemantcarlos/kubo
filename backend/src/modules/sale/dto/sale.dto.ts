import { IsArray, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  unitPrice: number;
}

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsString()
  @IsOptional()
  @MaxLength(255)
  notes?: string;

  @IsString()
  @IsOptional()
  userId?: string;  
}

export class GetSalesQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  customerId?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
} 