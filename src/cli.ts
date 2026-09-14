import {
  isCdrIndustry,
  listDataHolders,
  type CdrIndustryFilter,
  type DataHolderBrand,
  type ListDataHoldersOptions,
} from "./register.js";

const help = `cdr.js

Query organisations exposing data under Australia's Consumer Data Right.

Usage:
  cdr <command> [options]

Commands:
  holders  List CDR data-holder brands and their public endpoints

Options:
  -h, --help     Show help
  -v, --version  Show version
`;

const holdersHelp = `cdr holders

List CDR data-holder brands and their public endpoints.

Usage:
  cdr holders [options]

Options:
  --sector <sector>  Filter by banking, energy, non-bank-lending, or telco
  --industry <name>  Alias for --sector
  --search <text>    Search names, identifiers, and registration numbers
  --json             Output JSON
  -h, --help         Show help
`;

export interface CliResult {
  exitCode: number;
  stdout?: string;
  stderr?: string;
}

export interface CliDependencies {
  listDataHolders(
    options?: ListDataHoldersOptions,
  ): Promise<DataHolderBrand[]>;
}

interface HoldersOptions {
  help: boolean;
  industry: CdrIndustryFilter;
  json: boolean;
  search?: string;
}

const defaultDependencies: CliDependencies = { listDataHolders };

export async function runCli(
  args: readonly string[],
  version: string,
  dependencies: CliDependencies = defaultDependencies,
): Promise<CliResult> {
  const [command, ...commandArgs] = args;

  if (command === undefined || command === "--help" || command === "-h") {
    return { exitCode: 0, stdout: help };
  }

  if (command === "--version" || command === "-v") {
    return { exitCode: 0, stdout: `${version}\n` };
  }

  if (command !== "holders") {
    return failure(`Unknown command: ${command}`, help);
  }

  const parsed = parseHoldersOptions(commandArgs);

  if (typeof parsed === "string") {
    return failure(parsed, holdersHelp);
  }

  if (parsed.help) {
    return { exitCode: 0, stdout: holdersHelp };
  }

  try {
    const holders = await dependencies.listDataHolders({
      industry: parsed.industry,
    });
    const filtered = filterAndSortHolders(holders, parsed.search);

    return {
      exitCode: 0,
      stdout: parsed.json
        ? `${JSON.stringify(filtered, null, 2)}\n`
        : formatHolders(filtered),
    };
  } catch (error) {
    return {
      exitCode: 1,
      stderr: `${error instanceof Error ? error.message : String(error)}\n`,
    };
  }
}

function parseHoldersOptions(args: readonly string[]): HoldersOptions | string {
  const options: HoldersOptions = {
    help: false,
    industry: "all",
    json: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === undefined) {
      continue;
    }

    if (argument === "--json") {
      options.json = true;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    if (argument === "--sector" || argument === "--industry") {
      const sector = args[index + 1];

      if (sector === undefined || sector.startsWith("-")) {
        return `Option ${argument} requires a value`;
      }

      if (sector !== "all" && !isCdrIndustry(sector)) {
        return `Unknown sector: ${sector}`;
      }

      options.industry = sector;
      index += 1;
      continue;
    }

    if (
      argument.startsWith("--sector=") ||
      argument.startsWith("--industry=")
    ) {
      const sector = argument.slice(argument.indexOf("=") + 1);

      if (sector !== "all" && !isCdrIndustry(sector)) {
        return `Unknown sector: ${sector}`;
      }

      options.industry = sector;
      continue;
    }

    if (argument === "--search") {
      const search = args[index + 1];

      if (search === undefined || search.startsWith("-")) {
        return "Option --search requires a value";
      }

      options.search = search;
      index += 1;
      continue;
    }

    if (argument.startsWith("--search=")) {
      options.search = argument.slice("--search=".length);
      continue;
    }

    return `Unknown option: ${argument}`;
  }

  return options;
}

function filterAndSortHolders(
  holders: readonly DataHolderBrand[],
  search: string | undefined,
): DataHolderBrand[] {
  const needle = search?.trim().toLocaleLowerCase("en-AU");
  const filtered = needle
    ? holders.filter((holder) =>
        searchableValues(holder).some((value) =>
          value.toLocaleLowerCase("en-AU").includes(needle),
        ),
      )
    : [...holders];

  return filtered.sort((left, right) =>
    left.brandName.localeCompare(right.brandName, "en-AU", {
      sensitivity: "base",
    }),
  );
}

function searchableValues(holder: DataHolderBrand): string[] {
  return [
    holder.brandName,
    holder.brandGroup,
    holder.dataHolderBrandId,
    holder.interimId,
    holder.abn,
    holder.acn,
    holder.arbn,
  ].filter((value): value is string => value !== undefined);
}

function formatHolders(holders: readonly DataHolderBrand[]): string {
  if (holders.length === 0) {
    return "No data holders found.\n";
  }

  const headings = ["BRAND", "INDUSTRIES", "PRODUCT API"];
  const rows = holders.map((holder) => [
    holder.brandName,
    holder.industries.join(","),
    holder.productBaseUri ?? "—",
  ]);
  const widths = headings.map((heading, index) =>
    Math.max(heading.length, ...rows.map((row) => row[index]?.length ?? 0)),
  );

  return `${[headings, ...rows]
    .map((row) =>
      row
        .map((cell, index) =>
          index === row.length - 1 ? cell : cell.padEnd(widths[index] ?? 0),
        )
        .join("  "),
    )
    .join("\n")}\n`;
}

function failure(message: string, usage: string): CliResult {
  return { exitCode: 1, stderr: `${message}\n\n${usage}` };
}
