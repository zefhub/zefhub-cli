import { createReadStream, existsSync, readFileSync } from "fs";
import chalk from "chalk";
import axios from "axios";
import FormData from "form-data";
import { zipFiles, FileBuffer } from "../utils/compression";
import { checkAuth } from "../utils/auth";

const up = async () => {
  try {
    console.log(chalk.green("Deploying project..."));
    let uplaodQueue: FileBuffer[] = [];

    await checkAuth();

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
    console.log(chalk.green("Uploading files..."));
    const form = new FormData();
    form.append("file", createReadStream(zipPath));
    const uploadResponse = await axios.post(
      "http://localhost:8080/v1/deployment/up",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${process.env.ZEFHUB_AUTH_KEY}`,
        },
      }
    );
    if (uploadResponse.status === 200) {
      console.log(chalk.green("Upload successful!"));
    } else {
      throw new Error("Upload failed");
    }
  } catch (err) {
    console.error(err);
  }
};

export default up;
