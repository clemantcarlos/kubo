import { User } from '@prisma/client';
import { Tokens } from './tokens.type';

export type UserPublicInfo = Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'phoneNumber'
  | 'address'
  | 'roleId'
  | 'identityDocumentTypeId'
  | 'identityDocument'
>;

export type UserWithTokens = {
  tokens: Tokens;
  user: UserPublicInfo;
};
