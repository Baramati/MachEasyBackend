import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { Config} from '../config/config';
@Module({
  controllers: [CommonController],
  providers: [CommonService,Config]
})
export class CommonModule {}
