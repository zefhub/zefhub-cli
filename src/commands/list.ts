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

import chalk from "chalk";
import axios from "axios";
import config from "../config";
import { checkAuth } from "../utils/auth";

const list = async () => {
  const user = await checkAuth();

  const listResponse = await axios.get(`${config.host}/v1/services`, {
    headers: {
      "Content-Type": "multipart/form-data",
      // Authorization: `Bearer TODO`,
      "X-Api-Key": user?.apiKey || "",
    },
  });
  if (listResponse.status === 200) {
    if (config.mode === "development") {
      console.log("listResponse.data", listResponse.data);
    }
    if (listResponse.data.length !== 0) {
      console.log(chalk.green(`Your services:`));
      console.log(chalk.green("=============="));
      listResponse.data.forEach((service: any, index: number) => {
        console.log(chalk.green(`Name: ${service.name}`));
        console.log(
          chalk.green(`Status: `) +
            `${
              service.status.availableReplicas === 1
                ? chalk.green("ready")
                : chalk.red("not ready")
            }`
        );
        console.log(chalk.green(`Generation: ${service.generation}`));
        console.log(chalk.green(`Created at: ${service.createdAt}`));
        console.log(chalk.green(`URL: ${service.url}`));
        console.log(chalk.green("=============="));
      });
    } else {
      console.log(chalk.blue("No services found"));
    }
  } else {
    throw new Error("List failed");
  }
};

export default list;
