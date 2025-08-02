import { API_ENDPOINTS } from "@/services/endpoints";
import { 
  deleteQuery,
  getQuery,
  postQueryFormData, 
  putQueryFormData, 
  putQueryJson, 
  // SERVICES - TYPES
  type GetResponse, 
} from "@/services/queries"; 
// FORM - TYPES
import { type ProductFormSchema } from "@/modules/inventory/product/schema/product.schema";
import { type Product } from "@/modules/inventory/product/types/product";

type ProductResponse = { 
  products: Product[], 
  meta: GetResponse<Product[]>['meta'], 
  nextCursor?: number, 
  prevCursor?: number 
}

export const getProducts = async (
  { pageParam = 1, search = '' } : { pageParam?: number, search?: string }
): Promise<ProductResponse> => {
  const controller = new AbortController();

  const res = await getQuery<Product[]>(
    API_ENDPOINTS.PRODUCTS.BASE_GET(pageParam, 10, search),
    controller.signal
  );

  const nextCursor = res.meta.page > res.meta.totalPages ? undefined : res.meta.page + 1;
  const prevCursor = res.meta.page > 1 ? res.meta.page - 1 : undefined;
  
  return {
    products: res.data,
    meta: res.meta,
    nextCursor,
    prevCursor,
  };
};

export const getProduct = async (
  { id } : { id: number }
): Promise<Product> => {
  const controller = new AbortController();
  const res = await getQuery<Product>(
    API_ENDPOINTS.PRODUCTS.BY_ID(id),
    controller.signal
  );
  return res.data;
};

export const addProduct = async (
  { product }: { product: ProductFormSchema }
): Promise<GetResponse<Product>> => {
  const controller = new AbortController();
  const { name, description, stock, price, storageUnitId, categoryId, image } =
    product;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("stock", String(stock));
  formData.append("price", String(price));
  formData.append("storageUnitId", String(storageUnitId));
  formData.append("categoryId", String(categoryId));
  formData.append("image", image);

  return await postQueryFormData<Product>(
    API_ENDPOINTS.PRODUCTS.BASE,
    formData,
    controller.signal
  );
};

 export const updateProduct = async (
  { id, product }: { id: number, product: ProductFormSchema }
 ) => {
    const controller = new AbortController();
    const {
      name,
      description,
      stock,
      price,
      storageUnitId,
      categoryId,
      image,
    } = product;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stock", String(stock));
    formData.append("price", String(price));
    formData.append("storageUnitId", String(storageUnitId));
    formData.append("categoryId", String(categoryId));
    formData.append("image", image);

    return await putQueryFormData<Product>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id),
      formData,
      controller.signal
    );
  };
   export const updateStock = async (
    { id, stock }: { id: number, stock: number }
   ) => {
      const controller = new AbortController();
      return await putQueryJson<Product,{ stock: number }>(
        API_ENDPOINTS.PRODUCTS.UPDATE_STOCK(id),
        { stock: stock },
        controller.signal
      );
    }
  export const deleteProduct = async (
    { id }: { id: number }
  ) => {
    const controller = new AbortController();
    return await deleteQuery<Product>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id),
      controller.signal
    );
  }
export const getCategories = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  const data = await response.json();
  return data;
};
export const getStorageUnits = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.STORAGE_UNITS);
  const data = await response.json();
  return data;
};
