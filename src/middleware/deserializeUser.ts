import { get } from "lodash";
import { verifyToken } from "../util/jwt";
import { Response, NextFunction } from "express";
import type { customRequest } from "../types/customDefinition";

const deserializeUser = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = get(req, "headers.authorization");

  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res.status(403).json({
      error: true,
      errorMsg: "Authorization token is missing or invalid",
    });
  }

  const token = bearerToken.substring(7); // Extract the token

  try {
    const decoded = await verifyToken(token);

    req.user = decoded as { advisorId: number; iat: number; exp: number };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Return error if the token is invalid or expired
    return res.status(403).json({
      error: true,
      errorMsg: error.message || "Token is invalid or has expired",
    });
  }
};

export default deserializeUser;
