import {
  Controller,
  Get,
  Param,
  HttpCode,
  NotFoundException,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Query,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { Public } from 'src/modules/auth/common/decorators/public.decorator';
import { IUsersResponse } from './interfaces/user.interface';
import { UserRoleDto } from './dto/userRole.dto';
import { UserIdentityDocumentTypeDto } from './dto/userIdentityDocumentType.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query() query?: { skip?: number; take?: number },
  ): Promise<IUsersResponse> {
    const { skip, take } = query;

    const users = this.userService.getAllUsers(skip, take);
    if (!users) throw new NotFoundException();

    return users;
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  async getUserById(@Param('id') id: string) {
    const user = this.userService.getUserById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Public()
  @Get('search/:search')
  @HttpCode(HttpStatus.OK)
  async searchUser(@Param('search') search: string) {
    const user = this.userService.searchUser(search);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Public()
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    const getUser = await this.userService.getUserById(id);
    if (!getUser) throw new NotFoundException();

    const updatedUser = this.userService.updateUser(id, user);

    if (!updatedUser) throw new NotFoundException();

    return updatedUser;
  }

  @Public()
  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id') id: string) {
    const user = this.userService.deletedUser(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Public()
  @Get('role')
  @HttpCode(200)
  async getUserRoles() {
    const users = this.userService.getUserRoles();

    if (!users) throw new NotFoundException();

    return users;
  }

  @Public()
  @Post('role')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async createUserRole(@Body() userRole: UserRoleDto) {
    const createdUserRole = this.userService.createUserRole(userRole);

    if (!createdUserRole) throw new NotFoundException();

    return createdUserRole;
  }

  @Public()
  @Get('identity-document-type')
  @HttpCode(200)
  async getUserIdentityDocumentTypes() {
    const users = this.userService.getUserIdentityDocumentTypes();

    if (!users) throw new NotFoundException();

    return users;
  }

  @Public()
  @Post('identity-document-type')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async createUserIdentityDocumentType(
    @Body() userIdentityDocumentType: UserIdentityDocumentTypeDto,
  ) {
    const createdUserIdentityDocumentType =
      this.userService.createUserIdentityDocument(userIdentityDocumentType);

    if (!createdUserIdentityDocumentType) throw new NotFoundException();

    return createdUserIdentityDocumentType;
  }
}
