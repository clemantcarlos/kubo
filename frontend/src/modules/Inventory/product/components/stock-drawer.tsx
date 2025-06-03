
import { useState } from "react"
// ICONS
import { Minus, Plus } from "lucide-react"
// UI
import { Button } from "@/components/ui/button"
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
// TYPES
import { Product } from "../types/product"
// UTILS
import pluralize from '@/lib/pluralize'

type Props = Pick<Product, 'storageUnit'| 'stock'>

export function StockDrawer({storageUnit, stock}: Props ) {
  const { unit, name } = storageUnit
  const [goal, setGoal] = useState<number>(stock) 

  function onClick(adjustment: number) {
    setGoal(Math.max(0, Math.min(999999999, goal + adjustment)))
  }

  return (
    <Drawer onClose={() => setGoal(stock)}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {stock} {stock > 1 ? pluralize(storageUnit.name) : storageUnit.name}
        </Button> 
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Productos en inventario</DrawerTitle>
            <DrawerDescription>Cambia el stock de este producto.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-(unit))}
                disabled={goal <= 0}
              >
                <Minus />
                <span className="sr-only">Decrementar</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                 <input 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="border-none bg-transparent outline-none text-center w-ful max-w-xs"
                  value={goal} 
                  onChange={(e) => setGoal(Number(e.target.value))} 
                />
                </div>
                <div className="text-muted-foreground text-[0.70rem] uppercase ">
                  {name}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(unit)}
                disabled={goal >= 999999999}
              >
                <Plus />
                <span className="sr-only">Incrementar</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button>Editar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
