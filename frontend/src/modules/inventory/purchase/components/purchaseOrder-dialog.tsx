import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// ICONS
import { PlusIcon } from 'lucide-react';
// FORM
import { PurchaseForm } from './purchaseOrder-form';
// INTERFACES
import { DialogProps } from '../interfaces/dialogProps';

export function PurchaseOrderDialog({ actionType, id }: DialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        { actionType === 'create' ?
          <Button variant='outline'>
            <PlusIcon />
          </Button>
          : <span>Editar Orden de compra</span>
        }
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            {actionType === 'create'
              ? 'Crear una nueva orden de compra'
              : 'Editar orden de compra'}
          </DialogTitle>
          <DialogDescription>
            {actionType === 'create'
              ? 'Ingresa los datos de la orden de compra'
              : 'Edita los datos de la orden de compra'}
          </DialogDescription>
        </DialogHeader>
        <div>
          <PurchaseForm actionType = { actionType } id = { id }/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
