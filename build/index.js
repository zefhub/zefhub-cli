"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = __importDefault(require("./commands/init"));
const up_1 = __importDefault(require("./commands/up"));
const program = new commander_1.Command();
program.name("zefhub").description("Zefhub CLI").version("0.0.1");
program.command("init").description("initialize a new project").action(init_1.default);
program.command("up").description("deploy the project to zefhub").action(up_1.default);
program.parse();
