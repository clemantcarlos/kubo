import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
// ZOD
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
// ENDPOINTS
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import { Product } from "../types/product"
import { getQuery } from "@/lib/api/queries"
const formSchema = z.object({
  name: z.string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(255, {
      message: "El nombre no puede tener más de 255 caracteres.",
    }),
  description: z.string()
    .min(2, {
      message: "La descripción debe tener al menos 2 caracteres.",
    })
    .max(255, {
      message: "La descripción no puede tener más de 255 caracteres.",
    }),
  stock: z.number().min(1, {
    message: "El stock debe ser mayor a 1.",
  }),
  price: z.number({
    required_error: "Por favor ingrese el precio."
  }),
  storageUnitId: z.string({
    required_error: "Por favor seleccione la unidad de almacenamiento.",
  }),
  categoryId: z.string({
    required_error: "Por favor seleccione la categoría.",
  }),
  image: z.any()
    .refine((file) => file instanceof File || file?.length > 0, {
      message: "La imagen es obligatoria",
    }),
})

const getCategories = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCT_CATEGORIES.BASE)
  const data = await response.json()
  return data
}

const getStorageUnits = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCT_STORAGE_UNITS.BASE)
  const data = await response.json()
  return data
}

export default function useProductForm(id?: number) {  
  const [categories, setCategories] = useState([])
  const [storageUnits, setStorageUnits] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product || {
      name: "",
      description: "",
      stock: 1,
      price: 0,
      storageUnitId: "",
      categoryId: "",
    },
  }) 
  useEffect(()=>{
     const loadStaticData = async () => {
      try {
        const [cats, units] = await Promise.all([
          getCategories(),
          getStorageUnits()
        ]);
        setCategories(cats);
        setStorageUnits(units);
      } catch (error) {
        console.error("Error loading static data:", error);
      }
    };

    const loadProductData = async (id:number, signal: AbortSignal) => {
      try {
        setIsLoading(true);
        const productById = await getQuery<Product>(
          API_ENDPOINTS.PRODUCTS.BY_ID(id),
          signal
        );
        setProduct(productById.data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStaticData();

    if (id) {
      const controller = new AbortController();
      loadProductData(id, controller.signal);
      return () => controller.abort();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      form.reset({
        ...product,
        storageUnitId: String(product?.storageUnit.id),
        categoryId: String(product?.category.id),
      })
    }
  }, [product, id, form])

  async function onCreate(values: z.infer<typeof formSchema>) {
    const { 
      name, 
      description, 
      stock, price, 
      storageUnitId, 
      categoryId, 
      image
    } = values
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stock", String(stock));
    formData.append("price", String(price));
    formData.append("storageUnitId", String(storageUnitId));
    formData.append("categoryId", String(categoryId));
    formData.append("image", image);

    await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
      method: 'POST',
      body: formData,
    })
  }

  const onUpdate = (values: z.infer<typeof formSchema>) => {
    const apiData = {
      ...values,
      storageUnitId: Number(values.storageUnitId),
      categoryId: Number(values.categoryId),
    };
    return apiData
  }

  return {
    form,
    categories,
    storageUnits,
    isLoading,
    onCreate,
    onUpdate,
  }
}