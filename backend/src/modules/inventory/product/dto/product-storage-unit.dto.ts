import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductStorageUnitDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  unit: number;

  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}
// TODO: CHANGE TO GLOBAL DTO AND CHANGE NAME TO UNITDTO
export class GetProductStorageUnitDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  unit: number;
}
