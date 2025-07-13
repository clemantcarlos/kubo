export type Supplier = {
  id:        string;
  name:      string;
  email?:     string;
  phone?:     string;
  address?:   string;
  taxId?:     string;
  isActive:  boolean;
  createdAt: Date;
  updatedAt: Date;
};
