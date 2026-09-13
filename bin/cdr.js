#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const help = `cdr.js

Query organisations exposing data under Australia's Consumer Data Right.

Usage:
  cdr <command> [options]

Options:
  -h, --help     Show help
  -v, --version  Show version

Commands will be added as the public CDR clients are implemented.
`;

const [argument] = process.argv.slice(2);

if (argument === undefined || argument === "--help" || argument === "-h") {
  process.stdout.write(help);
} else if (argument === "--version" || argument === "-v") {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  process.stdout.write(`${packageJson.version}\n`);
} else {
  process.stderr.write(`Unknown command: ${argument}\n\n${help}`);
  process.exitCode = 1;
}
