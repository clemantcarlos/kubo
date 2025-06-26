// UTILS
import { GetResponse } from "@/lib/api/queries"
// TYPES
import { Product } from "@/modules/Inventory/product/types/product"

export const initialState: GetResponse<Product[]> = {
  success: true,
  data: [],
  meta: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
}

type ProductAction =  
  | { type: 'ADD_PRODUCT', payload: Product} 
  | { type: 'UPDATE_PRODUCT', payload: Product}
  | { type: 'GET_PRODUCTS', payload: GetResponse<Product[]> }
  | { type: 'UPDATE_STOCK', payload: { id: number, stock: number } }
  | { type: 'DELETE_PRODUCT', payload: { id: number } }

export function productReducer(state: GetResponse<Product[]>, action: ProductAction): GetResponse<Product[]> {
  const { payload: actionPayload, type: actionType} = action 
  switch (actionType) {
    case 'ADD_PRODUCT': {
      const newState: GetResponse<Product[]> = {
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
    case 'UPDATE_PRODUCT': {
      const newState: GetResponse<Product[]> = {
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
    case 'GET_PRODUCTS': {
      return {
        ...state,
        data: actionPayload.data,
        meta: actionPayload.meta
      }
    }
    case 'UPDATE_STOCK': {
      const newState = {
        ...state,
        data: state.data.reduce((acc: Product[], product: Product) => {
          if (product.id === actionPayload.id) {
            acc.unshift({ 
              ...product, 
              stock: actionPayload.stock 
            });
          } else {
            acc.push(product);
          }
          return acc;
        }, [])
      };
      return newState
    }
    case 'DELETE_PRODUCT': {
      const newState = {
        ...state,
        data: state.data.reduce((acc: Product[], product: Product) => {
          if (product.id === actionPayload.id) {
            acc.unshift(product);
            acc.shift();
          } else {
            acc.push(product);
          }
          return acc;
        }, [])
      };
      return newState
    }
  }
  return state
}