import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  yieldValue: number;
  
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  unitId: number;
}
export class ResponseRecipeDto {
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
  yieldValue: number;

  @IsNumber()
  @IsNotEmpty()
  unitId: number;
}