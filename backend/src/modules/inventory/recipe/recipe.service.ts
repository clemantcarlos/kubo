import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RecipeDto, ResponseRecipeDto } from './dto/recipe.dto';
import { ResponseDto } from '@/interfaces/getResponse';
import { createImage } from '@/utils/imageHandlers';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaService) {}
  
  async getRecipes() {
    return this.prisma.recipe.findMany();
  }
  async createRecipe(
    recipe: RecipeDto,
    file: Express.Multer.File
  )
  // : Promise<ResponseDto<ResponseRecipeDto>> 
  {
      const { 
        name, 
        description, 
        yieldValue, 
        unitId
      } = recipe;
    
      try {
        const { imageUrl, imageHash } = await createImage(file); // ❌ crea la imagen
        const newRecipe = await this.prisma.recipe.create({
          data: {
            name,
            description,
            yield: yieldValue,
            unit: { connect: { id: unitId } },
            imageHash,
            imageUrl,
          },
        //   select: productSelect,
        });
        return {
          success: true,
          data: []
          // data: newProduct,
        };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new BadRequestException("Product already exists");
          }
          if (e.code === "P2003") {
            throw new BadRequestException(
              "One relationship with product is missing " + e.meta.field_name
            );
          }
          throw new BadRequestException(e);
        }
        throw new BadRequestException(e);
      }
    }
}
