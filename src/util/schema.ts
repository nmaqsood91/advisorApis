import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required field" }),
  price: z.number({ required_error: "Product price is required field" }),
  description: z.string().optional(),
  id: z.number().optional(),
  advisorId: z.number().optional(),
});

const AdvisorRegisterSchema = z.object({
  name: z.string().min(1, { message: "Advisor name is required field" }),
  email: z.string().email({ message: "Email is required field" }),
  password: z.string().min(1, { message: "Password is required field" }),
});

const AdvisorLoginSchema = z.object({
  email: z.string().email({ message: "Email is required field" }),
  password: z.string().min(1, { message: "Password is required field" }),
});

export { ProductSchema, AdvisorRegisterSchema, AdvisorLoginSchema };
