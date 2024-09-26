import { AdvisorService } from "../advisor";
import Advisor from "../../models/Advisor";
import { verifyPassword } from "../../util/encrypt";
import { sign } from "../../util/jwt";
import { ApiError } from "../../util";
import { AdvisorAttributes } from "../../models/Advisor";

// Mock Advisor model methods
jest.mock("../../models/Advisor", () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
}));

// Mock utility functions
jest.mock("../../util/encrypt");
jest.mock("../../util/jwt");

describe("AdvisorService", () => {
  // Constants for testing
  const email = "test@example.com";
  const password = "password123";
  const hashedPassword = "hashedpassword";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create an advisor and return advisor data without password", async () => {
      const payload: Omit<AdvisorAttributes, "id"> = {
        email,
        password,
        name: "Advisor",
      };
      const mockAdvisor = {
        id: 1,
        ...payload,
        toJSON: jest.fn().mockReturnValue({ id: 1, email }),
      };

      (Advisor.create as jest.Mock).mockResolvedValue(mockAdvisor);

      const result = await AdvisorService.create(payload);

      expect(result).toEqual({ id: 1, email });
      expect(Advisor.create).toHaveBeenCalledWith(payload);
    });

    it("should throw an error if creation fails", async () => {
      const payload: Omit<AdvisorAttributes, "id"> = {
        email,
        password,
        name: "Advisor",
      };
      (Advisor.create as jest.Mock).mockRejectedValue(
        new Error("Creation failed")
      );

      await expect(AdvisorService.create(payload)).rejects.toThrow(
        "Creation failed"
      );
      expect(Advisor.create).toHaveBeenCalledWith(payload);
    });
  });

  describe("login", () => {
    it("should log in an advisor and return a JWT token", async () => {
      const mockAdvisor = { id: 1, email, password: hashedPassword };

      (Advisor.findByEmail as jest.Mock).mockResolvedValue(mockAdvisor);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      (sign as jest.Mock).mockReturnValue("mocked_token");

      const result = await AdvisorService.login(email, password);

      expect(result).toBe("mocked_token");
      expect(Advisor.findByEmail).toHaveBeenCalledWith(email);
      expect(verifyPassword).toHaveBeenCalledWith(password, hashedPassword);
    });

    it("should throw an error if the advisor is not found", async () => {
      (Advisor.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(AdvisorService.login(email, password)).rejects.toThrow(
        ApiError
      );
      await expect(AdvisorService.login(email, password)).rejects.toThrow(
        "Email or Password is incorrect"
      );
      expect(Advisor.findByEmail).toHaveBeenCalledWith(email);
    });

    it("should throw an error if the password is incorrect", async () => {
      const mockAdvisor = { id: 1, email, password: hashedPassword };

      (Advisor.findByEmail as jest.Mock).mockResolvedValue(mockAdvisor);
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(AdvisorService.login(email, password)).rejects.toThrow(
        ApiError
      );
      await expect(AdvisorService.login(email, password)).rejects.toThrow(
        "Email or Password is incorrect"
      );
    });
  });
});
