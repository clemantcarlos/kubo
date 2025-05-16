import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  cedulaRegex,
  passwordRegex,
  phoneRegex,
} from '@/utils/constants.regex';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(phoneRegex)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  identityDocument: string;
  // @IsString()
  // @IsNotEmpty()
  // @Matches(cedulaRegex)
  // cedula: string;

  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegex)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  address: string;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @IsNumber()
  @IsNotEmpty()
  identityDocumentTypeId: number;

  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}
export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(phoneRegex)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  identityDocument: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  address: string;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @IsNumber()
  @IsNotEmpty()
  identityDocumentTypeId: number;
}
