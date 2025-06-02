import { useEffect, useState } from "react";
// UI
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
// API
import { getQuery } from "@/lib/api/queries";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api/endpoints";
// TYPES
import { type Product  } from "../product/types/product";
// HOOKS
import useSpinner from "@/hooks/useSpinner";

export default function Product({id} : { id: number; }){
  const [data, setData] = useState<Product>();
  const { showSpinner, hideSpinner } = useSpinner()
  
  useEffect(() => {
      if (!id) return;
      const controller = new AbortController();
      const loadData = async () => {
        try {
          showSpinner();
          const res = await getQuery<Product>(
            API_ENDPOINTS.PRODUCTS.BY_ID(id),
            controller.signal
          );
          setData(res.data);
        } catch (err) {
          if (err instanceof Error) {
            if (err.name !== "AbortError") console.error(err);
          } else {
            console.error("Error desconocido", err);
          }
        } finally {
          hideSpinner();
        }
      };
  
      loadData();
      return () => controller.abort();
    }, [id, showSpinner, hideSpinner]
  );

  return (
    <Drawer>
      <DrawerTrigger>Detalles del producto</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto ">
        <DrawerHeader className="flex-row">
          <img src={API_BASE_URL + data?.imageUrl} alt="producto" className="h-24 w-24 rounded-full" />
          <div className="flex-1 flex flex-col justify-center">
            <DrawerTitle>Nombre: {data?.name}</DrawerTitle>
            <DrawerDescription>Descripcion: {data?.description}</DrawerDescription>
          </div>
        </DrawerHeader>
        <DrawerFooter className="flex-row">
          <Button className="flex-1">Submit</Button>
          <DrawerClose className="flex-1">
            <Button className="w-full"  variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}