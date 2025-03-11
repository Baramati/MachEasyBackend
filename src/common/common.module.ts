import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { SQL } from 'src/database/sql.sql';
@Module({
  controllers: [CommonController],
  providers: [CommonService, SQL]
})
export class CommonModule { }
