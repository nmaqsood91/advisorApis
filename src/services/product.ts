import Product from "../models/Product";
import type { ProductAttributes } from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { ApiError, logger } from "../util";

export const ProductService = {
  createProduct: async (
    payload: Omit<ProductAttributes, "id">
  ): Promise<ProductAttributes> => {
    try {
      const product = await Product.create(payload);
      return product;
    } catch (error) {
      logger.error("Error occurred during product creation", error);

      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create Product"
      );
    }
  },

  getById: async (
    id: number,
    advisorId: number
  ): Promise<ProductAttributes> => {
    try {
      const product = await Product.findOne({
        where: {
          id,
          advisorId,
        },
      });

      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No products found");
      }

      return product;
    } catch (error) {
      logger.error("Error occurred during get product by id", error);
      throw error;
    }
  },
  getAll: async (advisorId: number): Promise<ProductAttributes[]> => {
    try {
      const products = await Product.findAll({
        where: {
          advisorId,
        },
      });

      if (products.length < 1) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No products found");
      }

      return products;
    } catch (error) {
      logger.error("Error occurred during get all products", error);

      throw error;
    }
  },
};
