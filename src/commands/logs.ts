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

const logs = async () => {
  const user = await checkAuth();

  const logsResponse = await axios.get(
    `${config.host}/v1/service/{service}/logs`,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer TODO`,
        "X-Api-Key": user?.apiKey || "",
      },
    }
  );
  if (logsResponse.status === 200) {
    if (config.mode === "development") {
      console.log("logsResponse.data", logsResponse.data);
    }
    if (logsResponse.data.logs) {
      console.log(chalk.green(`Logs:`));
      console.log(chalk.green("=============="));
      console.log(logsResponse.data.logs);
      console.log(chalk.green("=============="));
    }
  } else {
    throw new Error("List failed");
  }
};

export default logs;
