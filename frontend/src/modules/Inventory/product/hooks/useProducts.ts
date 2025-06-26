import { useEffect, useState } from "react";
// TYPES
import useGlobal from "@/hooks/useGlobal";

export function useProducts(runEffect: boolean = false) {
  const { getProducts, product } = useGlobal()
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!runEffect) return;
    getProducts(page)
  }, [runEffect, page, getProducts]); 

  return {
    data: product.data || [],
    totalPages: product?.meta?.totalPages || 0,
    page,
    setPage,
  };

}