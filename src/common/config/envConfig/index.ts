import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: number;
}

const getEnv = (name: string) => {
  const val: string | undefined = process.env[name];
  if (val === undefined || val === null) {
    throw "Missing env variable for " + name;
  }
  return val;
};

export const envConfig: EnvConfig = {
  PORT: +getEnv("PORT"),
};
