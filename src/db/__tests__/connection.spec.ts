import { sequelizeConnection } from "../connection";

describe("Sequelize Connection", () => {
  beforeAll(async () => {
    // Sync the database before tests
    await sequelizeConnection.sync();
  });

  afterAll(async () => {
    // Close the connection after tests
    await sequelizeConnection.close();
  });

  it("should establish a connection to the SQLite database", async () => {
    try {
      await sequelizeConnection.authenticate();
      expect(true).toBe(true); // Connection is successful
    } catch (error) {
      throw new Error("Unable to connect to the database: " + error.message);
    }
  });

  it("should sync the database without errors", async () => {
    try {
      await sequelizeConnection.sync();
      expect(true).toBe(true); // Sync is successful
    } catch (error) {
      throw new Error("Database sync failed: " + error.message);
    }
  });
});
