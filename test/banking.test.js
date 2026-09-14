import assert from "node:assert/strict";
import test from "node:test";

import {
  CdrBankingError,
  createBankingClient,
} from "../dist/index.js";

function response(products, totalPages) {
  return {
    data: { products },
    links: { self: "https://example.test/products" },
    meta: { totalPages, totalRecords: products.length },
  };
}

const firstProduct = {
  productId: "product-1",
  lastUpdated: "2026-09-14T00:00:00Z",
  productCategory: "TERM_DEPOSITS",
  name: "Term Deposit",
  description: "A term deposit.",
  brand: "Example",
  brandName: "Example Bank",
  brandGroup: null,
  applicationUri: null,
  isTailored: false,
  additionalInformation: {
    termsUri: "https://example.test/terms",
    additionalTermsUris: [
      {
        description: null,
        additionalInfoUri: "https://example.test/more-terms",
      },
    ],
  },
};

const secondProduct = {
  productId: "product-2",
  effectiveFrom: "2026-10-01T00:00:00Z",
  lastUpdated: "2026-09-13T00:00:00Z",
  productCategory: "CRED_AND_CHRG_CARDS",
  name: "Credit Card",
  description: "A credit card.",
  brand: "Example",
  isTailored: true,
  cardArt: [
    {
      cardScheme: "VISA",
      cardType: "CREDIT",
      imageUri: "https://example.test/card.png",
    },
  ],
};

test("listProducts preserves base paths, forwards filters, and fetches every page", async () => {
  const requests = [];
  const client = createBankingClient({
    baseUrl: "https://holder.example.test/OpenBanking",
    fetch: async (input, init) => {
      const url = new URL(input);
      requests.push({ url, headers: new Headers(init?.headers) });
      const page = Number(url.searchParams.get("page"));

      return Response.json(
        page === 1
          ? response([firstProduct], 2)
          : response([secondProduct], 2),
      );
    },
  });

  const products = await client.listProducts({
    effective: "ALL",
    updatedSince: new Date("2026-09-01T00:00:00Z"),
    brand: "Example",
    productCategory: "TERM_DEPOSITS",
    pageSize: 1,
  });

  assert.equal(requests.length, 2);

  for (const { url, headers } of requests) {
    assert.equal(url.pathname, "/OpenBanking/cds-au/v1/banking/products");
    assert.equal(url.searchParams.get("page-size"), "1");
    assert.equal(url.searchParams.get("effective"), "ALL");
    assert.equal(
      url.searchParams.get("updated-since"),
      "2026-09-01T00:00:00.000Z",
    );
    assert.equal(url.searchParams.get("brand"), "Example");
    assert.equal(url.searchParams.get("product-category"), "TERM_DEPOSITS");
    assert.equal(headers.get("accept"), "application/json");
    assert.equal(headers.get("x-v"), "5");
  }

  assert.deepEqual(products, [
    {
      productId: "product-1",
      lastUpdated: "2026-09-14T00:00:00Z",
      productCategory: "TERM_DEPOSITS",
      name: "Term Deposit",
      description: "A term deposit.",
      brand: "Example",
      brandName: "Example Bank",
      isTailored: false,
      additionalInformation: {
        termsUri: "https://example.test/terms",
        additionalTermsUris: [
          { additionalInfoUri: "https://example.test/more-terms" },
        ],
      },
    },
    secondProduct,
  ]);
});

test("listProducts rejects unsuccessful responses", async () => {
  const client = createBankingClient({
    baseUrl: "https://holder.example.test",
    fetch: async () => new Response(null, { status: 503 }),
  });

  await assert.rejects(
    client.listProducts(),
    (error) =>
      error instanceof CdrBankingError &&
      error.status === 503 &&
      error.message === "Banking products request failed with HTTP 503",
  );
});

test("listProducts rejects malformed product data", async () => {
  const client = createBankingClient({
    baseUrl: "https://holder.example.test",
    fetch: async () =>
      Response.json(response([{ productId: 42 }], 1)),
  });

  await assert.rejects(
    client.listProducts(),
    (error) =>
      error instanceof CdrBankingError &&
      error.message === "Banking product API returned an unexpected response",
  );
});

test("listProducts validates pageSize before making a request", async () => {
  let called = false;
  const client = createBankingClient({
    baseUrl: "https://holder.example.test",
    fetch: async () => {
      called = true;
      return Response.json(response([], 0));
    },
  });

  await assert.rejects(client.listProducts({ pageSize: 0 }), {
    name: "TypeError",
    message: "pageSize must be a positive integer",
  });
  assert.equal(called, false);
});
