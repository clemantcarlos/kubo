import { Tokens } from "./tokens.type";

type User = {
  name: string;
  id: string;
  email: string;
  identityDocument: string;
  phoneNumber: string;
  address: string;
  password: string;
  hashedRt: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
  identityDocumentTypeId: number;
}
type UserPublicInfo = Pick<
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
