import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './ApiConfig.service';

@Module({
  imports: [ConfigModule],
  providers: [ApiConfigService],
  exports: [ConfigModule],
})
export class ApiConfigModule {}
