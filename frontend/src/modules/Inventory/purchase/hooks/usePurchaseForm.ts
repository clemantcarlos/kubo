import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// ZOD
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  type PurchaseFormSchema,
} from "../schema/purchase.schema";
// COMPONENTS
import useGlobal from "@/hooks/useGlobal";

export default function useProductForm(id?: string) {
  // HOOKS
  const { supplier } = useGlobal();
  const { getSupplier, updateSupplier, addSupplier } = supplier.methods;
  // STATES
  const [formValues, setFormValues] = useState<PurchaseFormSchema>({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxId: "",
    isActive: true,
  });

  // FORM
  const form = useForm<PurchaseFormSchema>({
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

  const loadSupplierData = useCallback(
    async (id: string) => {
      try {
        const supplier = await getSupplier(id);
        if (!supplier) return;
        const { data } = supplier;
        setFormValues({
          ...data,
        });
        form.reset({
          ...data,
        });
      } catch (error) {
        console.error("Error loading product data:", error);
      }
    },
    [form, getSupplier]
  );

  useEffect(() => {
    if (id) {
      loadSupplierData(id);
    }
  }, [id, loadSupplierData]);

  // HANDLERS
  async function onCreate() {
    const apiData = {
      ...form.getValues(),
    };
    addSupplier(apiData);
  }

  const onUpdate = () => {
    if (!id) return;
    const apiData = {
      ...form.getValues(),
    };
    updateSupplier(id, apiData);
  };

  return {
    form,
    formValues,
    onCreate,
    onUpdate,
  };
}
