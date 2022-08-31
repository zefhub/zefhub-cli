import fs from "fs";
import chalk from "chalk";

export type User = {
  zefId?: string;
  apiKey?: string;
};

// TODO: Handle windows path
export const checkAuth = async (): Promise<User | null | undefined> => {
  let authenticated = false;
  let user = null;
  console.log(chalk.green("Checking authentication..."));

  // Check env var
  if (process.env.ZEFHUB_AUTH_KEY) {
    user = {
      apiKey: process.env.ZEFHUB_AUTH_KEY,
    };
    authenticated = true;
  }

  // Check: ~/.zef/zefhub.key
  if (fs.existsSync("~/.zef/zefhub.key")) {
    // TODO: Check if key is valid
  }

  if (fs.existsSync("~/.zef/hub.zefhub.io/credentials")) {
    const credentials = await fs.readFileSync(
      "~/.zef/hub.zefhub.io/credentials"
    );
    if (credentials.toString() === "") {
      throw new Error("Credentials invalid: ~/.zef/hub.zefhub.io/credentials");
    }

    // TODO: Exchange for JWT token
  }

  if (!authenticated) {
    throw new Error(
      chalk.red("Not authenticated\nRun: 'zefhub login' to authenticate")
    );
  }

  console.log(chalk.green("Authenticated!"));
  return user;
};

export const login = async () => {};
