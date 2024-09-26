import { NextFunction, Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import { ApiError } from "../util/apiError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../util";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error occurred:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  if (err instanceof UniqueConstraintError) {
    // Handling Sequelize unique constraint error
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: err?.errors?.map(err => ({
        message: err.message,
        value: err.value,
      })),
    });
  }
  // for all the general errors
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
  });
}
