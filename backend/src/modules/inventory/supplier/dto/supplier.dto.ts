import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsEmail, 
  IsBoolean, 
  IsDate,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  taxId?: string;
}

export class SupplierDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsDate()
  @IsOptional()
  createdAt: Date;
  updatedAt: Date;
} 
export class ResponseSupplierDto {
  @IsString()
  @IsNotEmpty()
  id:        string;
  
  @IsString()
  @IsNotEmpty()
  name:      string;

  @IsEmail()
  @IsOptional()
  email:     string | null;

  @IsString()
  @IsOptional()
  phone:     string | null;

  @IsString()
  @IsOptional()
  address:   string | null;
 
  @IsString()
  @IsOptional()
  taxId:     string | null;
 
  @IsBoolean()
  isActive:  boolean;
 
  @IsDate()
  createdAt: Date;
  updatedAt: Date;
}