// UTILS
import { GetResponse } from "@/lib/api/queries"
// TYPES
import { Purchase } from '@/modules/Inventory/purchase/types/purchase.type' 

export const initialState: GetResponse<Purchase[]> = {
  success: true,
  data: [],
  meta: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
}

type PurchaseAction =  
  | { type: 'ADD_PURCHASE', payload: Purchase} 
  | { type: 'UPDATE_PURCHASE', payload: Purchase}
  | { type: 'GET_PURCHASES', payload: GetResponse<Purchase[]> }
  | { type: 'DELETE_PURCHASE', payload: { id: number } }  

export function purchaseReducer(
  state: GetResponse<Purchase[]>, 
  action: PurchaseAction
): GetResponse<Purchase[]> {
  const { payload: actionPayload, type: actionType} = action 
  switch (actionType) {
    case 'ADD_PURCHASE': {
      const newState: GetResponse<Purchase[]> = {
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
    case 'UPDATE_PURCHASE': {
      const newState: GetResponse<Purchase[]> = {
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
    case 'GET_PURCHASES': {
      return {
        ...state,
        data: actionPayload.data,
        meta: actionPayload.meta
      }
    }
    case 'DELETE_PURCHASE': {
      const newState = {
        ...state,
        data: state.data.reduce((acc: Purchase[], purchase: Purchase) => {
          if (purchase.id === actionPayload.id) {
            acc.unshift(purchase);
            acc.shift();
          } else {
            acc.push(purchase);
          }
          return acc;
        }, [])
      };
      return newState
    }
  }
  return state
}