import { useEffect, useState } from "react"
import { columns } from "../components/product-columns"
import { DataTable } from "../components/product-data-table"
async function getData() {
  const products = await fetch("http://localhost:3000/product") 
  const data = await products.json()
  return data
}
 
export default  function Products() {
 const [data, setData] = useState([])

  useEffect(() => {
    getData().then((data) => { setData(data)})
  }, [data])

  return (
    <div className="container mx-auto p-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
