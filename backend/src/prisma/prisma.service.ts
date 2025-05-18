import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['warn', 'error'], // Configuración mínima de logs
      datasources: {
        db: {
          url: process.env.DATABASE_URL, // Asegúrate que esta variable esté definida
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
