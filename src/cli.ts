const help = `cdr.js

Query organisations exposing data under Australia's Consumer Data Right.

Usage:
  cdr <command> [options]

Options:
  -h, --help     Show help
  -v, --version  Show version

Commands will be added as the public CDR clients are implemented.
`;

export interface CliResult {
  exitCode: number;
  stdout?: string;
  stderr?: string;
}

export function runCli(
  args: readonly string[],
  version: string,
): CliResult {
  const [argument] = args;

  if (argument === undefined || argument === "--help" || argument === "-h") {
    return { exitCode: 0, stdout: help };
  }

  if (argument === "--version" || argument === "-v") {
    return { exitCode: 0, stdout: `${version}\n` };
  }

  return {
    exitCode: 1,
    stderr: `Unknown command: ${argument}\n\n${help}`,
  };
}
