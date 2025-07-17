import { useCallback, useReducer } from "react";
// reducers
import { initialState, productReducer } from "@/reducers/product";
// schemas
import { ProductFormSchema } from "@/modules/Inventory/product/schema/product.schema";
// TYPES
import { Product } from "@/modules/Inventory/product/types/product";
// UTILS
import {
  deleteQuery,
  getQuery,
  postQueryFormData,
  putQueryFormData,
  putQueryJson,
} from "@/lib/api/queries";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
// COMPONENTS
import { toast } from "sonner";

export default function useProductState() {
  const [productState, productDispatch] = useReducer(
    productReducer,
    initialState
  );

  const addProduct = async (product: ProductFormSchema) => {
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
    try {
      const newProduct = await postQueryFormData<Product>(
        API_ENDPOINTS.PRODUCTS.BASE,
        formData,
        controller.signal
      );
      productDispatch({
        type: "ADD_PRODUCT",
        payload: newProduct.data,
      });
      toast.success("Producto creado exitosamente");
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          toast.error("No se pudo crear el producto", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4",
            },
          });
        }
      } else {
        toast.error("No se pudo actualizar el producto", {
          unstyled: true,
          classNames: {
            error: "bg-red-500 flex gap-2 rounded-md p-4",
          },
        });
      }
    } finally {
      controller.abort();
    }
  };
  const updateProduct = async (id: number, product: ProductFormSchema)  => {
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

    try {
      const updatedProduct = await putQueryFormData<Product>(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
        formData,
        controller.signal
      );
      if (updatedProduct.success) {
        productDispatch({
          type: "UPDATE_PRODUCT",
          payload: updatedProduct.data,
        });
        toast.success("Producto actualizado exitosamente");
      } else {
        toast.error("No se pudo actualizar el producto", {
          unstyled: true, 
          classNames: {
            error: "bg-red-500 flex gap-2 rounded-md p-4 text-white",
          },
        });
      }
    } catch (err) {
      toast.error("No se pudo actualizar el producto", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
      console.log(err)
    } finally {
      controller.abort();
    }
  };
  const getProducts = useCallback(
    async (
      page: number, 
      search?: string
    ) => {
      const controller = new AbortController();
      try {
        if( search && search.length > 0) {
          const res = await getQuery<Product[]>(
            API_ENDPOINTS.PRODUCTS.BASE_GET(page, 10, search),
            controller.signal
          );
          productDispatch({
            type: "GET_PRODUCTS",
            payload: res,
          });
        return
        }

        const res = await getQuery<Product[]>(
          API_ENDPOINTS.PRODUCTS.BASE_GET(page, 10),
          controller.signal
        );
        productDispatch({ type: "GET_PRODUCTS", payload: res });
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") console.error(err);
        } else {
          console.error("Error desconocido", err);
        }
      } finally {
        controller.abort();
      }
    },
    [productDispatch]
  );
  const getProduct = useCallback(
    async (id: number) => {
      const findProduct = productState.data.find(
        (product) => product.id === id
      );

      if (findProduct)
        return { success: true, data: findProduct, meta: productState.meta };

      const controller = new AbortController();
      try {
        return await getQuery<Product>(
          API_ENDPOINTS.PRODUCTS.BY_ID(id),
          controller.signal
        );
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") console.error(err);
        } else {
          console.error("Error desconocido", err);
        }
      } finally {
        controller.abort();
      }
    },
    [productState]
  );
  const updateStock = useCallback(
    async (id: number, stock: number) => {
      const controller = new AbortController();
      try {
        const changedStockProduct = await putQueryJson<
          Product,
          { stock: number }
        >(
          API_ENDPOINTS.PRODUCTS.UPDATE_STOCK(id),
          { stock: stock },
          controller.signal
        );
        productDispatch({
          type: "UPDATE_STOCK",
          payload: { id, stock },
        });

        toast.success("Producto actualizado exitosamente");
        return changedStockProduct;
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            toast.error("No se pudo actualizar el stock", {
              unstyled: true,
              classNames: {
                error: "bg-red-500 flex gap-2 rounded-md p-4",
              },
            });
          }
        } else {
          toast.error("No se pudo actualizar el stock", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4",
            },
          });
        }
      } finally {
        controller.abort();
      }
    },
    [productDispatch]
  );
  const deleteProduct = useCallback(
    async (id: number) => {
      const controller = new AbortController();
      try {
        const deletedProduct = await deleteQuery<Product>(
          API_ENDPOINTS.PRODUCTS.BY_ID(id),
          controller.signal
        );
        if (deletedProduct.success) {
          productDispatch({
            type: "DELETE_PRODUCT",
            payload: { id },
          });
          toast.success("Producto eliminado exitosamente");
        } else {
          toast.error("No se pudo eliminar el producto", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4 text-white",
            },
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            toast.error("No se pudo eliminar el producto", {
              unstyled: true,
              classNames: {
                error: "bg-red-500 flex gap-2 rounded-md p-4",
              },
            });
          }
        } else {
          toast.error("No se pudo eliminar el producto", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4",
            },
          });
        }
      } finally {
        controller.abort();
      }
    },
    [productDispatch]
  );

  return {
    value : productState,
    methods: {
      getProduct,
      getProducts,
      addProduct,
      updateProduct,
      updateStock,
      deleteProduct,
    }
  };
}