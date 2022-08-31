/**
 * Copyright 2022 Synchronous Technologies Pte Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
