import request from "supertest";
import express from "express";
import productRouter from "../product";
import { StatusCodes } from "http-status-codes";
import deserializeUser from "../../../middleware/deserializeUser";
import Product from "../../../models/Product";

const app = express();
app.use(express.json());

// Mock the deserializeUser middleware
jest.mock("../../../middleware/deserializeUser", () => {
  return jest.fn((req, res, next) => {
    req.user = { advisorId: 1 }; // Mocked user
    next();
  });
});

app.use(deserializeUser);
app.use("/v1/products", productRouter);

describe("Product Routes", () => {
  const validProductData = {
    name: "ProductName",
    price: 10.2,
    description: "Product description",
  };

  const mockProductResponse = {
    id: 1,
    advisorId: 1,
    name: "Mock Product",
    price: 100,
    description: "This is a mock product.",
    createdAt: new Date(),
    updatedAt: new Date(),
    _attributes: {
      id: 1,
      advisorId: 1,
      name: "Mock Product",
      price: 100,
      description: "This is a mock product.",
    },
    dataValues: {
      id: 1,
      advisorId: 1,
      name: "Mock Product",
      price: 100,
      description: "This is a mock product.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isNewRecord: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /v1/products", () => {
    it("should create a product and return 201", async () => {
      // Spy on Product model's create method
      const productCreateSpy = jest
        .spyOn(Product, "create")
        .mockResolvedValue(mockProductResponse);

      const response = await request(app)
        .post("/v1/products")
        .send(validProductData)
        .set("Authorization", "Bearer mock_token");

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(productCreateSpy).toHaveBeenCalledTimes(1); // Ensure model method is called
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app)
        .post("/v1/products")
        .send({}) // Sending an empty body
        .set("Authorization", "Bearer mock_token");

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("GET /v1/products", () => {
    it("should return 404 if no products found", async () => {
      const productFindAllSpy = jest
        .spyOn(Product, "findAll")
        .mockResolvedValue([]);

      const response = await request(app)
        .get("/v1/products")
        .set("Authorization", "Bearer mock_token");

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(productFindAllSpy).toHaveBeenCalledTimes(1);
    });

    it("should return 200 if  products found", async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const productFindAllSpy = jest
        .spyOn(Product, "findAll")
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        .mockResolvedValue([mockProductResponse]);

      const response = await request(app)
        .get("/v1/products")
        .set("Authorization", "Bearer mock_token");

      expect(response.status).toBe(StatusCodes.OK);
      expect(productFindAllSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /v1/products/:productId", () => {
    it("should return a product by ID and return 200", async () => {
      const productFindOneSpy = jest
        .spyOn(Product, "findOne")
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        .mockResolvedValue(mockProductResponse); // this ts-ignore added just for typings missing from sequelize

      const response = await request(app)
        .get("/v1/products/1")
        .set("Authorization", "Bearer mock_token");

      expect(response.status).toBe(StatusCodes.OK);
      expect(productFindOneSpy).toHaveBeenCalledTimes(1);
    });

    it("should return 404 if product not found", async () => {
      const productFindOneSpy = jest
        .spyOn(Product, "findOne")
        .mockResolvedValue(null); // Return null when no product is found

      const response = await request(app)
        .get("/v1/products/999") // Non-existent product ID
        .set("Authorization", "Bearer mock_token");

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(productFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });
});
