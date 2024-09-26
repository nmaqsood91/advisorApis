import { jwtConfig } from "./config";

import jwt from "jsonwebtoken";

type JWTPayload = {
  advisorId: number;
};
export const sign = (payload: JWTPayload, options = { expiresIn: "10m" }) => {
  return jwt.sign(payload, jwtConfig.secret, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtConfig.secret);
};
