export type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  cost: number;
  isAvailable: boolean;
  imageUrl?: string;
  storageUnit: {
    id?: number;
    name: string;
    unit: number;
  };
  category: {
    id?: number;
    name: string;
  };
};
