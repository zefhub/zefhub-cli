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
