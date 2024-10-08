import { Request } from 'express';
import { Code } from './code';

export type Register = {
  code: Code[];
  name: string;
  avatar: string;
};

export type Login = {
  name: string
  code: Code[];
};

export type Payload = {
  id: string;
};

export type RequestWithUser<T = any> = Request<{}, {}, T> & { user: Payload }