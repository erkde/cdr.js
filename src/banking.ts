export const CDR_BANKING_PRODUCTS_VERSION = 5;

export const BANKING_PRODUCT_CATEGORIES = [
  "BUSINESS_LOANS",
  "BUY_NOW_PAY_LATER",
  "CRED_AND_CHRG_CARDS",
  "LEASES",
  "MARGIN_LOANS",
  "OVERDRAFTS",
  "PERS_LOANS",
  "REGULATED_TRUST_ACCOUNTS",
  "RESIDENTIAL_MORTGAGES",
  "TERM_DEPOSITS",
  "TRADE_FINANCE",
  "TRANS_AND_SAVINGS_ACCOUNTS",
  "TRAVEL_CARDS",
] as const;

export const BANKING_PRODUCT_EFFECTIVE_VALUES = [
  "ALL",
  "CURRENT",
  "FUTURE",
] as const;

export type BankingProductCategory =
  (typeof BANKING_PRODUCT_CATEGORIES)[number];
export type BankingProductEffective =
  (typeof BANKING_PRODUCT_EFFECTIVE_VALUES)[number];
export type BankingCardScheme =
  | "AMEX"
  | "EFTPOS"
  | "MASTERCARD"
  | "VISA"
  | "OTHER";
export type BankingCardType = "CHARGE" | "CREDIT" | "DEBIT";

export interface BankingProductAdditionalInformationUri {
  description?: string;
  additionalInfoUri: string;
}

export interface BankingProductAdditionalInformation {
  overviewUri?: string;
  termsUri?: string;
  eligibilityUri?: string;
  feesAndPricingUri?: string;
  bundleUri?: string;
  additionalOverviewUris?: BankingProductAdditionalInformationUri[];
  additionalTermsUris?: BankingProductAdditionalInformationUri[];
  additionalEligibilityUris?: BankingProductAdditionalInformationUri[];
  additionalFeesAndPricingUris?: BankingProductAdditionalInformationUri[];
  additionalBundleUris?: BankingProductAdditionalInformationUri[];
}

export interface BankingProductCardArt {
  cardScheme: BankingCardScheme;
  cardType: BankingCardType;
  title?: string;
  imageUri: string;
}

export interface BankingProduct {
  productId: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  lastUpdated: string;
  productCategory: BankingProductCategory;
  name: string;
  description: string;
  brand: string;
  brandName?: string;
  brandGroup?: string;
  applicationUri?: string;
  isTailored: boolean;
  additionalInformation?: BankingProductAdditionalInformation;
  cardArt?: BankingProductCardArt[];
}

export interface ListBankingProductsOptions {
  effective?: BankingProductEffective;
  updatedSince?: string | Date;
  brand?: string;
  productCategory?: BankingProductCategory;
  pageSize?: number;
  signal?: AbortSignal;
}

export interface BankingClient {
  listProducts(
    options?: ListBankingProductsOptions,
  ): Promise<BankingProduct[]>;
}

export interface BankingClientOptions {
  baseUrl: string | URL;
  fetch?: typeof globalThis.fetch;
}

interface BankingErrorOptions extends ErrorOptions {
  status?: number;
  url?: string;
}

export class CdrBankingError extends Error {
  readonly status: number | undefined;
  readonly url: string | undefined;

  constructor(message: string, options: BankingErrorOptions = {}) {
    super(message, options);
    this.name = "CdrBankingError";
    this.status = options.status;
    this.url = options.url;
  }
}

