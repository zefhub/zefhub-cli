import { createReadStream, existsSync, readFileSync } from "fs";
import chalk from "chalk";
import axios from "axios";
import FormData from "form-data";
import config from "../config";
import { zipFiles, FileBuffer } from "../utils/compression";
import { checkAuth } from "../utils/auth";

const up = async () => {
  try {
    console.log(chalk.green("Deploying project..."));
    let uplaodQueue: FileBuffer[] = [];

    const user = await checkAuth();

    if (existsSync("schema.graphql")) {
      const data = await readFileSync("schema.graphql");
      uplaodQueue.push({
        name: "schema.graphql",
        type: "graphql",
        data: data,
      });
      console.log(chalk.green("Found file: schema.graphql"));
    }
    if (existsSync("hooks.py")) {
      const data = await readFileSync("hooks.py");
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
      `${config.host}/v1/deployment/up`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer TODO`,
          "X-Api-Key": user?.apiKey || "",
        },
      }
    );
    if (uploadResponse.status === 200) {
      console.log(chalk.green("Deployment successful!"));
      console.log(
        chalk.green("GraphQL URL: " + uploadResponse.data.service.uri + "/gql")
      );
    } else {
      throw new Error("Upload failed");
    }
  } catch (err) {
    console.error(chalk.red("Deployment failed"));
  }
};

export default up;
