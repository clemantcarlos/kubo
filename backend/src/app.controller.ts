import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Public } from './modules/auth/common/decorators/public.decorator';
import * as bcrypt from 'bcrypt';

@Controller('start')
export class AppController {
  constructor(private readonly prisma: PrismaService) {} 
  @Get()
  @Public()
  async getStart() {

    const saltOrRounds = 10;
    const hash = await bcrypt.hash('Clemant.1113', saltOrRounds)

    // CREATE PRODUCT, CATEGORY, STORAGE UNIT, SUPPLIER
    const newProduct = await this.prisma.product.create({
      data: {
        name: 'Prueba',
        description: 'New Product Description',
        price: 110,
        stock: 10,
        cost: 100,
        category: {
          create: {
            name: 'General',
            description: 'New Category Description',
          } 
        },
        storageUnit: {
          create: {
            name: 'Unidad',
            description: 'New Storage Unit Description',
            unit: 1,
          }
        },
        supplier: {
          create: {
            name: 'Proveedor prueba',
            email: 'proveedor@mail.com',
            phone: '+56 987654321',
            address: 'Av. de la República, 123',
          }
        }
      }
    })
    const newUser = await this.prisma.user.create({
      data: {
        name:"Carlos clemant",
        email: "clemant11@gmail.com",
        phoneNumber: "4125507614",
        identityDocument: "V27944093",
        address: "Urb el Pilar",
        password: hash,
        identityDocumentType: {
          create: {
            name: "C",
            description: "Documento de identidad"
          }
        },
        role: {
          create: {
            name: "Administrador",
            description: "Administrador del sistema"
          }
        },
      }
    });
    const newPurchaseOrder = await this.prisma.purchaseOrder.create({
      data: {
        supplier: {
          connect: { id: newProduct.supplierId }
        },
        expectedDeliveryDate: new Date(),
        notes: "Prueba",
        orderNumber: "PO-2024-001",
        totalAmount: 110,
        items: {
          create: [
            {
              product: {
                connect: {
                  id: newProduct.id,
                }
              },
              quantity: 1,
              unitPrice: 110,
              subtotal: 110,
            }
          ]
        },
        history: {
          create: [
            {
              notes: "Prueba",
              status: 'PENDING',
              statusAt: new Date(),
              user: {
                connect: { 
                  id: newUser.id,
                }
              }
            }, 
          ]
        }
      }
    });

    return {
      newProduct,
      newUser,
      newPurchaseOrder
    }
  }
}
