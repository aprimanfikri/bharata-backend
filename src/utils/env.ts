const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

let PORT: number;
let NODE_ENV: string;
let JWT_SECRET: string;
let ADMIN_USERNAME: string;
let ADMIN_PASSWORD: string;

try {
  PORT = parseInt(getEnvVariable("PORT"), 10);
  NODE_ENV = getEnvVariable("NODE_ENV");
  JWT_SECRET = getEnvVariable("JWT_SECRET");
  ADMIN_USERNAME = getEnvVariable("ADMIN_USERNAME");
  ADMIN_PASSWORD = getEnvVariable("ADMIN_PASSWORD");
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("An unknown error occurred");
  }
  process.exit(1);
}

export { PORT, NODE_ENV, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD };
