import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Public } from './modules/auth/common/decorators/public.decorator';
import * as bcrypt from 'bcrypt';

const products = [
  {
    name: 'Prueba',
    description: 'New Product Description',
    price: 110,
    stock: 10,
    cost: 100,
  },
  {
    name: 'Prueba 2',
    description: 'New Product Description',
    price: 50,
    stock: 10,
    cost: 20,
  }
]
const categories = [
  {
    name: 'General',
    description: 'New Category Description',
  },
  {
    name: 'Bebidas',
    description: 'New Category Description',
  }
]
const units = [
  {
    name: 'Unidad',
    description: 'New Storage Unit Description',
    unit: 1,
  },
  {
    name: 'Bulto',
    description: 'New Storage Unit Description',
    unit: 6,
  }
]
const suppliers = [
  {
    name: 'Proveedor prueba',
    email: 'proveedor@mail.com',
    phone: '04125507614',
    address: 'Av. de la República, 123',
  },
  {
    name: 'Proveedor prueba 2',
    email: 'proveedor@mail.com',
    phone: '04125507613',
    address: 'Av. de la República, 123',
  }
]
const identityDocumentTypes = [
  {
    name: 'V',
    description: 'Documento de identidad personal'
  },
  {
    name: 'J',
    description: 'Documento de identidad juridico'
  },
  {
    name: 'E',
    description: 'Documento de identidad extranjero'
  },
]
const roles = [
  {
    name: 'Administrador',
    description: 'Administrador del sistema'
  },
  {
    name: 'Usuario',
    description: 'Usuario del sistema'
  },
]

@Controller('start')
export class AppController {
  constructor(private readonly prisma: PrismaService) {} 
  @Public()
  @Get()
  async getStarted() {

    const saltOrRounds = 10;
    const hash = await bcrypt.hash('Clemant.1113', saltOrRounds)

    const newUnits = await this.prisma.unit.createMany({
      data: units.map(unit => ({
        name: unit.name,
        description: unit.description,
        unit: unit.unit,
      }))
    })

    const newCategories = await this.prisma.productCategory.createMany({
      data: categories.map(category => ({
        name: category.name,
        description: category.description,
      }))
    })

    const newSuppliers = await this.prisma.supplier.createMany({
      data: suppliers.map(supplier => ({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      }))
    })

    const newProducts = await this.prisma.product.createMany({
      data: products.map(product => ({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        cost: product.cost,
        unitId: newUnits[0].id,
        categoryId: newCategories[0].id,
        supplierId: newSuppliers[0].id,
      }))
    })

    const newIdentityDocumentTypes = await this.prisma.identityDocumentType.createMany({
      data: identityDocumentTypes.map(identityDocumentType => ({
        name: identityDocumentType.name,
        description: identityDocumentType.description,
      }))
    })
    
    const newRoles = await this.prisma.userRole.createMany({
      data: roles.map(role => ({
        name: role.name,
        description: role.description,
      }))
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

    // const newPurchaseOrder = await this.prisma.purchaseOrder.create({
    //   data: {
    //     supplier: {
    //       connect: { id: newProduct.supplierId }
    //     },
    //     expectedDeliveryDate: new Date(),
    //     notes: "Prueba",
    //     orderNumber: "PO-2024-001",
    //     totalAmount: 110,
    //     items: {
    //       create: [
    //         {
    //           product: {
    //             connect: {
    //               id: newProduct.id,
    //             }
    //           },
    //           quantity: 1,
    //           unitPrice: 110,
    //           subtotal: 110,
    //         }
    //       ]
    //     },
    //     history: {
    //       create: [
    //         {
    //           notes: "Prueba",
    //           status: 'PENDING',
    //           statusAt: new Date(),
    //           user: {
    //             connect: { 
    //               id: newUser.id,
    //             }
    //           }
    //         }, 
    //       ]
    //     }
    //   }
    // });


    return {
      // newProduct,
      // newUser,
      // newPurchaseOrder
    }
  }

  @Public()
  @Get('test')
  async test() {
    // const join = await this.prisma.product.findMany({
    //   select: {
    //     recipeOutputs: true
    //   }
    // })
    
    // return join
  }
}
