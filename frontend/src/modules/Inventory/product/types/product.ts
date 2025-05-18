export type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  isAvailable: boolean;
  storageUnit: {
    id?: number;
    name: string;
  };
  category: {
    id?: number;
    name: string;
  };
};