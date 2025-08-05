import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  unitId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsNumber()
  @IsNotEmpty()
  supplierId: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
export class ResponseProductDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  isAvailable: boolean;

  @IsNotEmpty()
  @IsObject()
  category: { id?:number, name: string };

  @IsNotEmpty()
  @IsObject()
  unit: { id?:number, name: string, unit: number};

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
export class updateStockDto {
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}