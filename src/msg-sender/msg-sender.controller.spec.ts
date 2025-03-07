import { Test, TestingModule } from '@nestjs/testing';
import { MsgSenderController } from './msg-sender.controller';
import { MsgSenderService } from './msg-sender.service';

describe('MsgSenderController', () => {
  let controller: MsgSenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsgSenderController],
      providers: [MsgSenderService],
    }).compile();

    controller = module.get<MsgSenderController>(MsgSenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
