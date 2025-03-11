import { Module } from '@nestjs/common';
import { MsgSenderService } from './msg-sender.service';
import { MsgSenderController } from './msg-sender.controller';
import { HttpModule } from '@nestjs/axios';
import { SQL } from 'src/database/sql.sql';

@Module({
  imports: [HttpModule],  // Import HttpModule here
  controllers: [MsgSenderController],
  providers: [MsgSenderService, SQL]
})
export class MsgSenderModule { }
