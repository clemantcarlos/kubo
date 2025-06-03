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
  storageUnitId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string;

}
export class GetProductDto {
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

  @IsNumber()
  isAvailable: boolean;

  @IsNotEmpty()
  @IsObject()
  category: { id?:number, name: string };

  @IsNotEmpty()
  @IsObject()
  storageUnit: { id?:number, name: string, unit: number};

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
