import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
