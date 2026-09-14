import assert from "node:assert/strict";
import test from "node:test";

import { runCli } from "../dist/cli.js";

const holders = [
  {
    dataHolderBrandId: "zeta",
    brandName: "Zeta Energy",
    publicBaseUri: "https://public.zeta.test",
    productBaseUri: "https://products.zeta.test",
    logoUri: "https://zeta.test/logo.svg",
    industries: ["energy"],
    lastUpdated: "2026-09-14T00:00:00Z",
    abn: "99999999999",
  },
  {
    dataHolderBrandId: "alpha",
    brandName: "Alpha Bank",
    brandGroup: "Alpha Group",
    publicBaseUri: "https://public.alpha.test",
    productBaseUri: "https://products.alpha.test",
    logoUri: "https://alpha.test/logo.svg",
    industries: ["banking"],
    lastUpdated: "2026-09-14T00:00:00Z",
    abn: "11111111111",
  },
];

test("holders forwards the sector and returns searchable JSON", async () => {
  let receivedOptions;
  const result = await runCli(
    ["holders", "--sector", "banking", "--search", "alpha", "--json"],
    "0.1.0",
    {
      listDataHolders: async (options) => {
        receivedOptions = options;
        return holders;
      },
    },
  );

  assert.deepEqual(receivedOptions, { industry: "banking" });
  assert.equal(result.exitCode, 0);
  assert.deepEqual(JSON.parse(result.stdout), [holders[1]]);
});

test("holders accepts --industry as an alias for --sector", async () => {
  const received = [];
  const dependencies = {
    listDataHolders: async (options) => {
      received.push(options);
      return [];
    },
  };

  await runCli(["holders", "--industry", "energy"], "0.1.0", dependencies);
  await runCli(
    ["holders", "--industry=non-bank-lending"],
    "0.1.0",
    dependencies,
  );

  assert.deepEqual(received, [
    { industry: "energy" },
    { industry: "non-bank-lending" },
  ]);
});

test("holders displays a sorted table", async () => {
  const result = await runCli(["holders"], "0.1.0", {
    listDataHolders: async () => holders,
  });

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /^HOLDER\s+INDUSTRIES\s+PRODUCT API/m);
  assert.ok(result.stdout.indexOf("Alpha Bank") < result.stdout.indexOf("Zeta Energy"));
  assert.match(result.stdout, /https:\/\/products\.alpha\.test/);
});

test("holders rejects unknown sectors without making a request", async () => {
  let called = false;
  const result = await runCli(
    ["holders", "--sector", "insurance"],
    "0.1.0",
    {
      listDataHolders: async () => {
        called = true;
        return [];
      },
    },
  );

  assert.equal(called, false);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /Unknown sector: insurance/);
});

test("holders reports request failures without a stack trace", async () => {
  const result = await runCli(["holders"], "0.1.0", {
    listDataHolders: async () => {
      throw new Error("Network unavailable");
    },
  });

  assert.deepEqual(result, {
    exitCode: 1,
    stderr: "Network unavailable\n",
  });
});

test("banking products requires a holder without making a request", async () => {
  let called = false;
  const result = await runCli(["banking", "products"], "0.1.0", {
    listDataHolders: async () => {
      called = true;
      return [];
    },
    listBankingProducts: async () => {
      called = true;
      return [];
    },
  });

  assert.equal(called, false);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /Option --holder is required/);
});

test("banking products resolves a holder and forwards normalized filters", async () => {
  const products = [
    {
      productId: "z-product",
      lastUpdated: "2026-09-14T00:00:00Z",
      productCategory: "TERM_DEPOSITS",
      name: "Zeta Saver",
      description: "Not selected by the search.",
      brand: "Alpha",
      brandName: "Alpha Bank",
      isTailored: false,
    },
    {
      productId: "a-product",
      lastUpdated: "2026-09-14T00:00:00Z",
      productCategory: "TERM_DEPOSITS",
      name: "Alpha Term Deposit",
      description: "Selected product.",
      brand: "Alpha",
      brandName: "Alpha Bank",
      isTailored: false,
    },
  ];
  let receivedBaseUrl;
  let receivedOptions;
  const result = await runCli(
    [
      "banking",
      "products",
      "--holder",
      "alpha",
      "--category=term-deposits",
      "--effective",
      "all",
      "--updated-since",
      "2026-09-01T00:00:00Z",
      "--brand",
      "Alpha",
      "--search",
      "selected product",
      "--json",
    ],
    "0.1.0",
    {
      listDataHolders: async (options) => {
        assert.deepEqual(options, { industry: "banking" });
        return holders;
      },
      listBankingProducts: async (baseUrl, options) => {
        receivedBaseUrl = baseUrl;
        receivedOptions = options;
        return products;
      },
    },
  );

  assert.equal(receivedBaseUrl, "https://products.alpha.test");
  assert.deepEqual(receivedOptions, {
    brand: "Alpha",
    productCategory: "TERM_DEPOSITS",
    effective: "ALL",
    updatedSince: "2026-09-01T00:00:00Z",
  });
  assert.equal(result.exitCode, 0);
  assert.deepEqual(JSON.parse(result.stdout), [products[1]]);
});

