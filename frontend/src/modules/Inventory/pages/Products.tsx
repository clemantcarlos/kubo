import { useEffect, useState } from "react";
import { columns } from "../product/components/product-columns";
import { DataTable } from "../product/components/product-data-table";
import { getQuery } from "@/lib/api/queries";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Product } from "../product/types/product";

export default function Products() {
  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);

        const res = await getQuery<Product[]>(
          API_ENDPOINTS.PRODUCTS.BASE_GET(page, 10),
          controller.signal
        );

        setData(res.data);
        setTotalPages(res.meta?.totalPages || 1);
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
  }, [page]);

  return (
    <div className="container mx-auto p-10">
      <DataTable
        page={page}
        totalPages={totalPages}
        data={data}
        columns={columns}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
