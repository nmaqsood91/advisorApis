import { customRequest } from "customDefinition";
import { ProductService } from "../services/product";
import { NextFunction, Response } from "express";
import type { ProductAttributes } from "../models/Product";

import { StatusCodes } from "http-status-codes";
import { ApiError, ProductSchema, logger } from "../util";

export const ProductController = {
  create: async (
    request: customRequest,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const parseResult = ProductSchema.safeParse(request.body);

      // validating request
      if (!parseResult.success) {
        const validationError = new ApiError(
          StatusCodes.BAD_REQUEST,
          "Validation error"
        );
        return next(validationError);
      }

      const product: ProductAttributes = { ...request.body };
      product.advisorId = request.user.advisorId;

      logger.info("Calling product service to create product");

      const productResponse = await ProductService.createProduct(product);

      logger.info("Product created successfully");

      return response.status(StatusCodes.CREATED).json(productResponse);
    } catch (error) {
      logger.error("Error creating product error :", error);
      next(error);
    }
  },

  getProducts: async (
    request: customRequest,
    response: Response,
    next: NextFunction
  ) => {
    try {
      logger.info("Calling product service to get all products ");

      const products: ProductAttributes[] = await ProductService.getAll(
        request.user.advisorId
      );
      return response.status(StatusCodes.OK).json(products);
    } catch (error) {
      logger.error("Error getting products :", error);
      next(error);
    }
  },

  getById: async (
    request: customRequest,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const productId = parseInt(request.params.productId);
      logger.info("Calling product service to get product by Id ");

      const product: ProductAttributes = await ProductService.getById(
        productId,
        request.user.advisorId
      );

      return response.status(StatusCodes.OK).json(product);
    } catch (error) {
      logger.error("Error getting products :", error);
      next(error);
    }
  },
};
