import { Controller, Post } from "@nestjs/common";
import { RecipeService } from "./recipe.service";
import { Public } from "../../auth/common/decorators/public.decorator";

@Controller("recipe")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Public()
  @Post()
  async createRecipe(@Body() recipe: RecipeDto) {
    return this.recipeService.createRecipe(recipe);
  }
}