test("banking products rejects ambiguous holder names", async () => {
  let productsCalled = false;
  const result = await runCli(
    ["banking", "products", "--holder", "a"],
    "0.1.0",
    {
      listDataHolders: async () => holders,
      listBankingProducts: async () => {
        productsCalled = true;
        return [];
      },
    },
  );

  assert.equal(productsCalled, false);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /Data holder is ambiguous: a/);
  assert.match(result.stderr, /Alpha Bank/);
  assert.match(result.stderr, /Zeta Energy/);
});

test("banking products displays a table", async () => {
  const product = {
    productId: "product-1",
    lastUpdated: "2026-09-14T00:00:00Z",
    productCategory: "TERM_DEPOSITS",
    name: "Term Deposit",
    description: "A term deposit.",
    brand: "Alpha",
    brandName: "Alpha Bank",
    isTailored: false,
  };
  const result = await runCli(
    ["banking", "products", "--holder", "alpha"],
    "0.1.0",
    {
      listDataHolders: async () => holders,
      listBankingProducts: async () => [product],
    },
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /^BRAND\s+CATEGORY\s+PRODUCT\s+PRODUCT ID/m);
  assert.match(result.stdout, /Alpha Bank\s+TERM_DEPOSITS\s+Term Deposit/);
});

test("banking product requires a product ID without making a request", async () => {
  let called = false;
  const result = await runCli(
    ["banking", "product", "--holder", "alpha"],
    "0.1.0",
    {
      listDataHolders: async () => {
        called = true;
        return holders;
      },
      getBankingProduct: async () => {
        called = true;
        return {};
      },
    },
  );

  assert.equal(called, false);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /A product ID is required/);
});

test("banking product resolves its holder and returns detailed JSON", async () => {
  const product = {
    productId: "product-1",
    lastUpdated: "2026-09-14T00:00:00Z",
    productCategory: "TERM_DEPOSITS",
    name: "Term Deposit Deposit",
    description: "A term deposit.",
    brand: "Alpha",
    brandName: "Alpha Bank",
    isTailored: false,
    depositRates: [
      {
        depositRateType: "FIXED",
        rate: "0.0515",
        applicationType: "PERIODIC",
        applicationFrequency: "P1Y",
        additionalInfo: "Interest at maturity",
      },
    ],
  };
  let receivedBaseUrl;
  let receivedProductId;
  const result = await runCli(
    ["banking", "product", "product-1", "--holder=alpha", "--json"],
    "0.1.0",
    {
      listDataHolders: async (options) => {
        assert.deepEqual(options, { industry: "banking" });
        return holders;
      },
      getBankingProduct: async (baseUrl, productId) => {
        receivedBaseUrl = baseUrl;
        receivedProductId = productId;
        return product;
      },
    },
  );

  assert.equal(receivedBaseUrl, "https://products.alpha.test");
  assert.equal(receivedProductId, "product-1");
  assert.equal(result.exitCode, 0);
  assert.deepEqual(JSON.parse(result.stdout), product);
});

test("banking product displays key details and rates", async () => {
  const product = {
    productId: "product-1",
    lastUpdated: "2026-09-14T00:00:00Z",
    productCategory: "TERM_DEPOSITS",
    name: "Term Deposit",
    description: "A term deposit.",
    brand: "Alpha",
    brandName: "Alpha Bank",
    isTailored: false,
    depositRates: [
      {
        depositRateType: "FIXED",
        rate: "0.0515",
        applicationType: "PERIODIC",
        applicationFrequency: "P1Y",
      },
    ],
    constraints: [
      { constraintType: "MIN_BALANCE", additionalValue: "5000.00" },
    ],
  };
  const result = await runCli(
    ["banking", "product", "product-1", "--holder", "alpha"],
    "0.1.0",
    {
      listDataHolders: async () => holders,
      getBankingProduct: async () => product,
    },
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /^Term Deposit\nBrand: Alpha Bank/m);
  assert.match(result.stdout, /DEPOSIT RATES/);
  assert.match(result.stdout, /FIXED\s+5\.15%\s+PERIODIC\s+P1Y/);
  assert.match(result.stdout, /CONSTRAINTS/);
  assert.match(result.stdout, /MIN_BALANCE\s+5000\.00/);
});
