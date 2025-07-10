export type Supplier = {
  id:        string;
  name:      string;
  email:     string | null;
  phone:     string | null;
  address:   string | null;
  taxId:     string | null;
  isActive:  boolean;
  createdAt: Date;
  updatedAt: Date;
};
