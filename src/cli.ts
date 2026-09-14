import {
  isCdrIndustry,
  listDataHolders,
  type CdrIndustryFilter,
  type DataHolderBrand,
  type ListDataHoldersOptions,
} from "./register.js";
import {
  isBankingProductCategory,
  isBankingProductEffective,
  getBankingProduct,
  listBankingProducts,
  type BankingProduct,
  type BankingProductCategory,
  type BankingProductDetail,
  type BankingProductEffective,
  type BankingProductFee,
  type GetBankingProductOptions,
  type ListBankingProductsOptions,
} from "./banking.js";

const help = `cdr.js

Query organisations exposing data under Australia's Consumer Data Right.

Usage:
  cdr <command> [options]

Commands:
  holders           List CDR data-holder brands and their public endpoints
  banking products  List public banking products for a data holder
  banking product   Get detailed information for one banking product

Options:
  -h, --help     Show help
  -v, --version  Show version
`;

const bankingHelp = `cdr banking

Query public banking data.

Usage:
  cdr banking <command> [options]

Commands:
  products  List public products for a banking data holder
  product   Get detailed information for one banking product

Options:
  -h, --help  Show help
`;

const bankingProductHelp = `cdr banking product

Get detailed public information for one banking product.

Usage:
  cdr banking product <product-id> --holder <name-or-id> [options]

Options:
  --holder <name-or-id>  Data-holder brand name or Register identifier
  --json                 Output JSON
  -h, --help             Show help
`;

