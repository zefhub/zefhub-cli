import fs from "fs";
import axios from "axios";
import chalk from "chalk";

const verifyAPIKey = async (apiKey?: string): Promise<{ id: string }> => {
  try {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    const authResponse = await axios.get(
      `https://firestore.googleapis.com/v1/projects/zefhub-io/databases/(default)/documents/api-keys/${apiKey}`
    );
    if (authResponse.data && authResponse.status === 200) {
      // TODO: Get user data from id
      return {
        id: authResponse.data.fields.userId.stringValue,
      };
    } else {
      throw new Error("Invalid API key");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// TODO: Handle windows path
export const checkAuth = async () => {
  try {
    let authenticated = false;
    let user = {};
    console.log(chalk.green("Checking authentication..."));

    // Check env var
    if (process.env.ZEFHUB_AUTH_KEY !== "") {
      user = await verifyAPIKey(process.env.ZEFHUB_AUTH_KEY);
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
        throw new Error(
          "Credentials invalid: ~/.zef/hub.zefhub.io/credentials"
        );
      }

      // TODO: Exchange for JWT token
    }

    if (!authenticated) {
      throw new Error("Not authenticated");
    }

    console.log(chalk.green("Authenticated!"));
    return true;
  } catch (err) {
    console.error(err);
  }
};

export const login = async () => {};
