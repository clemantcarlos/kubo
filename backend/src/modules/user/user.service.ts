import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import {
  Prisma,
  User,
  UserIdentityDocumentType,
  UserRole,
} from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { IUsersResponse } from './interfaces/user.interface';
import { UserRoleDto } from './dto/userRole.dto';
import { UserIdentityDocumentTypeDto } from './dto/userIdentityDocumentType.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(skip?: number, take?: number): Promise<IUsersResponse> {
    const count = await this.prisma.user.count();

    if (skip && take) {
      const users = await this.prisma.user.findMany({
        skip: Number(skip),
        take: Number(take),
      });

      return { users, count };
    }

    const users = await this.prisma.user.findMany();
    return { users, count };
  }

  async getUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createdUser(user: CreateUserDto): Promise<User> {
    const { password, ...userWithoutPassword } = user;

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    try {
      const createdUser = await this.prisma.user.create({
        data: { password: hash, ...userWithoutPassword },
      });

      return createdUser;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async searchUser(search: string, skip?: number, take?: number) {
    const count = await this.prisma.user.count();

    if (skip && take) {
      const users = await this.prisma.user.findMany({
        skip: Number(skip),
        take: Number(take),
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              phoneNumber: {
                contains: search,
              },
            },
          ],
        },
      });
      return { users, count };
    }

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
          {
            phoneNumber: {
              contains: search,
            },
          },
        ],
      },
    });
    return { users, count };
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<UpdateUserDto> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        roleId: user.roleId,
        identityDocumentTypeId: user.identityDocumentTypeId,
        identityDocument: user.identityDocument,
      },
    });
    const {
      name,
      email,
      phoneNumber,
      address,
      roleId,
      identityDocumentTypeId,
      identityDocument,
    } = updatedUser;

    return {
      name,
      email,
      phoneNumber,
      address,
      roleId,
      identityDocumentTypeId,
      identityDocument,
    };
  }

  async deletedUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async getUserRoles(): Promise<UserRole[]> {
    return this.prisma.userRole.findMany();
  }

  async createUserRole(userRole: UserRoleDto): Promise<UserRole> {
    try {
      return await this.prisma.userRole.create({
        data: userRole,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('User role already exists');
        }
        throw new BadRequestException(e);
      }
    }
  }

  async getUserIdentityDocumentTypes(): Promise<UserIdentityDocumentType[]> {
    try {
      return await this.prisma.userIdentityDocumentType.findMany();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createUserIdentityDocument(
    userIdentityDocumentType: UserIdentityDocumentTypeDto,
  ): Promise<UserIdentityDocumentType> {
    try {
      return await this.prisma.userIdentityDocumentType.create({
        data: userIdentityDocumentType,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'User identity document type already exists',
          );
        }
        throw new BadRequestException(e);
      }
    }
  }
}
