// UTILS
import { GetResponse } from "@/lib/api/queries"
// TYPES
import { Supplier } from "@/modules/Inventory/suppliers/types/supplier.type"

export const initialState: GetResponse<Supplier[]> = {
  success: true,
  data: [],
  meta: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
}

type SupplierAction =  
  | { type: 'ADD_SUPPLIER', payload: Supplier} 
  | { type: 'UPDATE_SUPPLIER', payload: Supplier}
  | { type: 'GET_SUPPLIERS', payload: GetResponse<Supplier[]> }
  | { type: 'DELETE_SUPPLIER', payload: { id: string } }  

export function supplierReducer(
  state: GetResponse<Supplier[]>, 
  action: SupplierAction
): GetResponse<Supplier[]> {
  const { payload: actionPayload, type: actionType} = action 
  switch (actionType) {
    case 'ADD_SUPPLIER': {
      const newState: GetResponse<Supplier[]> = {
        ...state,
        data: [actionPayload, ...state.data],
        meta: {
          ...state.meta,
          total: (state.meta?.total || 0) + 1,
          page: state.meta?.page || 1,
          totalPages: state.meta?.totalPages || 1
        }
      }
      return newState
    }
    case 'UPDATE_SUPPLIER': {
      const newState: GetResponse<Supplier[]> = {
        ...state,
        data: state.data.map(product => {
          if (product.id === actionPayload.id) {
            return actionPayload
          } 
          return product
        }),
      }

      return newState
    }
    case 'GET_SUPPLIERS': {
      return {
        ...state,
        data: actionPayload.data,
        meta: actionPayload.meta
      }
    }
    case 'DELETE_SUPPLIER': {
      const newState = {
        ...state,
        data: state.data.reduce((acc: Supplier[], supplier: Supplier) => {
          if (supplier.id === actionPayload.id) {
            acc.unshift(supplier);
            acc.shift();
          } else {
            acc.push(supplier);
          }
          return acc;
        }, [])
      };
      return newState
    }
  }
  return state
}