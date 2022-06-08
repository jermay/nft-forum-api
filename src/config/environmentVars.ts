import * as Joi from 'joi';
import { Dialect } from 'sequelize/types';

export interface EnvironmentVars {
  NODE_ENV: string;
  DATABASE_DIALECT: Dialect;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
}

export const ENV_VALIDATION = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DATABASE_DIALECT: Joi.string().default('mysql'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().default('nft-forum'),
});
