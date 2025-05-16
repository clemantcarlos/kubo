import { Test, TestingModule } from '@nestjs/testing';
import { ProductStorageUnitController } from './product-storage-unit.controller';
import { ProductStorageUnitService } from './product-storage-unit.service';

describe('ProductStorageUnitController', () => {
  let controller: ProductStorageUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductStorageUnitController],
      providers: [ProductStorageUnitService],
    }).compile();

    controller = module.get<ProductStorageUnitController>(ProductStorageUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
