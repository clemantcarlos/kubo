import { Supplier } from "@/modules/inventory/supplier/types/supplier.type";
import { deleteQuery, getQuery, GetResponse, postQueryJson, putQueryJson } from "../queries";
import { API_ENDPOINTS } from "../endpoints";
import { SupplierFormSchema } from "@/modules/inventory/supplier/schema/supplier.schema";

type ProductResponse = { 
  suppliers: Supplier[], 
  meta: GetResponse<Supplier[]>['meta'], 
  nextCursor?: number, 
  prevCursor?: number 
}

  export const getSuppliers = async (
    { pageParam = 1, search = '', all = false } : { pageParam?: number, search?: string, all?: boolean}
  ): Promise<ProductResponse> => {
    const controller = new AbortController();

    const res = await getQuery<Supplier[]>(
      API_ENDPOINTS.SUPPLIERS.BASE_GET(pageParam, 10, search, all), 
      controller.signal
    );

    const nextCursor = res.meta.page > res.meta.totalPages ? undefined : res.meta.page + 1;
    const prevCursor = res.meta.page > 1 ? res.meta.page - 1 : undefined;
    
    return {
      suppliers: res.data,
      meta: res.meta,
      nextCursor,
      prevCursor,
    };
  };
  export const getSupplier = async (
    { id }: { id: string }
  ) => {
    const controller = new AbortController();
    return await getQuery<Supplier>(
      API_ENDPOINTS.SUPPLIERS.BY_ID(id),
      controller.signal
    );
  }
  export const addSupplier = async (
    { supplier }: { supplier: SupplierFormSchema }
  ) => {
    const controller = new AbortController();
    return await postQueryJson<Supplier, SupplierFormSchema>(
      API_ENDPOINTS.PRODUCTS.BASE,
      supplier,
      controller.signal
    );
  };
  export const updateSupplier = async (
    { id, supplier } : { id: string, supplier: SupplierFormSchema }
  ) => {
    const controller = new AbortController();
    return await putQueryJson<Supplier, SupplierFormSchema>(
      API_ENDPOINTS.SUPPLIERS.BY_ID(id),
      supplier,
      controller.signal
    );
  };
  export const deleteSupplier = async (
    { id } : { id: string }
  ) => { 
    const controller = new AbortController();
    return await deleteQuery<Supplier>(
      API_ENDPOINTS.SUPPLIERS.BY_ID(id),
      controller.signal
    );
  }