import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
// SERVICES
import { 
  addPurchase, 
  deletePurchase, 
  getPurchase, 
  getPurchases, 
  updatePurchase 
} from '@/services/inventory/purchase';
// COMPONENTS
import { toast } from 'sonner';
// TYPES
import { type PurchaseFormSchema } from '@/modules/inventory/purchase/schema/purchase.schema';

export default function usePurchase() {
  const usePurchaseOrdersQuery = (
    { pageParam = 1, search = '' }: { pageParam?: number, search?: string }
  ) => {
    return useQuery({
      queryKey: ['purchase-orders', { pageParam, search: search }],
      queryFn: () => getPurchases({ pageParam, search }),
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: (failureCount, error) => {
        if (failureCount > 3 || !!error) {
          toast.error("Error de conexion", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4",
            },
          });
          return false;
        }
        return true
      },
      retryDelay: 1000,
    })
  }

  const usePurchaseOrderQuery = ({ id }: {id: number}) => {
      return useQuery({
      queryKey: ['purchase-order', id],
      queryFn: () => getPurchase({id}),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }

  const addPurchaseOrderQuery = useMutation({
    mutationKey: ['purchase-order'],
    mutationFn: (
     { purchaseOrder }: { purchaseOrder: PurchaseFormSchema }
    ) => addPurchase({purchaseOrder}),
    onSuccess: (newPurchase) => {
      toast.success("Purchaseo creado exitosamente");
      return newPurchase;
    },
    onError: (err) => {
      toast.error("No se pudo crear la orden de compra", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo crear la orden de compra')
    }
  })

  const updatePurchaseOrderQuery = useMutation({
    mutationKey: ['purchase-order'],
    mutationFn: (
      { id, purchaseOrder }: { id: number, purchaseOrder: PurchaseFormSchema } 
    ) => updatePurchase({ id, purchaseOrder }),
    onSuccess: (newPurchase) => {
      toast.success("Purchaseo actualizado exitosamente");
      return newPurchase;
    },
    onError: (err) => {
      toast.error("No se pudo actualizar la orden de compra", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo actualizar la orden de compra')
    }
  })

  const deletePurchaseOrderQuery = useMutation({
    mutationKey: ['purchase-order'],
    mutationFn: (
      { id }: { id: number }
    ) => deletePurchase({ id }),
    onSuccess: (newPurchase) => {
      toast.success("Orden de compra eliminada exitosamente");
      return newPurchase;
    },
    onError: (err) => {
      toast.error("No se pudo eliminar la orden de compra", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo eliminar la orden de compra')
    }
  })

  return {
    usePurchaseOrdersQuery,
    usePurchaseOrderQuery,
    addPurchaseOrderQuery,
    updatePurchaseOrderQuery,
    deletePurchaseOrderQuery,
  }
}