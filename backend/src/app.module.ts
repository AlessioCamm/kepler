import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AskModule } from './ask/ask.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AskModule,
  ],
})
export class AppModule {}
