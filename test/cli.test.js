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
  assert.match(result.stdout, /^BRAND\s+INDUSTRIES\s+PRODUCT API/m);
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
