import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
// ZOD
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema, type ProductFormSchema } from "../schema/product"
// ENDPOINTS
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import { Product} from "../types/product"
// COMPONENTS
import useGlobal from "@/hooks/useGlobal"

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
  // HOOKS
  const { addProduct, updateProduct, getProduct } = useGlobal()
  // STATES
  const [categories, setCategories] = useState([])
  const [storageUnits, setStorageUnits] = useState([])
  const [product, setProduct] = useState<Product | undefined>()

  const [formValues, setFormValues] = useState<ProductFormSchema>({
    name: "",
    description: "",
    stock: 1,
    price: 0,
    storageUnitId: "",
    categoryId: "",
  })

  // FORM
  const form = useForm<ProductFormSchema>({
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
  const loadProductData  = useCallback(async (productId?:number) => {
    try {
      const promises = await Promise.allSettled([
        getCategories(),
        getStorageUnits(),
      ])
      const [cats, units] = promises.map(
        (promise) => promise.status === "fulfilled" ? promise.value : []
      )

      setCategories(cats)
      setStorageUnits(units)

      if (productId) {
        const findProduct = await getProduct(productId)

        if (!findProduct) return

        setProduct(findProduct.data)
        
        form.reset({
          ...findProduct.data,
          storageUnitId: String(findProduct.data?.storageUnit.id),
          categoryId: String(findProduct.data?.category.id),
        })

        setFormValues({
          ...findProduct?.data,
          storageUnitId: String(findProduct?.data?.storageUnit.id),
          categoryId: String(findProduct?.data?.category.id),
        })
      }
    } catch (error) {
      console.error("Error loading product data:", error);
    } 
  }, [form, getProduct])

  // EFFECTS
  useEffect(()=>{
    loadProductData(id)
  }, [id, loadProductData]);
  // HANDLERS
  async function onCreate() {
    const apiData = {
      ...form.getValues(),
      storageUnitId: form.getValues().storageUnitId,
      categoryId: form.getValues().categoryId,
    };
    addProduct(apiData)
  }

  const onUpdate = () => {
    if (!id) return;
    const apiData = {
      ...form.getValues(),
      storageUnitId: form.getValues().storageUnitId,
      categoryId: form.getValues().categoryId,
    };
    updateProduct(id, apiData)
  }

  return {
    form,
    formValues,
    categories,
    storageUnits,
    onCreate,
    onUpdate,
  }
}