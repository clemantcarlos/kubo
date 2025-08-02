import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// ZOD
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type SupplierFormSchema } from "../schema/supplier.schema";
// COMPONENTS
import useSupplier from "@/queryHooks/useSupplier";

export default function useSupplierForm(id?: string) {
  // HOOKS
  const { 
    // PRODUCT QUERIES
    useSupplierQuery, 
    addSupplierQuery, 
    updateSupplierQuery, 
  } = useSupplier()
  //TODO: HAZ QUE SE REVISE EL CACHE PARA SABER SI SON LOS MISMO DATOS Y ASI AHORRAR UNA LLAMADA AL BACKEND 
  const supplierQuery = useSupplierQuery({id: id!})
  // STATES
  const [formValues, setFormValues] = useState<SupplierFormSchema>({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxId: "",
    isActive: true,
  });

  // FORM
  const form = useForm<SupplierFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      taxId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if(supplierQuery.isSuccess && supplierQuery.data){
      const { data } = supplierQuery.data
      const formData = {
        ...data,
      };
      setFormValues(formData)
      form.reset(formData);
    }
  }, [supplierQuery.isSuccess, supplierQuery.data, form]);

  async function onCreate() {
    const apiData = {
      ...form.getValues(),
    };
    addSupplierQuery.mutateAsync({supplier: apiData});
  }

  const onUpdate = () => {
    if (!id) return;
    const apiData = {
      ...form.getValues(),
    };
    updateSupplierQuery.mutateAsync({id, supplier: apiData});
  };

  return {
    form,
    formValues,
    onCreate,
    onUpdate,
  };
}
