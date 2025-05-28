import { useEffect, useState } from "react";
import { type Product  } from "../product/types/product";
import { getQuery } from "@/lib/api/queries";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export default function Product() {
  const [data, setData] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      const id = window.location.pathname.split("/").pop();
      if (!id) return;
      const controller = new AbortController();
      const loadData = async () => {
        try {
          setIsLoading(true);
  
          const res = await getQuery<Product>(
            API_ENDPOINTS.PRODUCTS.BY_ID(Number(id)),
            controller.signal
          );
  
          console.log(res)
          setData(res.data);
        } catch (err) {
          if (err instanceof Error) {
            if (err.name !== "AbortError") console.error(err);
          } else {
            console.error("Error desconocido", err);
          }
        } finally {
          setIsLoading(false);
        }
      };
  
      loadData();
      return () => controller.abort();
    }, []);

  return (
    <div className="container mx-auto p-10">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold">Producto</h1>
          <p className="text-xl">
            {data?.name} - {data?.price}
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold">Descripción</h1>
          <p className="text-xl">{data?.description}</p>
        </div>
      </div>
    </div>
  );
}