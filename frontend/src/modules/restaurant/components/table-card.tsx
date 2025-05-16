import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Utensils } from "lucide-react"
import { useNavigate } from "react-router"

export default function TableCard({
  id,
  name,
  description,
}: {
  id:number,
  name: string
  description: string
}) {
  const navigate = useNavigate()
  return (
    <Card 
      onClick={() => navigate(`${id}`, {replace: true})} 
      className="flex flex-col items-center gap-4 p-4 border-2 border-border rounded-xl">
      <CardContent className="flex flex-col items-center gap-2">
        <CardTitle className="text-center">{name}</CardTitle>
        <Utensils className="size-16 my-2" />
        {description}
      </CardContent>
    </Card>
  )
}
