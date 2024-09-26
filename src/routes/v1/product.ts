import { Router } from "express";
import { ProductController } from "../../controllers/product";
const productRouter = Router();

productRouter.post("/", ProductController.create);
productRouter.get("/", ProductController.getProducts);
productRouter.get("/:productId", ProductController.getById);

export default productRouter;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Product
 */

/**
 * @swagger
 * /v1/product:
 *   post:
 *     summary: Register Product
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []  # Require Bearer token for this endpoint
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: double
 *               description:
 *                 type: string
 *             example:
 *               name: ProductName
 *               price: 10.2
 *               description: Product description
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         description: Bad Request
 *       "500":
 *         description: Failed to create Product
 */

/**
 * @swagger
 * /v1/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []  # Require Bearer token for this endpoint
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   advisorId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: double
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Product not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /v1/product/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []  # Require Bearer token for this endpoint
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 advisorId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: double
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Product not found
 *       "500":
 *         description: Internal Server Error
 */
