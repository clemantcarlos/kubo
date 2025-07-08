import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {  BadgePercent, Circle, CircleCheck, PenLine, ReceiptText, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  { name: 'All Menu', count: 110, active: true },
  { name: 'Breads', count: 20 },
  { name: 'Cakes', count: 20 },
  { name: 'Donuts', count: 20 },
  { name: 'Pastries', count: 20 },
  { name: 'Sandwich', count: 20 },
];

export default function POSHome() {
  const [catSelected, setCatSelected] = useState<string>(categories[0]?.name || '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [billPrducts] = useState<any>([]);

  const handleSelect = (name: string) => {
    setCatSelected(name);
  };

  return (
    <div className='w-full h-full grid grid-cols-6 p-2 bg-input dark:bg-background'>
      <main className='col-span-4 gap-2'>
        <header className='flex gap-2 pb-2 overflow-x-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
           {categories.map((cat) => (
            <Button
              key={cat.name}
              variant = 'outline'
              onClick={() => handleSelect(cat.name)}
              className = { cat.name === catSelected 
                ? 'flex flex-col items-start justify-end p-4 h-30 w-40 bg-blue-50 border-blue-500 dark:bg-background dark:border-amber-50'
                : 'flex flex-col items-start justify-end p-4 h-30 w-40'
              }
            >
              {cat.name === catSelected ? <CircleCheck color = 'blue' /> : <Circle color='gray'/>}   
              <span className='font-semibold m-0 p-0'>{cat.name}</span>
              <span className='text-xs text-muted-foreground m-0 p-0'>{cat.count} items</span>
            </Button>
          ))}
        </header>
        <section className='pr-2'>
          <div className='flex items-center p-2 rounded-full bg-white dark:bg-input/30'>
            <Input 
              className='rounded-full border-0 bg-transparent shadow-none dark:bg-transparent focus-visible:ring-0 '
              placeholder='Busca algo para vender...'
            />
            <span className='bg-accent dark:bg-input p-2 rounded-full'>
              <Search  className='size-4'/>
            </span>
          </div>
        </section>
      </main>
      <aside 
        className='flex flex-col col-span-2 sm:col-span-2 bg-background rounded-r-lg'
        style={{ boxShadow: '-8px 0 16px -4px rgba(0,0,0,0.20)' }}
      >
        <header className='flex justify-between items-center p-2 shadow-md/[0.03]'>
          <Button variant = 'secondary' size = 'icon' className = 'size-12 rounded-full'>
            <ReceiptText />
          </Button>
          <p className='flex-1 text-center text-zinc-400'>
            <h2 className='text-2xl'>
              Nombre del Cliente
            </h2>
            <span className='text-xs'>Numero de Orden #000</span>
          </p>
          <Button variant = 'secondary' size = 'icon' className = 'size-12 rounded-full'>
            <PenLine />
          </Button>
        </header>
        <div className='flex items-center gap-2 p-2 shadow-lg/[0.03]'>
            <Select >
              <SelectTrigger className = 'flex-1'>
                <SelectValue placeholder="Selecciona una mesa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Menu">All Menu</SelectItem>
                <SelectItem value="Breads">Breads</SelectItem>
                <SelectItem value="Cakes">Cakes</SelectItem>
                <SelectItem value="Donuts">Donuts</SelectItem>
                <SelectItem value="Pastries">Pastries</SelectItem>
                <SelectItem value="Sandwich">Sandwich</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className = 'flex-1'>
                <SelectValue placeholder="Tipo de Orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Menu">All Menu</SelectItem>
                <SelectItem value="Breads">Breads</SelectItem>
                <SelectItem value="Cakes">Cakes</SelectItem>
                <SelectItem value="Donuts">Donuts</SelectItem>
                <SelectItem value="Pastries">Pastries</SelectItem>
                <SelectItem value="Sandwich">Sandwich</SelectItem>
                <SelectItem value="Sandwich">Sandwich</SelectItem>
              </SelectContent>
            </Select>
        </div>
        <div className='flex-1'>
          {
            billPrducts.length === 0 && 
            <div className='mx-4 py-10 text-center text-zinc-300 border-b-2 border-dashed'>
              Ningun producto seleccionado
            </div>
          }
          {billPrducts?.map((product) => (<></>))}
        </div>
        <footer>
          <div style={{ boxShadow:'0 -8px 16px -4px rgba(0,0,0,0.10)' }}>
            <div className = 'grid grid-cols-6 pt-4 pb-2   mx-4 font-medium border-dashed text-zinc-400'> 
              <span className = 'col-span-4'>
                Subtotal
              </span>
              <span className = 'text-center'>$</span>
              <span className = 'text-end'>0.00</span>
            </div>
            <div className = 'grid grid-cols-6 pb-4 mx-4 font-medium text-xs text-zinc-300'> 
              <span className = 'col-span-4'>
                IVA 10%
              </span>
              <span className = 'text-center'>$</span>
              <span className = 'text-end'>0.00</span>
            </div>
            <div className = 'grid grid-cols-6 py-4 mx-4 border-t-2 border-dashed'> 
              <span className = 'col-span-4'>
                TOTAL
              </span>
              <span className = 'text-center'>$</span>
              <span className = 'text-end'>0.00</span>
            </div>
          </div>
          <div 
            className='w-full flex gap-2 p-2'
            style={{ boxShadow:'0 -8px 8px -4px rgba(0,0,0,0.10)' }}
          >
            <div className='flex-1 flex items-center px-2 rounded-full bg-input dark:bg-input/30'>
              <Input
                className='rounded-full border-0 bg-transparent shadow-none dark:bg-transparent focus-visible:ring-0 dark:placeholder:text-muted-foreground'
                placeholder='Agrega promo o cupon'
              />
              <span className='bg-accent dark:bg-input p-1 rounded-full'>
                <BadgePercent  className='size-4'/>
              </span>
            </div>
            <Button className = 'flex-1 rounded-full' variant = 'outline'>
              Metodo de Pago
            </Button>
          </div>
          <Button 
            className = 'w-full bg-blue-500 rounded-none rounded-br-lg py-8 font-light text-xl hover:bg-blue-600 dark:bg-white dark:hover:bg-white/90'
          >
            Realizar Pedido
          </Button>
        </footer>
      </aside>
    </div>
  );
}
