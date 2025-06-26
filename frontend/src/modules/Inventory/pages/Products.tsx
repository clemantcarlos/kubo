import { columns } from "../product/components/product-columns";
import { DataTable } from "../product/components/product-data-table";
// HOOKS
import { useProducts } from "../product/hooks/useProducts";

export default function Products() {
const { data, page, setPage, totalPages } = useProducts(true);
  return (
    <div className="container mx-auto p-10">
      <DataTable
        data={data}
        columns={columns}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
}
