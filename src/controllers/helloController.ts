import { Request, Response } from 'express';

export const helloController = (_req: Request, res: Response) => {
  res.send('Hello World!');
};
