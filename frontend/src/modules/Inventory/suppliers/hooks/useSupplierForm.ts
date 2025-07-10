import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// ZOD
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type SupplierFormSchema } from "../schema/supplier.schema";
// ENDPOINTS
import { API_ENDPOINTS } from "@/lib/api/endpoints";
// COMPONENTS
import useGlobal from "@/hooks/useGlobal";


export default function useProductForm(id?: number) {
  // HOOKS
  const { product } = useGlobal();
  // STATES
  const [categories, setCategories] = useState([]);
  const [storageUnits, setStorageUnits] = useState([]);
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

  const loadStaticData = useCallback(async () => {
    try {
      console.log('loading static data')
    } catch (error) {
      console.error("Error loading product data:", error);
    }
  }, []);

  const loadSupplierData = useCallback(
    async (id: number) => {
      try {
        console.log("loading supplier data", id);
      } catch (error) {
        console.error("Error loading product data:", error);
      }
    },
    []
  );

  // EFFECTS
  useEffect(() => {
    loadStaticData();
  }, [loadStaticData]);

  useEffect(() => {
    if (id && categories.length > 0 && storageUnits.length > 0) {
      loadSupplierData(id);
    }
  }, [id, categories, storageUnits, loadSupplierData]);

  // HANDLERS
  async function onCreate() {
    
  }

  const onUpdate = () => {
    
  };

  return {
    form,
    formValues,
    categories,
    storageUnits,
    onCreate,
    onUpdate,
  };
}
