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
import { getYesNo } from "cli-interact";
import { checkAuth } from "../utils/auth";
import sampleGraphql from "../templates/sample-graphql";
import sampleHooks from "../templates/sample-hooks";

const init = async () => {
  try {
    console.log(chalk.green("Initialize project..."));

    // Check auth
    await checkAuth();

    // Check if files already exist.
    if (fs.existsSync("schema.graphql")) {
      console.log(chalk.red("schema.graphql file already exists."));
      const shouldOverwrite = await getYesNo("Do you want to overwrite it?");
      if (!shouldOverwrite) {
        console.log(chalk.red("Aborting."));
        return;
      }
    }

    if (fs.existsSync("hooks.py")) {
      console.log(chalk.red("hooks.py file already exists."));
      const shouldOverwrite = await getYesNo("Do you want to overwrite it?");
      if (!shouldOverwrite) {
        console.log(chalk.red("Aborting."));
        return;
      }
    }

    // Create files.
    await fs.writeFileSync("schema.graphql", sampleGraphql);
    await fs.writeFileSync("hooks.py", sampleHooks);

    console.log(chalk.green("Project initialized!"));
  } catch (error) {
    console.error(error);
  }
};

export default init;
