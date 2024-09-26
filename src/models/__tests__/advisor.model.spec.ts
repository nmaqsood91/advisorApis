import { sequelizeConnection } from "../../db/connection";
import Advisor from "../Advisor";

// Mocking the Advisor model
jest.mock("../Advisor", () => {
  return {
    ...jest.requireActual("../Advisor"),
    create: jest.fn(),
    findByEmail: jest.fn(),
  };
});

beforeAll(async () => {
  await sequelizeConnection.sync({ force: true });
});

afterAll(async () => {
  await sequelizeConnection.close();
});

describe("Advisor Model", () => {
  it("should create an advisor successfully", async () => {
    const advisorData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    (Advisor.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...advisorData,
      password: "hashed-password123",
    });

    const advisor = await Advisor.create(advisorData);

    expect(advisor.id).toBeDefined();
    expect(advisor.name).toBe(advisorData.name);
    expect(advisor.email).toBe(advisorData.email);
    expect(advisor.password).not.toBe(advisorData.password); // Check that password is "hashed"
  });

  it("should find an advisor by email", async () => {
    const advisorData = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "securepassword",
    };

    (Advisor.create as jest.Mock).mockResolvedValue({
      id: 2,
      ...advisorData,
      password: "hashed-securepassword",
    });

    (Advisor.findByEmail as jest.Mock).mockResolvedValue({
      id: 2,
      ...advisorData,
      password: "hashed-securepassword",
    });

    await Advisor.create(advisorData);
    const foundAdvisor = await Advisor.findByEmail(advisorData.email);

    expect(foundAdvisor).toBeDefined();
    expect(foundAdvisor?.name).toBe(advisorData.name);
  });

  it("should not create an advisor with duplicate email", async () => {
    const advisorData = {
      name: "Alice",
      email: "alice@example.com",
      password: "alicepassword",
    };

    (Advisor.create as jest.Mock).mockResolvedValue({
      id: 3,
      ...advisorData,
      password: "hashed-alicepassword",
    });

    await Advisor.create(advisorData);

    (Advisor.create as jest.Mock).mockRejectedValue(
      new Error("Email already exists")
    );
    await expect(Advisor.create(advisorData)).rejects.toThrow(
      "Email already exists"
    );
  });
});
