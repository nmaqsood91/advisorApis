import { Request, Response, NextFunction } from "express";
import { AdvisorService } from "../services/advisor";
import type { AdvisorAttributes } from "../models/Advisor";
import { StatusCodes } from "http-status-codes";
import { logger, ApiError, AdvisorRegisterSchema } from "../util";

export const AdvisorController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = AdvisorRegisterSchema.safeParse(req.body);

      /**
       * throw error if the required fields are missing
       */
      if (!parseResult.success) {
        const validationError = new ApiError(
          StatusCodes.BAD_REQUEST,
          "Validation error"
        );

        // next function handles the global error handling, it is error middleware
        return next(validationError);
      }

      const payload = parseResult.data as AdvisorAttributes;

      logger.info("Calling Advisor Service to register advisor");

      const user = await AdvisorService.create(payload);

      logger.info("Advisor created successfully ");

      return res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      logger.error("Error during advisor registration:", error);
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Email or password is missing",
        });
      }

      const userToken = await AdvisorService.login(email, password);

      return res.status(StatusCodes.OK).json({
        token: userToken,
      });
    } catch (error) {
      logger.error("Error during advisor login:", error);
      next(error);
    }
  },
};
