import request from "supertest";
import express from "express";
import advisorRouter from "../advisor";
import { StatusCodes } from "http-status-codes";
import Advisor from "../../../models/Advisor";
import { verifyPassword } from "../../../util/encrypt";
jest.mock("../../../util/encrypt");

const mockCreateAdvisorResponse = {
  id: 1,
  name: "Test Advisor",
  email: "test@example.com",
  password: "hashedpassword",
  createdAt: "2024-09-25T20:56:15.204Z",
  updatedAt: "2024-09-25T20:56:15.204Z",
  toJSON: function () {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
  _attributes: {
    id: 1,
    name: "Test Advisor",
    email: "test@example.com",
    password: "hashedpassword",
    createdAt: "2024-09-25T20:56:15.204Z",
    updatedAt: "2024-09-25T20:56:15.204Z",
  },
  dataValues: {
    id: 1,
    name: "Test Advisor",
    email: "test@example.com",
    password: "hashedpassword",
    createdAt: "2024-09-25T20:56:15.204Z",
    updatedAt: "2024-09-25T20:56:15.204Z",
  },
  isNewRecord: false,
};
const app = express();
app.use(express.json());
app.use("/v1/advisor", advisorRouter);

describe("Advisor Routes", () => {
  describe("POST /v1/advisor/register", () => {
    it("should register a new advisor and return 201", async () => {
      const mockRequestBody = {
        name: "Test Advisor",
        email: "test@example.com",
        password: "password1",
      };

      const advisorCreateSpy = jest
        .spyOn(Advisor, "create")
        .mockResolvedValue(mockCreateAdvisorResponse);

      const response = await request(app)
        .post("/v1/advisor/register")
        .send(mockRequestBody);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(advisorCreateSpy).toHaveBeenCalledTimes(1);
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app).post("/v1/advisor/register").send({}); // Send an empty body

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("POST /v1/advisor/login", () => {
    it("should log in an advisor and return 200 with a token", async () => {
      const mockRequestBody = {
        email: "test@example.com",
        password: "password1",
      };

      (verifyPassword as jest.Mock).mockResolvedValue(true);

      const advisorCreateSpy = jest
        .spyOn(Advisor, "findByEmail")
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .mockResolvedValue({
          email: "test@example.com",
          password: "password1",
          id: 1,
        }); // ts-ignore intentionally added

      const response = await request(app)
        .post("/v1/advisor/login")
        .send(mockRequestBody);

      expect(advisorCreateSpy).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(StatusCodes.OK);
    });

    it("should return 400 if email or password is missing", async () => {
      const response = await request(app)
        .post("/v1/advisor/login")
        .send({ email: "" }); // Missing password

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Email or password is missing",
      });
    });

    it("should return 401 if login fails due to invalid credentials", async () => {
      const mockRequestBody = {
        email: "test@example.com",
        password: "wrong_password",
      };
      (verifyPassword as jest.Mock).mockResolvedValue(false);
      jest
        .spyOn(Advisor, "findByEmail")
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .mockResolvedValue({
          email: "test@example.com",
          password: "password1",
          id: 1,
        });

      const response = await request(app)
        .post("/v1/advisor/login")
        .send(mockRequestBody);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
