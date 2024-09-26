import { NextFunction, Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import { ApiError } from "../util/apiError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../util";

const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  VALIDATION_ERROR: "Validation error",
};

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error occurred:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Handle Sequelize unique constraint errors
  if (err instanceof UniqueConstraintError) {
    return res.status(StatusCodes.CONFLICT).json({
      status: "error",
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors: err.errors.map(error => ({
        message: error.message,
        value: error.value,
      })),
    });
  }

  // Handle any other errors
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
}
