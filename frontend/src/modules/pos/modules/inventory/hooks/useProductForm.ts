import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// ZOD
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type ProductFormSchema } from "../schema/product.schema";
// COMPONENTS
import useProduct from "@/queryHooks/useProduct";

export default function useProductForm(id?: number) {
   // STATES
  const [formValues, setFormValues] = useState<ProductFormSchema>({
    name: "",
    description: "",
    stock: 1,
    price: 0,
    cost: 0,
    storageUnitId: "",
    categoryId: "",
  });
  // FORM
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      stock: 1,
      cost: 0,
      price: 0,
      storageUnitId: "",
      categoryId: "",
    },
  });

  // HOOKS
  const { 
    // PRODUCT QUERIES
    useProductQuery, 
    addProductQuery, 
    updateProductQuery, 
    // STATIC QUERIES
    queryCategory, 
    queryStorageUnit 
  } = useProduct()
  //TODO: HAZ QUE SE REVISE EL CACHE PARA SABER SI SON LOS MISMO DATOS Y ASI AHORRAR UNA LLAMADA AL BACKEND 
  const productQuery = useProductQuery({id: id!})

   useEffect(() => {
    if(productQuery.isSuccess && productQuery.data){
      const { name, description, stock, price, cost } = productQuery.data;
      
      const storageUnitId = String(productQuery.data.storageUnit.id);
      const categoryId = String(productQuery.data.category.id);

      
      const formData = {
        name,
        description,
        stock,
        cost,
        price,
        storageUnitId,
        categoryId,
      };

      setFormValues(formData)
      form.reset(formData);
    }
  }, [productQuery.isSuccess, productQuery.data, form]);
 

  // HANDLERS
  async function onCreate() {
    const apiData = {
      ...form.getValues(),
      storageUnitId: form.getValues().storageUnitId,
      categoryId: form.getValues().categoryId,
    };
    addProductQuery.mutateAsync({product: apiData});
  }

  const onUpdate = () => {
    if (!id) return;
    const apiData = {
      ...form.getValues(),
      storageUnitId: form.getValues().storageUnitId,
      categoryId: form.getValues().categoryId,
    };
    updateProductQuery.mutateAsync({id, product: apiData});
  };

  return {
    form,
    formValues,
    categories: queryCategory.data,
    storageUnits: queryStorageUnit.data,
    onCreate,
    onUpdate,
  };
}
