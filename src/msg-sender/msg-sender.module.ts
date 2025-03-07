import { Module } from '@nestjs/common';
import { MsgSenderService } from './msg-sender.service';
import { MsgSenderController } from './msg-sender.controller';
import { Config } from 'src/config/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],  // Import HttpModule here
  controllers: [MsgSenderController],
  providers: [MsgSenderService,Config]
})
export class MsgSenderModule {}
