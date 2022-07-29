import * as Joi from 'joi';
import { Dialect } from 'sequelize/types';

export interface EnvironmentVars {
  DATABASE_DIALECT: Dialect;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  JWT_SECRET: string;
  MORALIS_APPID: string;
  MORALIS_MASTER_KEY: string;
  MORALIS_SECRET: string;
  MORALIS_URL: string;
  NODE_ENV: string;
}

export const ENV_VALIDATION = Joi.object({
  DATABASE_DIALECT: Joi.string().default('mysql'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().default('nft-forum'),
  JWT_SECRET: Joi.string().required(),
  MORALIS_APPID: Joi.string().required(),
  MORALIS_MASTER_KEY: Joi.string().required(),
  MORALIS_SECRET: Joi.string().required(),
  MORALIS_URL: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});
