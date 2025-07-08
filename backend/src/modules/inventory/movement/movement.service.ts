import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMovementDto, GetMovementsQueryDto } from './dto/movement.dto';
import { GetResponse, ResponseDto } from '@/interfaces/getResponse';

@Injectable()
export class MovementService {
  constructor(private readonly prisma: PrismaService) {}

  async getMovements(query: GetMovementsQueryDto): Promise<GetResponse<any[]>> {
    const { 
      page = 1, 
      limit = 10, 
      productId, 
      type, 
      dateFrom, 
      dateTo, 
      userId, 
      reason, 
      reference 
    } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const where: any = {};
    if (productId) where.productId = Number(productId);
    if (type) where.type = type;
    if (userId) where.userId = userId;
    if (reason) where.reason = { contains: reason, mode: 'insensitive' };
    if (reference) where.reference = { contains: reference, mode: 'insensitive' };
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    try {
      const [movements, total] = await this.prisma.$transaction([
        this.prisma.inventoryMovement.findMany({
          where,
          skip,
          take,
          orderBy: { id: 'desc' },
          include: {
            product: { select: { id: true, name: true } }
          }
        }),
        this.prisma.inventoryMovement.count({ where })
      ]);
      return {
        success: true,
        data: movements,
        meta: {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / take),
        },
      };
    } catch (e) {
      throw new BadRequestException('Error al obtener movimientos de inventario');
    }
  }

  async getMovement(id: number): Promise<GetResponse<any>> {
    try {
      const movement = await this.prisma.inventoryMovement.findUnique({
        where: { id: Number(id) },
        include: { product: { select: { id: true, name: true } } }
      });
      if (!movement) throw new NotFoundException('Movimiento no encontrado');
      return {
        success: true,
        data: movement,
        meta: { total: 1, page: 1, totalPages: 1 },
      };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadRequestException('Error al obtener el movimiento');
    }
  }

  async createManualMovement(dto: CreateMovementDto): Promise<ResponseDto<any>> {
    try {
      const movement = await this.prisma.inventoryMovement.create({
        data: {
          productId: dto.productId,
          type: dto.type,
          quantity: dto.quantity,
          reason: dto.reason,
          reference: dto.reference,
          userId: dto.userId,
        },
        include: { product: { select: { id: true, name: true } } }
      });
      // Actualizar stock del producto
      await this.prisma.product.update({
        where: { id: dto.productId },
        data: {
          stock: dto.type === 'ENTRY'
            ? { increment: dto.quantity }
            : { decrement: dto.quantity }
        }
      });
      return { success: true, data: movement };
    } catch (e) {
      throw new BadRequestException('Error al crear el movimiento');
    }
  }
}
