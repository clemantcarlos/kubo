export interface Welcome {
  tokens: Tokens;
  user:   User;
}

export interface Tokens {
  access_token:  string;
  refresh_token: string;
}

export interface User {
  id:                     string;
  name:                   string;
  email:                  string;
  phoneNumber:            string;
  address:                string;
  roleId:                 number;
  identityDocumentTypeId: number;
  identityDocument:       string;
}