import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { GetResponse, ResponseDto } from '@/interfaces/getResponse';
import {
  CreatePurchaseOrderDto,
  ApprovePurchaseOrderDto,
  CancelPurchaseOrderDto,
  CreatePurchaseReceiptDto,
  CreateInvoiceDto,
  PayInvoiceDto,
  PurchaseOrderStatus,
  InvoiceStatus,
} from './dto/purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async getPurchaseOrders(
    page: number = 1,
    limit: number = 10,
    status?: string,
    supplierId?: string,
  ): Promise<GetResponse<any[]>> {
    const formatedPage = Number(page);
    const formatedLimit = Number(limit);
    
    try {
      const where: {
        status?: PurchaseOrderStatus;
        supplierId?: string;
      } = {};
      
      if (status && status !== 'undefined') {
        where.status = status as PurchaseOrderStatus;
      }
      
      if (supplierId && supplierId !== 'undefined') {
        where.supplierId = supplierId;
      }

      const [purchaseOrders, total] = await this.prisma.$transaction([
        this.prisma.purchaseOrder.findMany({
          where,
          skip: (formatedPage - 1) * formatedLimit,
          take: formatedLimit,
          orderBy: { id: 'desc' },
          include: {
            supplier: {
              select: { id: true, name: true }
            },
            user: {
              select: { id: true, name: true }
            },
            items: {
              include: {
                product: {
                  select: { id: true, name: true, price: true }
                }
              }
            },
            receipts: {
              include: {
                items: {
                  include: {
                    product: {
                      select: { id: true, name: true }
                    }
                  }
                }
              }
            }
          }
        }),
        this.prisma.purchaseOrder.count({ where })
      ]);

      return {
        success: true,
        data: purchaseOrders,
        meta: {
          total,
          page: formatedPage,
          totalPages: Math.ceil(total / formatedLimit),
        },
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Error retrieving purchase orders');
      }
      throw new BadRequestException(e);
    }
  }

  async getPurchaseOrder(id: number): Promise<GetResponse<any>> {
    const parsedId = Number(id);
    
    try {
      const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
        where: { id: parsedId },
        include: {
          supplier: {
            select: { id: true, name: true }
          },
          user: {
            select: { id: true, name: true }
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true }
              }
            }
          },
          receipts: {
            include: {
              items: {
                include: {
                  product: {
                    select: { id: true, name: true }
                  }
                }
              },
              user: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase order not found');
      }

      return {
        success: true,
        data: purchaseOrder,
        meta: {
          total: 1,
          page: 1,
          totalPages: 1,
        },
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException(e);
    }
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto): Promise<ResponseDto<any>> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Calcular total de la orden
        const totalAmount = dto.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        
        // Generar número de orden
        const lastOrder = await tx.purchaseOrder.findFirst({
          orderBy: { id: 'desc' }
        });
        const orderNumber = `PO-${new Date().getFullYear()}-${String((lastOrder?.id || 0) + 1).padStart(3, '0')}`;

        // Crear orden de compra
        const purchaseOrder = await tx.purchaseOrder.create({
          data: {
            orderNumber,
            supplierId: dto.supplierId,
            status: PurchaseOrderStatus.PENDING,
            expectedDeliveryDate: new Date(dto.expectedDeliveryDate),
            totalAmount,
            notes: dto.notes,
            createdBy: dto.createdBy || 'system', // TODO: Get from auth context
          },
          include: {
            supplier: {
              select: { id: true, name: true }
            },
            user: {
              select: { id: true, name: true }
            }
          }
        });

        // Crear items de la orden
        const items = await Promise.all(
          dto.items.map(item =>
            tx.purchaseOrderItem.create({
              data: {
                purchaseOrderId: purchaseOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.quantity * item.unitPrice,
              },
              include: {
                product: {
                  select: { id: true, name: true, price: true }
                }
              }
            })
          )
        );

        return { ...purchaseOrder, items };
      });

      return {
        success: true,
        data: result,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new BadRequestException('Invalid supplier or product reference');
        }
      }
      throw new BadRequestException(e);
    }
  }

  async approvePurchaseOrder(id: number, dto: ApprovePurchaseOrderDto): Promise<ResponseDto<any>> {
    const parsedId = Number(id);
    
    try {
      const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
        where: { id: parsedId }
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase order not found');
      }

      if (purchaseOrder.status !== PurchaseOrderStatus.PENDING) {
        throw new BadRequestException('Purchase order can only be approved when pending');
      }

      const updatedOrder = await this.prisma.purchaseOrder.update({
        where: { id: parsedId },
        data: {
          status: PurchaseOrderStatus.APPROVED,
          approvedBy: dto.approvedBy,
          approvedAt: new Date(),
        },
        include: {
          supplier: {
            select: { id: true, name: true }
          },
          user: {
            select: { id: true, name: true }
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true }
              }
            }
          }
        }
      });

      return {
        success: true,
        data: updatedOrder,
      };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException(e);
    }
  }

  async cancelPurchaseOrder(id: number, dto: CancelPurchaseOrderDto): Promise<ResponseDto<any>> {
    const parsedId = Number(id);
    
    try {
      const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
        where: { id: parsedId }
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase order not found');
      }

      if (purchaseOrder.status === PurchaseOrderStatus.RECEIVED) {
        throw new BadRequestException('Cannot cancel a received purchase order');
      }

      const updatedOrder = await this.prisma.purchaseOrder.update({
        where: { id: parsedId },
        data: {
          status: PurchaseOrderStatus.CANCELLED,
          cancelledBy: dto.cancelledBy,
          cancelledAt: new Date(),
          cancellationReason: dto.reason,
        },
        include: {
          supplier: {
            select: { id: true, name: true }
          },
          user: {
            select: { id: true, name: true }
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true }
              }
            }
          }
        }
      });

      return {
        success: true,
        data: updatedOrder,
      };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException(e);
    }
  }

  async receivePurchase(id: number, dto: CreatePurchaseReceiptDto): Promise<ResponseDto<any>> {
    const parsedId = Number(id);
    
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Verificar que la orden existe y está aprobada
        const purchaseOrder = await tx.purchaseOrder.findUnique({
          where: { id: parsedId },
          include: { items: true }
        });

        if (!purchaseOrder) {
          throw new NotFoundException('Purchase order not found');
        }

        if (purchaseOrder.status !== PurchaseOrderStatus.APPROVED) {
          throw new BadRequestException('Purchase order must be approved before receiving');
        }

        // Generar número de recepción
        const lastReceipt = await tx.purchaseReceipt.findFirst({
          orderBy: { id: 'desc' }
        });
        const receiptNumber = `REC-${new Date().getFullYear()}-${String((lastReceipt?.id || 0) + 1).padStart(3, '0')}`;

        // Crear recepción
        const receipt = await tx.purchaseReceipt.create({
          data: {
            receiptNumber,
            purchaseOrderId: parsedId,
            invoiceNumber: dto.invoiceNumber,
            invoiceDate: new Date(dto.invoiceDate),
            invoiceAmount: dto.invoiceAmount,
            receivedBy: dto.receivedBy,
            notes: dto.notes,
            isPartial: dto.isPartial || false,
          }
        });

        // Crear items de recepción y actualizar inventario
        const receiptItems = [];
        const inventoryMovements = [];

        for (const item of dto.items) {
          // Crear item de recepción
          const receiptItem = await tx.purchaseReceiptItem.create({
            data: {
              purchaseReceiptId: receipt.id,
              productId: item.productId,
              quantityReceived: item.quantityReceived,
              unitPrice: item.unitPrice,
              subtotal: item.quantityReceived * item.unitPrice,
              notes: item.notes,
            },
            include: {
              product: {
                select: { id: true, name: true }
              }
            }
          });
          receiptItems.push(receiptItem);

          // Actualizar stock del producto
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantityReceived
              }
            }
          });

          // Crear movimiento de inventario
          const movement = await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              type: 'ENTRY',
              quantity: item.quantityReceived,
              reason: `Purchase receipt ${receiptNumber}`,
              reference: receiptNumber,
              userId: dto.receivedBy,
            }
          });
          inventoryMovements.push(movement);
        }

        // Actualizar estado de la orden si es recepción completa
        let orderStatus = PurchaseOrderStatus.APPROVED;
        if (!dto.isPartial) {
          orderStatus = PurchaseOrderStatus.RECEIVED;
          await tx.purchaseOrder.update({
            where: { id: parsedId },
            data: {
              status: orderStatus,
              actualDeliveryDate: new Date(),
            }
          });
        }

        return {
          receipt: {
            ...receipt,
            items: receiptItems
          },
          inventoryMovements,
          orderStatus
        };
      });

      return {
        success: true,
        data: result,
      };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException(e);
    }
  }

  async createInvoice(dto: CreateInvoiceDto): Promise<ResponseDto<any>> {
    try {
      const invoice = await this.prisma.invoice.create({
        data: {
          invoiceNumber: dto.invoiceNumber,
          supplierId: dto.supplierId,
          invoiceDate: new Date(dto.invoiceDate),
          dueDate: new Date(dto.dueDate),
          totalAmount: dto.totalAmount,
          paidAmount: 0,
          status: InvoiceStatus.PENDING,
          notes: dto.notes,
        },
        include: {
          supplier: {
            select: { id: true, name: true }
          }
        }
      });

      return {
        success: true,
        data: invoice,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Invoice number already exists');
        }
        if (e.code === 'P2003') {
          throw new BadRequestException('Invalid supplier reference');
        }
      }
      throw new BadRequestException(e);
    }
  }

  async payInvoice(id: number, dto: PayInvoiceDto): Promise<ResponseDto<any>> {
    const parsedId = Number(id);
    
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: parsedId }
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      const paymentAmount = dto.amount || invoice.totalAmount;
      const newPaidAmount = invoice.paidAmount + paymentAmount;
      
      let status = InvoiceStatus.PENDING;
      if (newPaidAmount >= invoice.totalAmount) {
        status = InvoiceStatus.PAID;
      } else if (newPaidAmount > 0) {
        status = InvoiceStatus.PARTIAL;
      }

      const updatedInvoice = await this.prisma.invoice.update({
        where: { id: parsedId },
        data: {
          paidAmount: newPaidAmount,
          status,
        },
        include: {
          supplier: {
            select: { id: true, name: true }
          }
        }
      });

      return {
        success: true,
        data: updatedInvoice,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException(e);
    }
  }
}
