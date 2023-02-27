import { Response } from 'express';

declare module 'express' {
  interface Response {
    locals: {
      message: string;
    };
  }
}
