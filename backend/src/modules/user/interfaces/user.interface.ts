import { User } from '@prisma/client';

export interface IUsersResponse {
  users: User[];
  count: number;
}
