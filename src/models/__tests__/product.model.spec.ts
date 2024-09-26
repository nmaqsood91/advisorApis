import { sequelizeConnection } from "../../db/connection";
import Advisor from "../Advisor";
import Product from "../Product";

beforeAll(async () => {
  await sequelizeConnection.sync({ force: true });
});

afterAll(async () => {
  await sequelizeConnection.close();
});

describe("Product Model", () => {
  let advisorId: number;

  beforeAll(async () => {
    const advisorData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const advisor = await Advisor.create(advisorData);
    advisorId = advisor.id;
  });

  it("should create a product successfully", async () => {
    const productData = {
      advisorId,
      name: "Test Product",
      description: "This is a test product.",
      price: 19.99,
    };

    const product = await Product.create(productData);
    expect(product.id).toBeDefined();
    expect(product.name).toBe(productData.name);
    expect(product.price).toBe(productData.price);
    expect(product.advisorId).toBe(productData.advisorId);
  });

  it("should find a product by ID", async () => {
    const productData = {
      advisorId,
      name: "Another Product",
      description: "This is another test product.",
      price: 29.99,
    };

    const createdProduct = await Product.create(productData);
    const foundProduct = await Product.findByPk(createdProduct.id);

    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe(productData.name);
    expect(foundProduct?.price).toBe(productData.price);
  });

  it("should not create a product without a name", async () => {
    await expect(
      Product.create({
        advisorId,
        description: "Missing name product.",
        price: 15.0,
      })
    ).rejects.toThrow();
  });

  it("should not create a product without a price", async () => {
    await expect(
      Product.create({
        advisorId,
        name: "No Price Product",
        description: "This product has no price.",
      })
    ).rejects.toThrow();
  });
});
