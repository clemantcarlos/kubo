import { Test, TestingModule } from '@nestjs/testing';
import { ProductStorageUnitService } from './product-storage-unit.service';

describe('ProductStorageUnitService', () => {
  let service: ProductStorageUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductStorageUnitService],
    }).compile();

    service = module.get<ProductStorageUnitService>(ProductStorageUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
