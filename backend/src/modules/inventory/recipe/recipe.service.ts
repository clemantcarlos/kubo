import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaService) {}
  
  async createRecipe(recipe: RecipeDto) {
    return this.prisma.recipe.create({
      data: recipe,
    });
  }
}
