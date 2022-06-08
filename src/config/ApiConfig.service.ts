import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize/types';
import { EnvironmentVars } from './environmentVars';

@Injectable()
export class ApiConfigService implements EnvironmentVars {
  constructor(private configService: ConfigService<EnvironmentVars>) {}

  get NODE_ENV(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get DATABASE_DIALECT(): Dialect {
    return this.configService.get<Dialect>('DATABASE_DIALECT');
  }

  get DATABASE_HOST(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  get DATABASE_PORT(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  get DATABASE_USERNAME(): string {
    return this.configService.get<string>('DATABASE_USERNAME');
  }

  get DATABASE_PASSWORD(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  get DATABASE_NAME(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }
}
