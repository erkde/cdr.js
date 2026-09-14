import assert from "node:assert/strict";
import test from "node:test";

import {
  CdrRegisterError,
  createRegisterClient,
} from "../dist/index.js";

const responseBody = {
  data: [
    {
      dataHolderBrandId: "brand-1",
      interimId: null,
      brandName: "Example Bank",
      brandGroup: null,
      publicBaseUri: "https://public.example.test",
      productBaseUri: "https://products.example.test",
      logoUri: "https://example.test/logo.svg",
      industries: ["banking"],
      lastUpdated: "2026-09-14T00:00:00Z",
      abn: "12345678901",
      acn: null,
      arbn: null,
    },
  ],
  links: { self: "https://example.test/register" },
  meta: {},
};

test("listDataHolders calls the public summary endpoint", async () => {
  let requestedUrl;
  let requestedHeaders;
  const client = createRegisterClient({
    baseUrl: "https://example.test/base/",
    fetch: async (input, init) => {
      requestedUrl = String(input);
      requestedHeaders = new Headers(init?.headers);
      return Response.json(responseBody);
    },
  });

  const holders = await client.listDataHolders({ industry: "banking" });

  assert.equal(
    requestedUrl,
    "https://example.test/cdr-register/v1/banking/data-holders/brands/summary",
  );
  assert.equal(requestedHeaders.get("accept"), "application/json");
  assert.equal(requestedHeaders.get("x-v"), "2");
  assert.deepEqual(holders, [
    {
      dataHolderBrandId: "brand-1",
      brandName: "Example Bank",
      publicBaseUri: "https://public.example.test",
      productBaseUri: "https://products.example.test",
      logoUri: "https://example.test/logo.svg",
      industries: ["banking"],
      lastUpdated: "2026-09-14T00:00:00Z",
      abn: "12345678901",
    },
  ]);
});

test("listDataHolders rejects unsuccessful responses", async () => {
  const client = createRegisterClient({
    fetch: async () => new Response(null, { status: 503 }),
  });

  await assert.rejects(
    client.listDataHolders(),
    (error) =>
      error instanceof CdrRegisterError &&
      error.status === 503 &&
      error.message === "CDR Register request failed with HTTP 503",
  );
});

test("listDataHolders rejects malformed response data", async () => {
  const client = createRegisterClient({
    fetch: async () => Response.json({ data: [{ brandName: 42 }] }),
  });

  await assert.rejects(
    client.listDataHolders(),
    (error) =>
      error instanceof CdrRegisterError &&
      error.message === "CDR Register returned an unexpected response",
  );
});
