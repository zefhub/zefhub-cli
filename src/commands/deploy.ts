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

import { createReadStream, existsSync, readFileSync } from "fs";
import chalk from "chalk";
import axios from "axios";
import FormData from "form-data";
import config from "../config";
import { zipFiles, FileBuffer } from "../utils/compression";
import { checkAuth } from "../utils/auth";

const deploy = async (options: { schema?: string; hooks?: string }) => {
  try {
    console.log(chalk.green("Deploying project..."));
    let uplaodQueue: FileBuffer[] = [];

    const user = await checkAuth();

    const schemaPath = options.schema || "schema.graphql";
    if (existsSync(schemaPath)) {
      const data = await readFileSync(schemaPath);
      uplaodQueue.push({
        name: "schema.graphql",
        type: "graphql",
        data: data,
      });
      console.log(chalk.green("Found file: schema.graphql"));
    }

    const hooksPath = options.hooks || "hooks.py";
    if (existsSync(hooksPath)) {
      const data = await readFileSync(hooksPath);
      uplaodQueue.push({
        name: "hooks.py",
        type: "hooks",
        data: data,
      });
      console.log(chalk.green("Found file: hooks.py"));
    }

    if (uplaodQueue.length === 0) {
      console.log(chalk.red("Err: No files to upload"));
      return;
    }

    // Zip files before uploading
    const zipPath = await zipFiles(uplaodQueue);
    console.log(chalk.green("Zipping files"));

    // Upload files
    console.log(chalk.green("Deploying service..."));
    const form = new FormData();
    form.append("file", createReadStream(zipPath));
    const uploadResponse = await axios.post(
      `${config.host}/v1/deployment/deploy`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer TODO`,
          "X-Api-Key": user?.apiKey || "",
        },
        timeout: 1000 * 60 * 5,
      }
    );
    console.log(uploadResponse);
    if (uploadResponse.status === 200) {
      console.log(chalk.green("Deployment successful!"));
      console.log(chalk.green("GraphQL URL: " + uploadResponse.data.url));
    } else {
      throw new Error("Upload failed");
    }
  } catch (err) {
    console.error(chalk.red("Deployment failed"));
    console.error(chalk.red("====================================="));
    console.error(chalk.red(err));
    console.error(chalk.red("====================================="));
  }
};

export default deploy;
