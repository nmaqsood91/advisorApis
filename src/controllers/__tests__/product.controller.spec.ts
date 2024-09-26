import { ProductController } from "../product";
import { ProductService } from "../../services/product";
import { customRequest } from "customDefinition";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../util";

jest.mock("../../services/product", () => ({
  ProductService: {
    createProduct: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));

describe("ProductController", () => {
  let req: Partial<customRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      user: {
        advisorId: 1,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("create", () => {
    it("should return 201 and the created product on successful creation", async () => {
      req.body = {
        name: "Test Product",
        price: 100,
      };

      const mockProductResponse = {
        ...req.body,
        advisorId: req.user.advisorId,
      };
      (ProductService.createProduct as jest.Mock).mockResolvedValue(
        mockProductResponse
      );

      await ProductController.create(
        req as customRequest,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockProductResponse);
    });

    it("should return 400 and call next with a validation error if validation fails", async () => {
      req.body = {}; // Invalid body to trigger validation error

      await ProductController.create(
        req as customRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should call next with an error if product creation fails", async () => {
      req.body = {
        name: "Test Product",
        price: 100,
      };

      const errorMessage = "Error during product creation";
      (ProductService.createProduct as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await ProductController.create(
        req as customRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe(errorMessage); // More specific error check
    });
  });

  describe("getProducts", () => {
    it("should return 200 and the products list", async () => {
      const mockProducts = [
        { id: 1, name: "Test Product 1" },
        { id: 2, name: "Test Product 2" },
      ];
      (ProductService.getAll as jest.Mock).mockResolvedValue(mockProducts);

      await ProductController.getProducts(
        req as customRequest,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should call next with an error if getting products fails", async () => {
      const errorMessage = "Error getting products";
      (ProductService.getAll as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await ProductController.getProducts(
        req as customRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe(errorMessage); // More specific error check
    });
  });

  describe("getById", () => {
    it("should return 200 and the product on successful retrieval", async () => {
      req.params = { productId: "1" }; // Set product ID

      const mockProduct = { id: 1, name: "Test Product" };
      (ProductService.getById as jest.Mock).mockResolvedValue(mockProduct);

      await ProductController.getById(
        req as customRequest,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should call next with an error if product retrieval fails", async () => {
      req.params = { productId: "1" }; // Set product ID

      const errorMessage = "Error getting product";
      (ProductService.getById as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await ProductController.getById(
        req as customRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe(errorMessage); // More specific error check
    });
  });
});
