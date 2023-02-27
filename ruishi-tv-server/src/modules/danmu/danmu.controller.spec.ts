import { Test, TestingModule } from '@nestjs/testing';
import { DanmuController } from './danmu.controller';
import { DanmuService } from './danmu.service';

describe('DanmuController', () => {
  let controller: DanmuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DanmuController],
      providers: [DanmuService],
    }).compile();

    controller = module.get<DanmuController>(DanmuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
