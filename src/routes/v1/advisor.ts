import { Router } from "express";
import { AdvisorController } from "../../controllers/advisor";
const advisorRouter = Router();

advisorRouter.post("/register", AdvisorController.register);
advisorRouter.post("/login", AdvisorController.login);

export default advisorRouter;

/**
 * @swagger
 * tags:
 *   name: Advisor Registration
 */

/**
 * @swagger
 * /v1/advisor/register:
 *   post:
 *     summary: Register as user
 *     tags: [advisor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name:  name
 *               email: name@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *
 *
 *       "400":
 *         description:  Bad Request
 */

/**
 * @swagger
 * /v1/advisor/login:
 *   post:
 *     summary: Login
 *     tags: [advisor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: name@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *
 *       "401":
 *         description: Invalid email or password
 *
 */
