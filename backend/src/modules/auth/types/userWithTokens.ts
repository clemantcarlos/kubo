import { User } from '@prisma/client';
import { Tokens } from './tokens.type';

export type UserPublicInfo = {
  id: string;
  name: string;
  email: string;
  identityDocument: string;
  phoneNumber: string;
  address: string;
  role: { id: number, name: string }
  identityDocumentType : { id: number, name: string }
}

export type UserWithTokens = {
  tokens: Tokens;
  user: UserPublicInfo;
};
