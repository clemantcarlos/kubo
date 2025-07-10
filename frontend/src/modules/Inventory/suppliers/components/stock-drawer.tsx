import { useCallback, useEffect, useRef, useState } from "react";
// ICONS
import { Minus, Plus, ArrowUp, ArrowDown } from "lucide-react";
// UI
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
// TYPES
import { Product } from "../types/supplier.type";
// UTILS
import pluralize from "@/lib/pluralize";
import conparator from "@/lib/conparator";
// HOOKS
import useGlobal from "@/hooks/useGlobal";

type Props = Pick<Product, "storageUnit" | "stock" | "id">;

export function StockDrawer({ id, storageUnit, stock }: Props) {
  const { updateStock } = useGlobal();
  // DESTRUCTURING STORAGE UNIT PARAM
  const { unit, name } = storageUnit;
  // REFS
  const closeButton = useRef<HTMLButtonElement>(null);
  // STATES
  const [isOpen, setIsOpen] = useState(false);
  const [inputStock, setInputStock] = useState<number>(stock);
  const [absoluteDiff, setAbsoluteDiff] = useState<number>(0);
  const [relativeDiff, setRelativeDiff] = useState<number>(0);
  const [sign, setSign] = useState<string>("");

  const onClick = (adjustment: number) => {
    setInputStock(Math.max(0, Math.min(999999999, inputStock + adjustment)));
  };
  const changeProductStock = async () => {
    const response = await updateStock(id, inputStock);
    console.log(response);
    if (response?.success === true) {
      closeButton.current?.click();
    }
  };

  useEffect(() => {
    if (inputStock > stock) {
      setSign("+");
    } else {
      setSign("");
    }
  }, [inputStock, stock]);

  const compare = useCallback(() => {
    const { absoluteDiff, relativeDiff } = conparator(inputStock, stock);
    setAbsoluteDiff(absoluteDiff);
    setRelativeDiff(relativeDiff);
  }, [inputStock, stock]);

  useEffect(() => {
    if (isOpen) {
      compare();
    }
  }, [isOpen, compare]);

  return (
    <Drawer
      onOpenChange={() => {
        setIsOpen(true);
        setInputStock(stock);
      }}
      onClose={() => {
        setInputStock(stock);
        setIsOpen(false);
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">
          {stock} {stock > 1 ? pluralize(storageUnit.name) : storageUnit.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Productos en inventario</DrawerTitle>
            <DrawerDescription
              className={
                absoluteDiff === 0
                  ? "opacity-0"
                  : sign === "+"
                  ? "flex items-center gap-2 text-green-500"
                  : "flex items-center gap-2 text-red-500"
              }
            >
              <b>{`${sign}${absoluteDiff} ${pluralize(storageUnit.name)}`}</b>
              {`(${sign}${relativeDiff}%)`}
              {sign === "+" ? (
                <ArrowUp size={15} className="ml-[-0.5rem]" />
              ) : (
                <ArrowDown size={15} className="ml-[-0.5rem]" />
              )}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-unit)}
                disabled={inputStock <= 1}
              >
                <Minus />
                <span className="sr-only">Decrementar</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="relative text-7xl font-bold tracking-tighter">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="border-none bg-transparent outline-none text-center w-ful max-w-xs"
                    value={inputStock}
                    onChange={(e) => setInputStock(Number(e.target.value))}
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
                disabled={inputStock >= 999999999}
              >
                <Plus />
                <span className="sr-only">Incrementar</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button autoFocus={true} onClick={changeProductStock}>
              Editar
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                aria-labelledby="close-drawer-button"
                ref={closeButton}
              >
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
