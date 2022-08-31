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

import { Command } from "commander";
import init from "./commands/init";
import up from "./commands/up";
import list from "./commands/list";

const program = new Command();

program.name("zefhub").description("Zefhub CLI").version("0.0.1");

program.command("init").description("initialize a new project").action(init);

program.command("up").description("deploy the project to zefhub").action(up);

program.command("list").description("list all service revisions").action(list);

program.parse();
