import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSaleDto, GetSalesQueryDto } from './dto/sale.dto';
import { GetResponse, ResponseDto } from '@/interfaces/getResponse';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async getSales(query: GetSalesQueryDto): Promise<GetResponse<any[]>> {
    const { page = 1, limit = 10, customerId, dateFrom, dateTo, userId, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    try {
      const [sales, total] = await this.prisma.$transaction([
        this.prisma.sale.findMany({
          where,
          skip,
          take,
          orderBy: { id: 'desc' },
          include: {
            customer: { select: { id: true, name: true } },
            user: { select: { id: true, name: true } },
            items: {
              include: {
                product: { select: { id: true, name: true, price: true } }
              }
            }
          }
        }),
        this.prisma.sale.count({ where })
      ]);
      return {
        success: true,
        data: sales,
        meta: {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / take),
        },
      };
    } catch (e) {
      throw new BadRequestException('Error al obtener ventas');
    }
  }

  async getSale(id: number): Promise<GetResponse<any>> {
    try {
      const sale = await this.prisma.sale.findUnique({
        where: { id: Number(id) },
        include: {
          customer: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, price: true } }
            }
          }
        }
      });
      if (!sale) throw new NotFoundException('Venta no encontrada');
      return {
        success: true,
        data: sale,
        meta: { total: 1, page: 1, totalPages: 1 },
      };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadRequestException('Error al obtener la venta');
    }
  }

  async createSale(dto: CreateSaleDto): Promise<ResponseDto<any>> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Calcular total de la venta
        const totalAmount = dto.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        // Generar número de venta
        const lastSale = await tx.sale.findFirst({ orderBy: { id: 'desc' } });
        const saleNumber = `SA-${new Date().getFullYear()}-${String((lastSale?.id || 0) + 1).padStart(3, '0')}`;
        // Crear venta
        const sale = await tx.sale.create({
          data: {
            saleNumber,
            customerId: dto.customerId,
            status: 'COMPLETED',
            totalAmount,
            notes: dto.notes,
            userId: dto.userId,
          },
          include: {
            customer: { select: { id: true, name: true } },
            user: { select: { id: true, name: true } }
          }
        });
        // Crear items de la venta y actualizar inventario
        const items = await Promise.all(
          dto.items.map(item =>
            tx.saleItem.create({
              data: {
                saleId: sale.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.quantity * item.unitPrice,
              },
              include: {
                product: { select: { id: true, name: true, price: true } }
              }
            })
          )
        );
        // Actualizar stock y registrar movimiento de inventario
        for (const item of dto.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              type: 'EXIT',
              quantity: item.quantity,
              reason: `Venta ${saleNumber}`,
              reference: saleNumber,
              userId: dto.userId,
            }
          });
        }
        return { ...sale, items };
      });
      return { success: true, data: result };
    } catch (e) {
      throw new BadRequestException('Error al crear la venta');
    }
  }
}
