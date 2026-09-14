import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

test("the package root is importable", async () => {
  const cdr = await import("cdr.js");

  assert.deepEqual(Object.keys(cdr), []);
});

test("the compiled CLI core rejects unknown commands", async () => {
  const { runCli } = await import("../dist/cli.js");
  const result = runCli(["unknown"], "0.1.0");

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /Unknown command: unknown/);
});

test("the CLI displays help", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [new URL("../bin/cdr.js", import.meta.url).pathname, "--help"],
  );

  assert.match(stdout, /Usage:\n  cdr <command>/);
});

test("the CLI reports the package version", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [new URL("../bin/cdr.js", import.meta.url).pathname, "--version"],
  );

  assert.equal(stdout, "0.1.0\n");
});