const bankingProductsHelp = `cdr banking products

List public banking products for one data holder.

Usage:
  cdr banking products --holder <name-or-id> [options]

Options:
  --holder <name-or-id>  Data-holder brand name or Register identifier
  --category <category>  Filter by product category (for example term-deposits)
  --effective <value>    Filter by current, future, or all (default: current)
  --updated-since <time> Include products updated after an ISO 8601 date-time
  --brand <brand>        Filter on the product API's brand field
  --search <text>        Search product names, brands, descriptions, and IDs
  --json                 Output JSON
  -h, --help             Show help
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
  listBankingProducts(
    productBaseUrl: string | URL,
    options?: ListBankingProductsOptions,
  ): Promise<BankingProduct[]>;
  getBankingProduct(
    productBaseUrl: string | URL,
    productId: string,
    options?: GetBankingProductOptions,
  ): Promise<BankingProductDetail>;
}

interface HoldersOptions {
  help: boolean;
  industry: CdrIndustryFilter;
  json: boolean;
  search?: string;
}

interface BankingProductsOptions {
  brand?: string;
  category?: BankingProductCategory;
  effective?: BankingProductEffective;
  help: boolean;
  holder?: string;
  json: boolean;
  search?: string;
  updatedSince?: string;
}

interface BankingProductOptions {
  help: boolean;
  holder?: string;
  json: boolean;
  productId?: string;
}

const defaultDependencies: CliDependencies = {
  listDataHolders,
  getBankingProduct,
  listBankingProducts,
};

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

  if (command === "holders") {
    return runHolders(commandArgs, dependencies);
  }

  if (command === "banking") {
    return runBanking(commandArgs, dependencies);
  }

  return failure(`Unknown command: ${command}`, help);
}

async function runHolders(
  args: readonly string[],
  dependencies: CliDependencies,
): Promise<CliResult> {
  const parsed = parseHoldersOptions(args);

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

async function runBanking(
  args: readonly string[],
  dependencies: CliDependencies,
): Promise<CliResult> {
  const [command, ...commandArgs] = args;

  if (command === undefined || command === "--help" || command === "-h") {
    return { exitCode: 0, stdout: bankingHelp };
  }

  if (command === "product") {
    return runBankingProduct(commandArgs, dependencies);
  }

  if (command !== "products") {
    return failure(`Unknown banking command: ${command}`, bankingHelp);
  }

  const parsed = parseBankingProductsOptions(commandArgs);

  if (typeof parsed === "string") {
    return failure(parsed, bankingProductsHelp);
  }

  if (parsed.help) {
    return { exitCode: 0, stdout: bankingProductsHelp };
  }

  if (parsed.holder === undefined) {
    return failure("Option --holder is required", bankingProductsHelp);
  }

  try {
    const holders = await dependencies.listDataHolders({
      industry: "banking",
    });
    const holder = resolveHolder(holders, parsed.holder);

    if (typeof holder === "string") {
      return { exitCode: 1, stderr: `${holder}\n` };
    }

    if (holder.productBaseUri === undefined) {
      return {
        exitCode: 1,
        stderr: `${holder.brandName} does not publish a product API URL.\n`,
      };
    }

    const products = await dependencies.listBankingProducts(
      holder.productBaseUri,
      {
        ...(parsed.brand === undefined ? {} : { brand: parsed.brand }),
        ...(parsed.category === undefined
          ? {}
          : { productCategory: parsed.category }),
        ...(parsed.effective === undefined
          ? {}
          : { effective: parsed.effective }),
        ...(parsed.updatedSince === undefined
          ? {}
          : { updatedSince: parsed.updatedSince }),
      },
    );
    const filtered = filterAndSortProducts(products, parsed.search);

    return {
      exitCode: 0,
      stdout: parsed.json
        ? `${JSON.stringify(filtered, null, 2)}\n`
        : formatProducts(filtered),
    };
  } catch (error) {
    return {
      exitCode: 1,
      stderr: `${error instanceof Error ? error.message : String(error)}\n`,
    };
  }
}

async function runBankingProduct(
  args: readonly string[],
  dependencies: CliDependencies,
): Promise<CliResult> {
  const parsed = parseBankingProductOptions(args);

  if (typeof parsed === "string") {
    return failure(parsed, bankingProductHelp);
  }

  if (parsed.help) {
    return { exitCode: 0, stdout: bankingProductHelp };
  }

  if (parsed.productId === undefined) {
    return failure("A product ID is required", bankingProductHelp);
  }

  if (parsed.holder === undefined) {
    return failure("Option --holder is required", bankingProductHelp);
  }

  try {
    const holders = await dependencies.listDataHolders({
      industry: "banking",
    });
    const holder = resolveHolder(holders, parsed.holder);

    if (typeof holder === "string") {
      return { exitCode: 1, stderr: `${holder}\n` };
    }

    if (holder.productBaseUri === undefined) {
      return {
        exitCode: 1,
        stderr: `${holder.brandName} does not publish a product API URL.\n`,
      };
    }

    const product = await dependencies.getBankingProduct(
      holder.productBaseUri,
      parsed.productId,
    );

    return {
      exitCode: 0,
      stdout: parsed.json
        ? `${JSON.stringify(product, null, 2)}\n`
        : formatProductDetail(product),
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

function parseBankingProductsOptions(
  args: readonly string[],
): BankingProductsOptions | string {
  const options: BankingProductsOptions = {
    help: false,
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

    if (
      argument === "--holder" ||
      argument === "--brand" ||
      argument === "--search" ||
      argument === "--updated-since"
    ) {
      const value = args[index + 1];

      if (value === undefined || value.startsWith("-")) {
        return `Option ${argument} requires a value`;
      }

      setBankingStringOption(options, argument, value);
      index += 1;
      continue;
    }

    if (
      argument.startsWith("--holder=") ||
      argument.startsWith("--brand=") ||
      argument.startsWith("--search=") ||
      argument.startsWith("--updated-since=")
    ) {
      const option = argument.slice(0, argument.indexOf("="));
      const value = argument.slice(argument.indexOf("=") + 1);

      if (value === "") {
        return `Option ${option} requires a value`;
      }

      setBankingStringOption(options, option, value);
      continue;
    }

    if (argument === "--category") {
      const value = args[index + 1];

      if (value === undefined || value.startsWith("-")) {
        return "Option --category requires a value";
      }

      const category = normalizeCategory(value);

      if (category === undefined) {
        return `Unknown banking product category: ${value}`;
      }

      options.category = category;
      index += 1;
      continue;
    }

    if (argument.startsWith("--category=")) {
      const value = argument.slice("--category=".length);
      const category = normalizeCategory(value);

      if (category === undefined) {
        return `Unknown banking product category: ${value}`;
      }

      options.category = category;
      continue;
    }

    if (argument === "--effective") {
      const value = args[index + 1];

      if (value === undefined || value.startsWith("-")) {
        return "Option --effective requires a value";
      }

      const effective = normalizeEffective(value);

      if (effective === undefined) {
        return `Unknown effective value: ${value}`;
      }

      options.effective = effective;
      index += 1;
      continue;
    }

    if (argument.startsWith("--effective=")) {
      const value = argument.slice("--effective=".length);
      const effective = normalizeEffective(value);

      if (effective === undefined) {
        return `Unknown effective value: ${value}`;
      }

      options.effective = effective;
      continue;
    }

    return `Unknown option: ${argument}`;
  }

  return options;
}

function parseBankingProductOptions(
  args: readonly string[],
): BankingProductOptions | string {
  const options: BankingProductOptions = {
    help: false,
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

    if (argument === "--holder") {
      const holder = args[index + 1];

      if (holder === undefined || holder.startsWith("-")) {
        return "Option --holder requires a value";
      }

      options.holder = holder;
      index += 1;
      continue;
    }

    if (argument.startsWith("--holder=")) {
      const holder = argument.slice("--holder=".length);

      if (holder === "") {
        return "Option --holder requires a value";
      }

      options.holder = holder;
      continue;
    }

    if (argument.startsWith("-")) {
      return `Unknown option: ${argument}`;
    }

    if (options.productId !== undefined) {
      return `Unexpected argument: ${argument}`;
    }

    options.productId = argument;
  }

  return options;
}

function setBankingStringOption(
  options: BankingProductsOptions,
  option: string,
  value: string,
): void {
  if (option === "--holder") {
    options.holder = value;
  } else if (option === "--brand") {
    options.brand = value;
  } else if (option === "--search") {
    options.search = value;
  } else {
    options.updatedSince = value;
  }
}

function normalizeCategory(value: string): BankingProductCategory | undefined {
  const category = value.toUpperCase().replaceAll("-", "_");
  return isBankingProductCategory(category) ? category : undefined;
}

function normalizeEffective(value: string): BankingProductEffective | undefined {
  const effective = value.toUpperCase();
  return isBankingProductEffective(effective) ? effective : undefined;
}

function resolveHolder(
  holders: readonly DataHolderBrand[],
  query: string,
): DataHolderBrand | string {
  const needle = normalizeSearch(query);
  const exact = holders.filter((holder) =>
    holderIdentityValues(holder).some(
      (value) => normalizeSearch(value) === needle,
    ),
  );

  if (exact.length === 1 && exact[0] !== undefined) {
    return exact[0];
  }

  const matches =
    exact.length > 1
      ? exact
      : holders.filter((holder) =>
          holderIdentityValues(holder).some((value) =>
            normalizeSearch(value).includes(needle),
          ),
        );

  if (matches.length === 0) {
    return `No banking data holder matches: ${query}`;
  }

  if (matches.length > 1) {
    return `Data holder is ambiguous: ${query}\nMatches: ${matches
      .map((holder) => holder.brandName)
      .sort((left, right) => left.localeCompare(right, "en-AU"))
      .join(", ")}`;
  }

  return matches[0] as DataHolderBrand;
}

function holderIdentityValues(holder: DataHolderBrand): string[] {
  return [
    holder.brandName,
    holder.dataHolderBrandId,
    holder.interimId,
  ].filter((value): value is string => value !== undefined);
}

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase("en-AU");
}

function filterAndSortProducts(
  products: readonly BankingProduct[],
  search: string | undefined,
): BankingProduct[] {
  const needle = search === undefined ? undefined : normalizeSearch(search);
  const filtered = needle
    ? products.filter((product) =>
        [
          product.name,
          product.brand,
          product.brandName,
          product.brandGroup,
          product.description,
          product.productId,
          product.productCategory,
        ]
          .filter((value): value is string => value !== undefined)
          .some((value) => normalizeSearch(value).includes(needle)),
      )
    : [...products];

  return filtered.sort(
    (left, right) =>
      (left.brandName ?? left.brand).localeCompare(
        right.brandName ?? right.brand,
        "en-AU",
        { sensitivity: "base" },
      ) ||
      left.name.localeCompare(right.name, "en-AU", { sensitivity: "base" }) ||
      left.productId.localeCompare(right.productId, "en-AU"),
  );
}

function formatProducts(products: readonly BankingProduct[]): string {
  if (products.length === 0) {
    return "No banking products found.\n";
  }

  const headings = ["BRAND", "CATEGORY", "PRODUCT", "PRODUCT ID"];
  const rows = products.map((product) => [
    product.brandName ?? product.brand,
    product.productCategory,
    product.name,
    product.productId,
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

function formatProductDetail(product: BankingProductDetail): string {
  const lines = [
    product.name,
    `Brand: ${product.brandName ?? product.brand}`,
    `Category: ${product.productCategory}`,
    `Product ID: ${product.productId}`,
    `Last updated: ${product.lastUpdated}`,
    `Tailored: ${product.isTailored ? "yes" : "no"}`,
  ];

  if (product.effectiveFrom !== undefined) {
    lines.push(`Effective from: ${product.effectiveFrom}`);
  }

  if (product.effectiveTo !== undefined) {
    lines.push(`Effective to: ${product.effectiveTo}`);
  }

  if (product.applicationUri !== undefined) {
    lines.push(`Apply: ${product.applicationUri}`);
  }

  lines.push("", product.description);

  if (product.depositRates !== undefined && product.depositRates.length > 0) {
    appendDetailTable(
      lines,
      "DEPOSIT RATES",
      [
        "TYPE",
        "RATE",
        "APPLICATION",
        "FREQUENCY",
        "VALUE",
        "INFORMATION",
      ],
      product.depositRates.map((rate) => [
        rate.depositRateType,
        formatPercentage(rate.rate),
        rate.applicationType,
        rate.applicationFrequency ?? "—",
        rate.additionalValue ?? "—",
        rate.additionalInfo ?? "—",
      ]),
    );
  }

  if (product.lendingRates !== undefined && product.lendingRates.length > 0) {
    appendDetailTable(
      lines,
      "LENDING RATES",
      ["TYPE", "RATE", "COMPARISON", "REPAYMENT", "PURPOSE"],
      product.lendingRates.map((rate) => [
        rate.lendingRateType,
        formatPercentage(rate.rate),
        rate.comparisonRate === undefined
          ? "—"
          : formatPercentage(rate.comparisonRate),
        rate.repaymentType,
        rate.loanPurpose,
      ]),
    );
  }

  if (product.fees !== undefined && product.fees.length > 0) {
    appendDetailTable(
      lines,
      "FEES",
      ["NAME", "TYPE", "CHARGE"],
      product.fees.map((fee) => [fee.name, fee.feeType, formatFee(fee)]),
    );
  }

  if (product.constraints !== undefined && product.constraints.length > 0) {
    appendDetailTable(
      lines,
      "CONSTRAINTS",
      ["TYPE", "VALUE", "INFORMATION"],
      product.constraints.map((constraint) => [
        constraint.constraintType,
        constraint.additionalValue ?? "—",
        constraint.additionalInfo ?? "—",
      ]),
    );
  }

  if (product.eligibility !== undefined && product.eligibility.length > 0) {
    appendDetailTable(
      lines,
      "ELIGIBILITY",
      ["TYPE", "VALUE", "INFORMATION"],
      product.eligibility.map((eligibility) => [
        eligibility.eligibilityType,
        eligibility.additionalValue ?? "—",
        eligibility.additionalInfo ?? "—",
      ]),
    );
  }

  if (product.features !== undefined && product.features.length > 0) {
    appendDetailTable(
      lines,
      "FEATURES",
      ["TYPE", "VALUE", "INFORMATION"],
      product.features.map((feature) => [
        feature.featureType,
        feature.additionalValue ?? "—",
        feature.additionalInfo ?? "—",
      ]),
    );
  }

  if (product.bundles !== undefined && product.bundles.length > 0) {
    appendDetailTable(
      lines,
      "BUNDLES",
      ["NAME", "DESCRIPTION"],
      product.bundles.map((bundle) => [bundle.name, bundle.description]),
    );
  }

  if (product.instalments !== undefined) {
    appendDetailTable(
      lines,
      "INSTALMENTS",
      ["MIN SPLIT", "MAX SPLIT", "MIN VALUE", "MAX VALUE"],
      [[
        String(product.instalments.minimumSplit),
        String(product.instalments.maximumSplit),
        product.instalments.minimumPlanValue ?? "—",
        product.instalments.maximumPlanValue ?? "—",
      ]],
    );
  }

  return `${lines.join("\n")}\n`;
}

function appendDetailTable(
  lines: string[],
  title: string,
  headings: string[],
  rows: string[][],
): void {
  const widths = headings.map((heading, index) =>
    Math.max(heading.length, ...rows.map((row) => row[index]?.length ?? 0)),
  );
  const table = [headings, ...rows].map((row) =>
    row
      .map((cell, index) =>
        index === row.length - 1 ? cell : cell.padEnd(widths[index] ?? 0),
      )
      .join("  "),
  );

  lines.push("", title, ...table);
}

function formatPercentage(value: string): string {
  const rate = Number(value);

  if (!Number.isFinite(rate)) {
    return value;
  }

  return `${(rate * 100).toLocaleString("en-AU", {
    maximumFractionDigits: 10,
  })}%`;
}

function formatFee(fee: BankingProductFee): string {
  if (fee.fixedAmount !== undefined) {
    return `${fee.fixedAmount.amount} ${fee.currency ?? "AUD"}`;
  }

  if (fee.rateBased !== undefined) {
    return `${formatPercentage(fee.rateBased.rate)} ${fee.rateBased.rateType}`;
  }

  if (fee.variable !== undefined) {
    return `${fee.variable.feeMinimum ?? "?"}–${fee.variable.feeMaximum ?? "?"} ${fee.currency ?? "AUD"}`;
  }

  return "Variable";
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
