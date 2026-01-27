export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres@localhost/choirwizard";
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://postgres@localhost/choirwizard-test";
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";
