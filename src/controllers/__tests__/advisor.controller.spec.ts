import { Request, Response } from "express";
import { AdvisorController } from "../advisor";
import { AdvisorService } from "../../services/advisor";
import { ApiError } from "../../util";
import { StatusCodes } from "http-status-codes";

// Mock services and utilities
jest.mock("../../services/advisor", () => ({
  AdvisorService: {
    create: jest.fn(),
    login: jest.fn(),
  },
}));

describe("AdvisorController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("register", () => {
    it("should return 201 and the advisor object on successful registration", async () => {
      const advisorData = {
        email: "test@example.com",
        password: "password123",
        name: "Advisor",
      };

      (AdvisorService.create as jest.Mock).mockResolvedValue(advisorData);
      req.body = advisorData;

      await AdvisorController.register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(advisorData);
    });

    it("should return 400 and call next with a validation error if validation fails", async () => {
      req.body = {}; // Empty body simulates validation failure

      await AdvisorController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should call next with ApiError if advisor registration fails", async () => {
      const errorMessage = "Error during advisor registration";
      (AdvisorService.create as jest.Mock).mockRejectedValue(
        new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage)
      );

      req.body = {
        email: "test@example.com",
        password: "password123",
        name: "Advisor",
      };

      await AdvisorController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(next.mock.calls[0][0].statusCode).toBe(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    });
  });

  describe("login", () => {
    it("should return 200 and the user token on successful login", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      const mockToken = "mocked_token";
      (AdvisorService.login as jest.Mock).mockResolvedValue(mockToken);

      await AdvisorController.login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 400 if email or password is missing", async () => {
      req.body = {
        email: "", // Missing email
        password: "password123",
      };

      await AdvisorController.login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email or password is missing",
      });
    });

    it("should call next with ApiError if advisor login fails", async () => {
      const errorMessage = "Login failed";
      (AdvisorService.login as jest.Mock).mockRejectedValue(
        new ApiError(StatusCodes.UNAUTHORIZED, errorMessage)
      );

      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      await AdvisorController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
