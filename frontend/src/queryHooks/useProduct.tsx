import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
// SERVICES
import { 
  addProduct, 
  getProduct, 
  getProducts, 
  updateProduct,
  updateStock,
  getStorageUnits, 
  getCategories,
  deleteProduct, 
} from '@/services/inventory/product';
// COMPONENTS
import { toast } from 'sonner';
// TYPES
import { type ProductFormSchema } from '@/modules/inventory/product/schema/product.schema';

export default function useProduct() {
  const queryCategory = useQuery({
    queryKey: ['product-categories'],
    queryFn: getCategories,
    staleTime: Infinity, // ⭐️ always clean data (dont reload automatically)
    gcTime: 24 * 60 * 60 * 1000, // Cache for 24hrs (opt)
  })

  const queryStorageUnit = useQuery({
    queryKey: ['storage-units'],
    queryFn: getStorageUnits,
    staleTime: Infinity, // ⭐️ always clean data (dont reload automatically)
    gcTime: 24 * 60 * 60 * 1000, // Cache for 24hrs (opt)
  })

  const useProductsQuery = (
    { pageParam = 1, search = '' }: { pageParam?: number, search?: string }
  ) => {
    return useQuery({
      queryKey: ['products', { pageParam, search: search }],
      queryFn: () => getProducts({ pageParam, search }),
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

  const useProductQuery = ({ id }: {id: number}) => {
      return useQuery({
      queryKey: ['product', id],
      queryFn: () => getProduct({id}),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }

  const addProductQuery = useMutation({
    mutationKey: ['product'],
    mutationFn: (
     { product }: { product: ProductFormSchema }
    ) => addProduct({product}),
    onSuccess: (newProduct) => {
      toast.success("Producto creado exitosamente");
      return newProduct;
    },
    onError: (err) => {
      toast.error("No se pudo crear el producto", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo crear el producto')
    }
  })

  const updateProductQuery = useMutation({
    mutationKey: ['product'],
    mutationFn: (
      { id, product }: { id: number, product: ProductFormSchema } 
    ) => updateProduct({ id, product }),
    onSuccess: (newProduct) => {
      toast.success("Producto actualizado exitosamente");
      return newProduct;
    },
    onError: (err) => {
      toast.error("No se pudo actualizar el producto", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo actualizar el producto')
    }
  })

  const updateStockQuery = useMutation({
    mutationKey: ['product'],
    mutationFn: (
      { id, stock }: { id: number, stock: number } 
    ) => updateStock({ id, stock }),
    onSuccess: (newProduct) => {
      toast.success("Producto actualizado exitosamente");
      return newProduct;
    },
    onError: (err) => {
      toast.error("No se pudo actualizar el producto", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo actualizar el producto')
    }
  })  

  const deleteProductQuery = useMutation({
    mutationKey: ['product'],
    mutationFn: (
      { id }: { id: number }
    ) => deleteProduct({ id }),
    onSuccess: (newProduct) => {
      toast.success("Producto eliminado exitosamente");
      return newProduct;
    },
    onError: (err) => {
      toast.error("No se pudo eliminar el producto", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      throw new Error(err + ' No se pudo eliminar el producto')
    }
  })

  return {
    useProductsQuery,
    useProductQuery,
    addProductQuery,
    updateProductQuery,
    deleteProductQuery,
    updateStockQuery,
    queryCategory,
    queryStorageUnit
  }
}