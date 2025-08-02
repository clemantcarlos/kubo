export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type User = {
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
  user: User;
};
