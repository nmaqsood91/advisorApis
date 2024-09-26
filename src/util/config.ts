import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const jwtConfig = {
  secret: process.env.SECRET,
  saltRound: 3,
};
