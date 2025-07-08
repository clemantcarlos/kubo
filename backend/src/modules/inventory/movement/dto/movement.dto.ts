import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

export class CreateMovementDto {
  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsEnum(MovementType)
  type: MovementType;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  reference?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class GetMovementsQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId?: number;

  @IsOptional()
  @IsEnum(MovementType)
  type?: MovementType;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
} 