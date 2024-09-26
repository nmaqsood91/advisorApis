import Advisor from "../models/Advisor";
import type { AdvisorAttributes } from "../models/Advisor";
import { sign } from "../util/jwt";
import { ApiError, logger, verifyPassword } from "../util";
import { StatusCodes } from "http-status-codes";

export const AdvisorService = {
  create: async (
    payload: Omit<AdvisorAttributes, "id">
  ): Promise<Omit<AdvisorAttributes, "password">> => {
    try {
      const advisor = await Advisor.create(payload);
      const { password, ...advisorData } = advisor.toJSON();

      logger.info(`Advisor ${advisor.id} created successfully`);

      return advisorData;
    } catch (error) {
      console.log("error is here", error);
      logger.error("Error occurred during advisor creation", error);
      throw error;
    }
  },
  login: async (email: string, password: string): Promise<string> => {
    try {
      logger.info("Attempting to log in advisor with email", { email });

      const advisor = await Advisor.findByEmail(email);

      if (!advisor) {
        logger.warn("Login attempt with invalid email", { email });
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Email or Password is incorrect"
        );
      }

      /**
       * encrypt the string and match with the saved encrypted string in database
       * to check if the password match with what is stored against the email
       */

      const isPasswordValid = await verifyPassword(password, advisor.password);

      if (!isPasswordValid) {
        logger.warn("Login attempt with invalid password", { email });
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Email or Password is incorrect"
        );
      }

      logger.info("Advisor successfully authenticated", {
        advisorId: advisor.id,
      });

      // Issue JWT token
      const token = sign({ advisorId: advisor.id });

      return token;
    } catch (error) {
      logger.error("Error occurred during advisor login", { error, email });
      throw error;
    }
  },
};
