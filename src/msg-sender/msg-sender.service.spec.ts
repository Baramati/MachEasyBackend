import { Test, TestingModule } from '@nestjs/testing';
import { MsgSenderService } from './msg-sender.service';

describe('MsgSenderService', () => {
  let service: MsgSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsgSenderService],
    }).compile();

    service = module.get<MsgSenderService>(MsgSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
