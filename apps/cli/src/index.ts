#!/usr/bin/env node
import { buildRootCommand } from "./commands/index.js";

const program = buildRootCommand();
program.parse(process.argv);
