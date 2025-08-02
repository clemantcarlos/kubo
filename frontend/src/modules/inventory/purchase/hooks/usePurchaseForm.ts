import { useState } from "react";
import { useForm } from "react-hook-form";
// ZOD
import { zodResolver } from "@hookform/resolvers/zod";
import {
  // TYPES
  formSchema,
  type PurchaseFormSchema,
} from "../schema/purchase.schema";
// HOOOKS
// UTILS
import useSupplier from "@/queryHooks/useSupplier";
import useUser from "@/queryHooks/useUser";

export default function useProductForm( id?: number ) { 
  const [items, setItems] = useState<any>([]);
  const [formValues] = useState<PurchaseFormSchema>({
    supplierId: "",
    expectedDeliveryDate: new Date,
    notes: "",
  });
  // FORM
  const form = useForm<PurchaseFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      expectedDeliveryDate: new Date(),
      notes: "",
    },
  });
  // HOOKS
  /*
    TODO: Esto se puede optimizar en un futuro:
    - CARGAR SOLO 10 SUPPLIERS CUANDO SE INICIE EL COMPONENTE Y CARGAR LOS DEMAS CON UN DEBOUNCE DE ESCRITURA
    - CARGAR SOLO CUANDO SE LE HAGA CLICK AL COMPONENTE (TAMBIEN SE PODRIA AGRAGAR UN PRE-FETCH EN EL ON FOCUS)
   */ 
  const { useSuppliersQuery } = useSupplier()
  const supplierQuery = useSuppliersQuery({all: true}) 
  const { userQuery } = useUser()
  // const {addPurchaseOrderQuery, updatePurchaseOrderQuery} = usePurchase()

  // HANDLERS
  async function onCreate() {
    const apiData = {
      ...form.getValues(),
      userId : userQuery.data?.id,
    };
    const items = document.querySelectorAll('.item-checker')
    console.log(apiData, items)
    // await addPurchaseOrderQuery.mutateAsync({purchaseOrder: apiData});
  }
  async function onUpdate() {
    if( !id ) return;
    const apiData = {
      ...form.getValues(),
      userId : userQuery.data?.id,
    };
    const items = document.querySelectorAll('.item-checker')
    console.log(apiData, items)
    // await updatePurchaseOrderQuery.mutateAsync({id, purchaseOrder: apiData});
  };

  return {
    form,
    formValues,
    // DATA
    user: userQuery.data,
    suppliers: supplierQuery.data?.suppliers || [],
    // FUNCTIONS
    onCreate,
    onUpdate,
    setItems,
  };
}
