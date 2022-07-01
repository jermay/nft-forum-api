import { Request } from 'express';
import { AuthToken } from './auth.token';

export interface ApiRequest extends Request {
  user: AuthToken;
}
