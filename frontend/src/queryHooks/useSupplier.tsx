import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
// SERVICES
import { addSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from '@/services/inventory/supplier';
// COMPONENTS
import { toast } from 'sonner';
// TYPES
import { type SupplierFormSchema } from '@/modules/inventory/supplier/schema/supplier.schema';

export default function useSupplier() {
  const useSuppliersQuery = (
    { pageParam = 1, search = '', all = false }: { pageParam?: number, search?: string, all?: boolean }
  ) => {
    return useQuery({
      queryKey: ['suppliers', { pageParam, search: search, all }],
      queryFn: () => getSuppliers({ pageParam, search, all }),
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

  const useSupplierQuery = ({ id }: {id: string}) => {
      return useQuery({
      queryKey: ['supplier', id],
      queryFn: () => getSupplier({id}),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }

  const addSupplierQuery = useMutation({
    mutationKey: ['supplier'],
    mutationFn: (
     { supplier }: { supplier: SupplierFormSchema }
    ) => addSupplier({supplier}),
    onSuccess: (newSupplier) => {
      toast.success("Suppliero creado exitosamente");
      return newSupplier;
    },
    onError: (err) => {
      toast.error("No se pudo crear el suppliero", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo crear el suppliero')
    }
  })

  const updateSupplierQuery = useMutation({
    mutationKey: ['supplier'],
    mutationFn: (
      { id, supplier }: { id: string, supplier: SupplierFormSchema } 
    ) => updateSupplier({ id, supplier }),
    onSuccess: (newSupplier) => {
      toast.success("Suppliero actualizado exitosamente");
      return newSupplier;
    },
    onError: (err) => {
      toast.error("No se pudo actualizar el suppliero", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo actualizar el suppliero')
    }
  })

  const deleteSupplierQuery = useMutation({
    mutationKey: ['supplier'],
    mutationFn: (
      { id }: { id: string }
    ) => deleteSupplier({ id }),
    onSuccess: (newSupplier) => {
      toast.success("Suppliero eliminado exitosamente");
      return newSupplier;
    },
    onError: (err) => {
      toast.error("No se pudo eliminar el suppliero", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo eliminar el suppliero')
    }
  })

  return {
    useSuppliersQuery,
    useSupplierQuery,
    addSupplierQuery,
    updateSupplierQuery,
    deleteSupplierQuery,
  }
}