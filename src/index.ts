#!/usr/bin/env node

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

import { Command, Option } from "commander";
import init from "./commands/init";
import up from "./commands/up";
import deploy from "./commands/deploy";
import list from "./commands/list";
import logs from "./commands/logs";
import start from "./commands/start";
import stop from "./commands/stop";
import del from "./commands/delete";

const program = new Command();

program.name("zefhub").description("ZefHub CLI").version("0.0.12");

const easygraphql = program.command("easygraphql");

easygraphql
  .command("init")
  .description("initialize a new project")
  .action(init);

easygraphql
  .command("deploy")
  .description("deploy project to zefhub")
  .addOption(
    new Option("--schema [path]", "path to schema file").preset(
      "schema.graphql"
    )
  )
  .addOption(
    new Option("--hooks [path]", "path to hooks file").preset("hooks.py")
  )
  .action(deploy);

easygraphql
  .command("up")
  .description("(DEPRICATED) deploy the project to zefhub")
  .action(up);

easygraphql
  .command("list")
  .description("list all services")
  .addHelpText(
    "after",
    "will list all services deployed to ZefHub by the current user"
  )
  .action(list);

easygraphql.command("logs").description("get logs for a service").action(logs);

easygraphql.command("start").description("start a service").action(start);

easygraphql.command("stop").description("stop a service").action(stop);

easygraphql.command("delete").description("delete a service").action(del);

program.parse(process.argv);
