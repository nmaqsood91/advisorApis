// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"], // Ignore compiled files
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
