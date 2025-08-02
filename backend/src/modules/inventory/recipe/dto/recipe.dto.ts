export class RecipeDto {
  name: string;
  description: string;
  yield: number;
  unit: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}