export function isBankingProductCategory(
  value: string,
): value is BankingProductCategory {
  return (BANKING_PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export function isBankingProductEffective(
  value: string,
): value is BankingProductEffective {
  return (BANKING_PRODUCT_EFFECTIVE_VALUES as readonly string[]).includes(
    value,
  );
}

export function createBankingClient(
  options: BankingClientOptions,
): BankingClient {
  const productsUrl = bankingProductsUrl(options.baseUrl);
  const fetcher = options.fetch ?? globalThis.fetch;

  if (typeof fetcher !== "function") {
    throw new TypeError("A fetch implementation is required");
  }

  return {
    async listProducts(
      query: ListBankingProductsOptions = {},
    ): Promise<BankingProduct[]> {
      validatePageSize(query.pageSize);

      const products: BankingProduct[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const url = productPageUrl(productsUrl, query, page);
        const request: RequestInit = {
          headers: {
            accept: "application/json",
            "x-v": String(CDR_BANKING_PRODUCTS_VERSION),
          },
        };

        if (query.signal !== undefined) {
          request.signal = query.signal;
        }

        let response: Response;

        try {
          response = await fetcher(url, request);
        } catch (cause) {
          throw new CdrBankingError(
            `Unable to reach the banking product API at ${productsUrl.origin}`,
            { cause, url: url.href },
          );
        }

        if (!response.ok) {
          throw new CdrBankingError(
            `Banking products request failed with HTTP ${response.status}`,
            { status: response.status, url: url.href },
          );
        }

        let payload: unknown;

        try {
          payload = await response.json();
        } catch (cause) {
          throw new CdrBankingError(
            "Banking product API returned an invalid JSON response",
            { cause, status: response.status, url: url.href },
          );
        }

        try {
          const parsed = parseProductResponse(payload);
          products.push(...parsed.products);
          totalPages = parsed.totalPages;
        } catch (cause) {
          throw new CdrBankingError(
            "Banking product API returned an unexpected response",
            { cause, status: response.status, url: url.href },
          );
        }

        page += 1;
      } while (page <= totalPages);

      return products;
    },
  };
}

export function listBankingProducts(
  productBaseUrl: string | URL,
  options?: ListBankingProductsOptions,
): Promise<BankingProduct[]> {
  return createBankingClient({ baseUrl: productBaseUrl }).listProducts(
    options,
  );
}

function bankingProductsUrl(baseUrl: string | URL): URL {
  const url = new URL(baseUrl);
  url.hash = "";
  url.search = "";

  if (!url.pathname.endsWith("/")) {
    url.pathname += "/";
  }

  return new URL("cds-au/v1/banking/products", url);
}

function productPageUrl(
  productsUrl: URL,
  options: ListBankingProductsOptions,
  page: number,
): URL {
  const url = new URL(productsUrl);
  url.searchParams.set("page", String(page));

  if (options.pageSize !== undefined) {
    url.searchParams.set("page-size", String(options.pageSize));
  }

  if (options.effective !== undefined) {
    url.searchParams.set("effective", options.effective);
  }

  if (options.updatedSince !== undefined) {
    url.searchParams.set(
      "updated-since",
      options.updatedSince instanceof Date
        ? options.updatedSince.toISOString()
        : options.updatedSince,
    );
  }

  if (options.brand !== undefined) {
    url.searchParams.set("brand", options.brand);
  }

  if (options.productCategory !== undefined) {
    url.searchParams.set("product-category", options.productCategory);
  }

  return url;
}

function validatePageSize(pageSize: number | undefined): void {
  if (
    pageSize !== undefined &&
    (!Number.isSafeInteger(pageSize) || pageSize <= 0)
  ) {
    throw new TypeError("pageSize must be a positive integer");
  }
}

function parseProductResponse(value: unknown): {
  products: BankingProduct[];
  totalPages: number;
} {
  const response = expectRecord(value, "response");
  const data = expectRecord(response.data, "response.data");
  const meta = expectRecord(response.meta, "response.meta");

  if (!Array.isArray(data.products)) {
    throw new TypeError("response.data.products must be an array");
  }

  const totalPages = expectNonNegativeInteger(
    meta.totalPages,
    "response.meta.totalPages",
  );

  return {
    products: data.products.map((item, index) =>
      parseBankingProduct(item, index),
    ),
    totalPages,
  };
}

function parseBankingProduct(value: unknown, index: number): BankingProduct {
  const path = `response.data.products[${index}]`;
  const product = expectRecord(value, path);
  const category = expectString(
    product.productCategory,
    `${path}.productCategory`,
  );

  if (!isBankingProductCategory(category)) {
    throw new TypeError(`${path}.productCategory is unknown`);
  }

  return {
    productId: expectString(product.productId, `${path}.productId`),
    lastUpdated: expectString(product.lastUpdated, `${path}.lastUpdated`),
    productCategory: category,
    name: expectString(product.name, `${path}.name`),
    description: expectString(product.description, `${path}.description`),
    brand: expectString(product.brand, `${path}.brand`),
    isTailored: expectBoolean(product.isTailored, `${path}.isTailored`),
    ...optionalString(product, "effectiveFrom", path),
    ...optionalString(product, "effectiveTo", path),
    ...optionalString(product, "brandName", path),
    ...optionalString(product, "brandGroup", path),
    ...optionalString(product, "applicationUri", path),
    ...optionalAdditionalInformation(product.additionalInformation, path),
    ...optionalCardArt(product.cardArt, path),
  };
}

function optionalAdditionalInformation(
  value: unknown,
  productPath: string,
): Pick<BankingProduct, "additionalInformation"> | Record<string, never> {
  if (value === undefined || value === null) {
    return {};
  }

  const path = `${productPath}.additionalInformation`;
  const information = expectRecord(value, path);

  return {
    additionalInformation: {
      ...optionalString(information, "overviewUri", path),
      ...optionalString(information, "termsUri", path),
      ...optionalString(information, "eligibilityUri", path),
      ...optionalString(information, "feesAndPricingUri", path),
      ...optionalString(information, "bundleUri", path),
      ...optionalInformationUris(information, "additionalOverviewUris", path),
      ...optionalInformationUris(information, "additionalTermsUris", path),
      ...optionalInformationUris(
        information,
        "additionalEligibilityUris",
        path,
      ),
      ...optionalInformationUris(
        information,
        "additionalFeesAndPricingUris",
        path,
      ),
      ...optionalInformationUris(information, "additionalBundleUris", path),
    },
  };
}

function optionalInformationUris<
  Key extends
    | "additionalOverviewUris"
    | "additionalTermsUris"
    | "additionalEligibilityUris"
    | "additionalFeesAndPricingUris"
    | "additionalBundleUris",
>(
  value: Record<string, unknown>,
  key: Key,
  parentPath: string,
): Pick<BankingProductAdditionalInformation, Key> | Record<string, never> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  if (!Array.isArray(property)) {
    throw new TypeError(`${parentPath}.${key} must be an array`);
  }

  return {
    [key]: property.map((item, index) => {
      const path = `${parentPath}.${key}[${index}]`;
      const uri = expectRecord(item, path);

      return {
        additionalInfoUri: expectString(
          uri.additionalInfoUri,
          `${path}.additionalInfoUri`,
        ),
        ...optionalString(uri, "description", path),
      };
    }),
  } as Pick<BankingProductAdditionalInformation, Key>;
}

function optionalCardArt(
  value: unknown,
  productPath: string,
): Pick<BankingProduct, "cardArt"> | Record<string, never> {
  if (value === undefined || value === null) {
    return {};
  }

  if (!Array.isArray(value)) {
    throw new TypeError(`${productPath}.cardArt must be an array`);
  }

  return {
    cardArt: value.map((item, index) => {
      const path = `${productPath}.cardArt[${index}]`;
      const art = expectRecord(item, path);
      const cardScheme = expectString(art.cardScheme, `${path}.cardScheme`);
      const cardType = expectString(art.cardType, `${path}.cardType`);

      if (!isCardScheme(cardScheme)) {
        throw new TypeError(`${path}.cardScheme is unknown`);
      }

      if (!isCardType(cardType)) {
        throw new TypeError(`${path}.cardType is unknown`);
      }

      return {
        cardScheme,
        cardType,
        imageUri: expectString(art.imageUri, `${path}.imageUri`),
        ...optionalString(art, "title", path),
      };
    }),
  };
}

function isCardScheme(value: string): value is BankingCardScheme {
  return ["AMEX", "EFTPOS", "MASTERCARD", "VISA", "OTHER"].includes(
    value,
  );
}

function isCardType(value: string): value is BankingCardType {
  return ["CHARGE", "CREDIT", "DEBIT"].includes(value);
}

function expectRecord(
  value: unknown,
  path: string,
): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object`);
  }

  return value as Record<string, unknown>;
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`${path} must be a string`);
  }

  return value;
}

function expectBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") {
    throw new TypeError(`${path} must be a boolean`);
  }

  return value;
}

function expectNonNegativeInteger(value: unknown, path: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new TypeError(`${path} must be a non-negative integer`);
  }

  return value as number;
}

function optionalString(
  value: Record<string, unknown>,
  key: string,
  parentPath: string,
): Record<string, string> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  return { [key]: expectString(property, `${parentPath}.${key}`) };
}
