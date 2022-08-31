import chalk from "chalk";
import axios from "axios";
import config from "../config";
import { checkAuth } from "../utils/auth";

const list = async () => {
  const user = await checkAuth();

  const listResponse = await axios.get(
    `${config.host}/v1/deployment/{service}/revisions`,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer TODO`,
        "X-Api-Key": user?.apiKey || "",
      },
    }
  );
  if (listResponse.status === 200) {
    if (listResponse.data.revisions) {
      listResponse.data.revisions.forEach((revision: any, index: number) => {
        const revId = revision.revisionId.split("/").pop();
        console.log(chalk.green(`${index + 1}: ${revId}`));
      });
    } else {
      console.log(chalk.blue("No revisions found"));
    }
  } else {
    throw new Error("List failed");
  }
};

export default list;
