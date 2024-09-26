import { Response, NextFunction } from "express";
import deserializeUser from "../../middleware/deserializeUser";
import { customRequest } from "../../types/customDefinition";

const mockVerifyToken = async (token: string) => {
  if (token === "valid_token") {
    return { advisorId: 1, iat: 1234567890, exp: 1234567890 };
  } else if (token === "invalid_token") {
    throw new Error("Invalid token");
  } else {
    throw new Error("Authorization token is missing or invalid");
  }
};

jest.mock("../../util/jwt", () => {
  return {
    verifyToken: (token: string) => mockVerifyToken(token),
  };
});

describe("deserializeUser middleware", () => {
  let req: customRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} } as customRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should call next if token is valid", async () => {
    req.headers.authorization = "Bearer valid_token"; // Set valid token

    await deserializeUser(req, res, next);

    expect(req.user).toEqual({
      advisorId: 1,
      iat: 1234567890,
      exp: 1234567890,
    }); // Check if req.user was set correctly
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if token is missing", async () => {
    await deserializeUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      errorMsg: "Authorization token is missing or invalid",
    });
    expect(next).not.toHaveBeenCalled(); // Ensure next was not called
  });

  it("should return 403 if token is invalid", async () => {
    req.headers.authorization = "Bearer invalid_token"; // Set invalid token

    await deserializeUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      errorMsg: "Invalid token",
    });
    expect(next).not.toHaveBeenCalled(); // Ensure next was not called
  });
});
