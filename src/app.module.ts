import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './config/config';
import { buttonNevigation } from './config/tableButtonNevigation';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor';
import { MsgSenderModule } from './msg-sender/msg-sender.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CommonModule,
    AuthModule,
    MsgSenderModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, Config, buttonNevigation, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
  ],
})
export class AppModule { }

