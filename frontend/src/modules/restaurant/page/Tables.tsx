import TableCard from "../components/table-card"

const mesas = [
  {
    id: 1,
    name: "Mesa 1",
    description: "Descripción de la mesa 1",
    createdAt: new Date(),
    updatedAt: new Date(),
    waiterId: 1,
  },
  {
    id: 2,
    name: "Mesa 2",
    description: "Descripción de la mesa 2",
    createdAt: new Date(),
    updatedAt: new Date(),
    waiterId: 2,
  },
  {
    id: 3,
    name: "Mesa 3",
    description: "Descripción de la mesa 3",
    createdAt: new Date(),
    updatedAt: new Date(),
    waiterId: 1,
  }
]
export default function Mesas() {

  if(!mesas || mesas.length === 0) {
    return <div className="flex flex-1 flex-col gap-4 p-4">
    <div className="grid auto-rows-min gap-4 md:grid-cols-5">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl bg-muted/50" />
      ))}
    </div>
  </div>
  }
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-10">
    <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {mesas.map((mesa, i) => (
        <TableCard 
          key={i} 
          id = {mesa.id}
          name={mesa.name} 
          description={mesa.description} />
      ))}
    </div>
  </div>
  )
}