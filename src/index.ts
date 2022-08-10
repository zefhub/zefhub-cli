import { Command } from "commander";
import init from "./commands/init";
import up from "./commands/up";

const program = new Command();

program.name("zefhub").description("Zefhub CLI").version("0.0.1");

program.command("init").description("initialize a new project").action(init);

program.command("up").description("deploy the project to zefhub").action(up);

program.parse();
