import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { RecipeService } from "./recipe.service";
import { RecipeDto } from "./dto/recipe.dto";
import { Public } from "../../auth/common/decorators/public.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("recipe")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./public/img", // guarda localmente por ahora
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === "image/webp" ||
          extname(file.originalname).toLocaleLowerCase() === ".webp"
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Only image/webp is allowed"), false);
        }
      },
    })
  )
  async createRecipe(
    @UploadedFile() file: Express.Multer.File,
    @Body() recipe: RecipeDto
  )
  // : Promise<ResponseDto<ResponseProductDto>> 
  {  
    return this.recipeService.createRecipe(recipe, file);
  }
}
