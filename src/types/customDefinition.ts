import { NextFunction, Request, Response } from "express";

export interface customRequest extends Request {
  user: { advisorId: number };
}

export type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
