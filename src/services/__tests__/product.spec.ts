import { ProductService } from "../product";
import Product from "../../models/Product";
import { ApiError } from "../../util";

// Mock the Product model methods
jest.mock("../../models/Product", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
}));

describe("ProductService", () => {
  const advisorId = 1; // Common advisorId for tests
  const payload = {
    name: "Test Product",
    advisorId,
    price: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should create a product and return it", async () => {
      const mockProduct = { id: 1, ...payload };

      (Product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await ProductService.createProduct(payload);

      expect(result).toEqual(mockProduct);
      expect(Product.create).toHaveBeenCalledWith(payload);
    });

    it("should throw an ApiError if product creation fails", async () => {
      (Product.create as jest.Mock).mockRejectedValue(
        new Error("Creation failed")
      );

      await expect(ProductService.createProduct(payload)).rejects.toThrow(
        ApiError
      );
      await expect(ProductService.createProduct(payload)).rejects.toThrow(
        "Failed to create Product"
      );
    });
  });

  describe("getById", () => {
    it("should return a product by id", async () => {
      const id = 1;
      const mockProduct = { id, name: "Test Product", advisorId, price: 100 };

      (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const result = await ProductService.getById(id, advisorId);

      expect(result).toEqual(mockProduct);
      expect(Product.findOne).toHaveBeenCalledWith({
        where: { id, advisorId },
      });
    });

    it("should throw an ApiError if the product is not found", async () => {
      (Product.findOne as jest.Mock).mockResolvedValue(null);

      await expect(ProductService.getById(1, advisorId)).rejects.toThrow(
        ApiError
      );
      await expect(ProductService.getById(1, advisorId)).rejects.toThrow(
        "No products found"
      );
    });

    it("should throw an error if there is a database error", async () => {
      (Product.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(ProductService.getById(1, advisorId)).rejects.toThrow(Error);
    });
  });

  describe("getAll", () => {
    it("should return all products for an advisor", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", advisorId, price: 100 },
        { id: 2, name: "Product 2", advisorId, price: 200 },
      ];

      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      const result = await ProductService.getAll(advisorId);

      expect(result).toEqual(mockProducts);
      expect(Product.findAll).toHaveBeenCalledWith({ where: { advisorId } });
    });

    it("should throw an ApiError if no products are found", async () => {
      (Product.findAll as jest.Mock).mockResolvedValue([]);

      await expect(ProductService.getAll(advisorId)).rejects.toThrow(ApiError);
      await expect(ProductService.getAll(advisorId)).rejects.toThrow(
        "No products found"
      );
    });

    it("should throw an error if there is a database error", async () => {
      (Product.findAll as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(ProductService.getAll(advisorId)).rejects.toThrow(Error);
    });
  });
});
