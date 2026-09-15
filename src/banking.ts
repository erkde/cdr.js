export const CDR_BANKING_PRODUCTS_VERSION = 5;
export const CDR_BANKING_PRODUCTS_MIN_VERSION = 3;
export const CDR_BANKING_PRODUCT_DETAIL_VERSION = 7;
export const CDR_BANKING_PRODUCT_DETAIL_MIN_VERSION = 4;

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

const BANKING_FEATURE_TYPES = [
  "ADDITIONAL_CARDS",
  "BALANCE_TRANSFERS",
  "BILL_PAYMENT",
  "BONUS_REWARDS",
  "CARD_ACCESS",
  "CASHBACK_OFFER",
  "COMPLEMENTARY_PRODUCT_DISCOUNTS",
  "EXTRA_DOWN_PAYMENT",
  "DIGITAL_BANKING",
  "DIGITAL_WALLET",
  "DONATE_INTEREST",
  "EXTRA_REPAYMENTS",
  "FRAUD_PROTECTION",
  "FREE_TXNS",
  "FREE_TXNS_ALLOWANCE",
  "FUNDS_AVAILABLE_AFTER",
  "GUARANTOR",
  "INSTALMENT_PLAN",
  "INSURANCE",
  "INTEREST_FREE",
  "INTEREST_FREE_TRANSFERS",
  "LOYALTY_PROGRAM",
  "NOTIFICATIONS",
  "NPP_ENABLED",
  "NPP_PAYID",
  "OFFSET",
  "OTHER",
  "OVERDRAFT",
  "REDRAW",
  "RELATIONSHIP_MANAGEMENT",
  "UNLIMITED_TXNS",
] as const;

const BANKING_CONSTRAINT_TYPES = [
  "MAX_BALANCE",
  "MAX_LIMIT",
  "MAX_LVR",
  "MIN_BALANCE",
  "MIN_LIMIT",
  "MIN_LVR",
  "OPENING_BALANCE",
  "OTHER",
] as const;

const BANKING_ELIGIBILITY_TYPES = [
  "BUSINESS",
  "EMPLOYMENT_STATUS",
  "MAX_AGE",
  "MIN_AGE",
  "MIN_INCOME",
  "MIN_TURNOVER",
  "NATURAL_PERSON",
  "OTHER",
  "PENSION_RECIPIENT",
  "RESIDENCY_STATUS",
  "STAFF",
  "STUDENT",
] as const;

const BANKING_FEE_TYPES = [
  "CASH_ADVANCE",
  "DEPOSIT",
  "DISHONOUR",
  "ENQUIRY",
  "EVENT",
  "EXIT",
  "LATE_PAYMENT",
  "OTHER",
  "PAYMENT",
  "PERIODIC",
  "PURCHASE",
  "REPLACEMENT",
  "TRANSACTION",
  "UPFRONT",
  "UPFRONT_PER_PLAN",
  "VARIATION",
  "WITHDRAWAL",
] as const;

const BANKING_FEE_METHODS = ["fixedAmount", "rateBased", "variable"] as const;
const BANKING_FEE_RATE_TYPES = [
  "BALANCE",
  "INTEREST_ACCRUED",
  "TRANSACTION",
] as const;
const BANKING_DISCOUNT_TYPES = [
  "BALANCE",
  "DEPOSITS",
  "ELIGIBILITY_ONLY",
  "FEE_CAP",
  "PAYMENTS",
] as const;
const BANKING_DISCOUNT_METHODS = ["fixedAmount", "rateBased"] as const;
const BANKING_DISCOUNT_RATE_TYPES = [
  "BALANCE",
  "FEE",
  "INTEREST_ACCRUED",
  "TRANSACTION",
] as const;
const BANKING_DISCOUNT_ELIGIBILITY_TYPES = [
  "BUSINESS",
  "EMPLOYMENT_STATUS",
  "INTRODUCTORY",
  "MAX_AGE",
  "MIN_AGE",
  "MIN_INCOME",
  "MIN_TURNOVER",
  "NATURAL_PERSON",
  "OTHER",
  "PENSION_RECIPIENT",
  "RESIDENCY_STATUS",
  "STAFF",
  "STUDENT",
] as const;
const BANKING_DEPOSIT_RATE_TYPES = [
  "BONUS",
  "BUNDLE_BONUS",
  "FIXED",
  "FLOATING",
  "INTRODUCTORY",
  "MARKET_LINKED",
  "VARIABLE",
] as const;
const BANKING_RATE_APPLICATION_TYPES = [
  "MATURITY",
  "PERIODIC",
  "UPFRONT",
] as const;
const BANKING_LENDING_RATE_TYPES = [
  "BALANCE_TRANSFER",
  "BUNDLE_DISCOUNT_FIXED",
  "BUNDLE_DISCOUNT_VARIABLE",
  "CASH_ADVANCE",
  "DISCOUNT",
  "FIXED",
  "FLOATING",
  "INTRODUCTORY",
  "MARKET_LINKED",
  "PENALTY",
  "PURCHASE",
  "VARIABLE",
] as const;
const BANKING_INTEREST_PAYMENT_DUE_VALUES = [
  "IN_ADVANCE",
  "IN_ARREARS",
] as const;
const BANKING_REPAYMENT_TYPES = [
  "INTEREST_ONLY",
  "OTHER",
  "PRINCIPAL_AND_INTEREST",
  "UNCONSTRAINED",
] as const;
const BANKING_LOAN_PURPOSES = [
  "INVESTMENT",
  "OTHER",
  "OWNER_OCCUPIED",
  "UNCONSTRAINED",
] as const;
const BANKING_RATE_TIER_UNITS = [
  "DAY",
  "DOLLAR",
  "MONTH",
  "PERCENT",
] as const;
const BANKING_RATE_APPLICATION_METHODS = [
  "PER_TIER",
  "WHOLE_BALANCE",
] as const;
const BANKING_RATE_APPLICABILITY_TYPES = [
  "MIN_DEPOSITS",
  "MIN_DEPOSIT_AMOUNT",
  "DEPOSIT_BALANCE_INCREASED",
  "EXISTING_CUST",
  "NEW_ACCOUNTS",
  "NEW_CUSTOMER",
  "NEW_CUSTOMER_TO_GROUP",
  "ONLINE_ONLY",
  "OTHER",
  "MIN_PURCHASES",
  "MAX_WITHDRAWALS",
  "MAX_WITHDRAWAL_AMOUNT",
] as const;

export type BankingFeatureType = (typeof BANKING_FEATURE_TYPES)[number];
export type BankingConstraintType = (typeof BANKING_CONSTRAINT_TYPES)[number];
export type BankingEligibilityType =
  (typeof BANKING_ELIGIBILITY_TYPES)[number];
export type BankingFeeType = (typeof BANKING_FEE_TYPES)[number];
export type BankingFeeMethod = (typeof BANKING_FEE_METHODS)[number];
export type BankingFeeRateType = (typeof BANKING_FEE_RATE_TYPES)[number];
export type BankingDiscountType = (typeof BANKING_DISCOUNT_TYPES)[number];
export type BankingDiscountMethod =
  (typeof BANKING_DISCOUNT_METHODS)[number];
export type BankingDiscountRateType =
  (typeof BANKING_DISCOUNT_RATE_TYPES)[number];
export type BankingDiscountEligibilityType =
  (typeof BANKING_DISCOUNT_ELIGIBILITY_TYPES)[number];
export type BankingDepositRateType =
  (typeof BANKING_DEPOSIT_RATE_TYPES)[number];
export type BankingRateApplicationType =
  (typeof BANKING_RATE_APPLICATION_TYPES)[number];
export type BankingLendingRateType =
  (typeof BANKING_LENDING_RATE_TYPES)[number];
export type BankingInterestPaymentDue =
  (typeof BANKING_INTEREST_PAYMENT_DUE_VALUES)[number];
export type BankingRepaymentType = (typeof BANKING_REPAYMENT_TYPES)[number];
export type BankingLoanPurpose = (typeof BANKING_LOAN_PURPOSES)[number];
export type BankingRateTierUnit = (typeof BANKING_RATE_TIER_UNITS)[number];
export type BankingRateApplicationMethod =
  (typeof BANKING_RATE_APPLICATION_METHODS)[number];
export type BankingRateApplicabilityType =
  (typeof BANKING_RATE_APPLICABILITY_TYPES)[number];

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

export interface BankingProductBundle {
  name: string;
  description: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
  productIds?: string[];
}

export interface BankingProductFeature {
  featureType: BankingFeatureType;
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingProductConstraint {
  constraintType: BankingConstraintType;
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingProductEligibility {
  eligibilityType: BankingEligibilityType;
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingFeeAmount {
  amount: string;
}

export interface BankingFeeRange {
  feeMinimum?: string;
  feeMaximum?: string;
}

export interface BankingFeeRate {
  rateType: BankingFeeRateType;
  rate: string;
  accrualFrequency?: string;
  amountRange?: BankingFeeRange;
}

export interface BankingFeeDiscountAmount {
  amount: string;
}

export interface BankingFeeDiscountRange {
  discountMinimum?: string;
  discountMaximum?: string;
}

export interface BankingFeeDiscountRate {
  rateType: BankingDiscountRateType;
  rate: string;
  amountRange?: BankingFeeDiscountRange;
}

export interface BankingProductDiscountEligibility {
  discountEligibilityType: BankingDiscountEligibilityType;
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingProductDiscount {
  description: string;
  discountType: BankingDiscountType;
  discountMethodUType: BankingDiscountMethod;
  fixedAmount?: BankingFeeDiscountAmount;
  rateBased?: BankingFeeDiscountRate;
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
  eligibility?: BankingProductDiscountEligibility[];
}

export interface BankingProductFee {
  name: string;
  feeType: BankingFeeType;
  feeMethodUType: BankingFeeMethod;
  fixedAmount?: BankingFeeAmount;
  rateBased?: BankingFeeRate;
  variable?: BankingFeeRange;
  feeCap?: string;
  feeCapPeriod?: string;
  currency?: string;
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
  discounts?: BankingProductDiscount[];
}

export interface BankingProductRateCondition {
  rateApplicabilityType: BankingRateApplicabilityType;
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingProductRateTier {
  name: string;
  unitOfMeasure: BankingRateTierUnit;
  minimumValue: string;
  maximumValue?: string;
  rateApplicationMethod?: BankingRateApplicationMethod;
  applicabilityConditions?: BankingProductRateCondition[];
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingProductDepositRate {
  depositRateType: BankingDepositRateType;
  rate: string;
  calculationFrequency?: string;
  applicationType: BankingRateApplicationType;
  applicationFrequency?: string;
  tiers?: BankingProductRateTier[];
  applicabilityConditions?: BankingProductRateCondition[];
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingProductLendingRate {
  lendingRateType: BankingLendingRateType;
  rate: string;
  comparisonRate?: string;
  calculationFrequency?: string;
  applicationType: BankingRateApplicationType;
  applicationFrequency?: string;
  interestPaymentDue?: BankingInterestPaymentDue;
  repaymentType: BankingRepaymentType;
  loanPurpose: BankingLoanPurpose;
  tiers?: BankingProductRateTier[];
  applicabilityConditions?: BankingProductRateCondition[];
  additionalValue?: string;
  additionalInfo?: string;
  additionalInfoUri?: string;
}

export interface BankingProductInstalments {
  maximumConcurrentPlans?: number;
  instalmentsLimit?: string;
  minimumPlanValue?: string;
  maximumPlanValue?: string;
  minimumSplit: number;
  maximumSplit: number;
}

export interface BankingProductDetail extends BankingProduct {
  bundles?: BankingProductBundle[];
  features?: BankingProductFeature[];
  constraints?: BankingProductConstraint[];
  eligibility?: BankingProductEligibility[];
  fees?: BankingProductFee[];
  depositRates?: BankingProductDepositRate[];
  lendingRates?: BankingProductLendingRate[];
  instalments?: BankingProductInstalments;
}

export interface ListBankingProductsOptions {
  effective?: BankingProductEffective;
  updatedSince?: string | Date;
  brand?: string;
  productCategory?: BankingProductCategory;
  pageSize?: number;
  signal?: AbortSignal;
}

export interface GetBankingProductOptions {
  signal?: AbortSignal;
}

export interface BankingClient {
  listProducts(
    options?: ListBankingProductsOptions,
  ): Promise<BankingProduct[]>;
  listProductIds(
    options?: ListBankingProductsOptions,
  ): Promise<string[]>;
  getProduct(
    productId: string,
    options?: GetBankingProductOptions,
  ): Promise<BankingProductDetail>;
  getProductDocument(
    productId: string,
    options?: GetBankingProductOptions,
  ): Promise<unknown>;
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

  const requestProductDocument = async (
    productId: string,
    query: GetBankingProductOptions = {},
  ): Promise<{ payload: unknown; status: number; url: string }> => {
    if (productId.trim() === "") {
      throw new TypeError("productId must not be empty");
    }

    const url = new URL(
      encodeURIComponent(productId),
      `${productsUrl.href}/`,
    );
    const request: RequestInit = {
      headers: {
        accept: "application/json",
        "x-v": String(CDR_BANKING_PRODUCT_DETAIL_VERSION),
        "x-min-v": String(CDR_BANKING_PRODUCT_DETAIL_MIN_VERSION),
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
        `Banking product request failed with HTTP ${response.status}`,
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
      parseProductDetailIdResponse(payload);
    } catch (cause) {
      throw new CdrBankingError(
        "Banking product API returned an unexpected response",
        { cause, status: response.status, url: url.href },
      );
    }

    return { payload, status: response.status, url: url.href };
  };

  return {
    listProducts(
      query: ListBankingProductsOptions = {},
    ): Promise<BankingProduct[]> {
      return listProductPages(
        productsUrl,
        fetcher,
        query,
        parseProductResponse,
      );
    },

    listProductIds(
      query: ListBankingProductsOptions = {},
    ): Promise<string[]> {
      return listProductPages(
        productsUrl,
        fetcher,
        query,
        parseProductIdResponse,
      );
    },

    async getProductDocument(
      productId: string,
      query: GetBankingProductOptions = {},
    ): Promise<unknown> {
      return (await requestProductDocument(productId, query)).payload;
    },

    async getProduct(
      productId: string,
      query: GetBankingProductOptions = {},
    ): Promise<BankingProductDetail> {
      const result = await requestProductDocument(productId, query);

      try {
        return parseBankingProductDetail(result.payload);
      } catch (cause) {
        throw new CdrBankingError(
          "Banking product API returned an unexpected response",
          { cause, status: result.status, url: result.url },
        );
      }
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

export function listBankingProductIds(
  productBaseUrl: string | URL,
  options?: ListBankingProductsOptions,
): Promise<string[]> {
  return createBankingClient({ baseUrl: productBaseUrl }).listProductIds(
    options,
  );
}

export function getBankingProduct(
  productBaseUrl: string | URL,
  productId: string,
  options?: GetBankingProductOptions,
): Promise<BankingProductDetail> {
  return createBankingClient({ baseUrl: productBaseUrl }).getProduct(
    productId,
    options,
  );
}

export function getBankingProductDocument(
  productBaseUrl: string | URL,
  productId: string,
  options?: GetBankingProductOptions,
): Promise<unknown> {
  return createBankingClient({ baseUrl: productBaseUrl }).getProductDocument(
    productId,
    options,
  );
}

async function listProductPages<T>(
  productsUrl: URL,
  fetcher: typeof globalThis.fetch,
  query: ListBankingProductsOptions,
  parsePage: (value: unknown) => { products: T[]; totalPages: number },
): Promise<T[]> {
  validatePageSize(query.pageSize);

  const products: T[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = productPageUrl(productsUrl, query, page);
    const request: RequestInit = {
      headers: {
        accept: "application/json",
        "x-v": String(CDR_BANKING_PRODUCTS_VERSION),
        "x-min-v": String(CDR_BANKING_PRODUCTS_MIN_VERSION),
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
      const parsed = parsePage(payload);
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
      parseBankingProduct(item, `response.data.products[${index}]`),
    ),
    totalPages,
  };
}

function parseProductIdResponse(value: unknown): {
  products: string[];
  totalPages: number;
} {
  const response = expectRecord(value, "response");
  const data = expectRecord(response.data, "response.data");
  const meta = expectRecord(response.meta, "response.meta");

  if (!Array.isArray(data.products)) {
    throw new TypeError("response.data.products must be an array");
  }

  return {
    products: data.products.map((item, index) => {
      const path = `response.data.products[${index}]`;
      const product = expectRecord(item, path);
      return expectString(product.productId, `${path}.productId`);
    }),
    totalPages: expectNonNegativeInteger(
      meta.totalPages,
      "response.meta.totalPages",
    ),
  };
}

function parseBankingProduct(value: unknown, path: string): BankingProduct {
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

function parseProductDetailIdResponse(value: unknown): string {
  const response = expectRecord(value, "response");
  const detail = expectRecord(response.data, "response.data");
  return expectString(detail.productId, "response.data.productId");
}

export function parseBankingProductDetail(
  value: unknown,
): BankingProductDetail {
  const response = expectRecord(value, "response");
  const path = "response.data";
  const detail = expectRecord(response.data, path);

  return {
    ...parseBankingProduct(detail, path),
    ...optionalParsedArray(detail, "bundles", path, parseBundle),
    ...optionalParsedArray(detail, "features", path, parseFeature),
    ...optionalParsedArray(detail, "constraints", path, parseConstraint),
    ...optionalParsedArray(detail, "eligibility", path, parseEligibility),
    ...optionalParsedArray(detail, "fees", path, parseFee),
    ...optionalParsedArray(detail, "depositRates", path, parseDepositRate),
    ...optionalParsedArray(detail, "lendingRates", path, parseLendingRate),
    ...optionalParsedObject(detail, "instalments", path, parseInstalments),
  };
}

function parseBundle(value: unknown, path: string): BankingProductBundle {
  const bundle = expectRecord(value, path);

  return {
    name: expectString(bundle.name, `${path}.name`),
    description: expectString(bundle.description, `${path}.description`),
    ...optionalString(bundle, "additionalInfo", path),
    ...optionalString(bundle, "additionalInfoUri", path),
    ...optionalStringArray(bundle, "productIds", path),
  };
}

function parseFeature(value: unknown, path: string): BankingProductFeature {
  const feature = expectRecord(value, path);

  return {
    featureType: expectEnum(
      feature.featureType,
      `${path}.featureType`,
      BANKING_FEATURE_TYPES,
    ),
    ...optionalAdditionalFields(feature, path),
  };
}

function parseConstraint(
  value: unknown,
  path: string,
): BankingProductConstraint {
  const constraint = expectRecord(value, path);

  return {
    constraintType: expectEnum(
      constraint.constraintType,
      `${path}.constraintType`,
      BANKING_CONSTRAINT_TYPES,
    ),
    ...optionalAdditionalFields(constraint, path),
  };
}

function parseEligibility(
  value: unknown,
  path: string,
): BankingProductEligibility {
  const eligibility = expectRecord(value, path);

  return {
    eligibilityType: expectEnum(
      eligibility.eligibilityType,
      `${path}.eligibilityType`,
      BANKING_ELIGIBILITY_TYPES,
    ),
    ...optionalAdditionalFields(eligibility, path),
  };
}

function parseFee(value: unknown, path: string): BankingProductFee {
  const fee = expectRecord(value, path);

  return {
    name: expectString(fee.name, `${path}.name`),
    feeType: expectEnum(fee.feeType, `${path}.feeType`, BANKING_FEE_TYPES),
    feeMethodUType: expectEnum(
      fee.feeMethodUType,
      `${path}.feeMethodUType`,
      BANKING_FEE_METHODS,
    ),
    ...optionalParsedObject(fee, "fixedAmount", path, parseFeeAmount),
    ...optionalParsedObject(fee, "rateBased", path, parseFeeRate),
    ...optionalParsedObject(fee, "variable", path, parseFeeRange),
    ...optionalString(fee, "feeCap", path),
    ...optionalString(fee, "feeCapPeriod", path),
    ...optionalString(fee, "currency", path),
    ...optionalAdditionalFields(fee, path),
    ...optionalParsedArray(fee, "discounts", path, parseDiscount),
  };
}

function parseFeeAmount(value: unknown, path: string): BankingFeeAmount {
  const amount = expectRecord(value, path);
  return { amount: expectString(amount.amount, `${path}.amount`) };
}

function parseFeeRange(value: unknown, path: string): BankingFeeRange {
  const range = expectRecord(value, path);

  return {
    ...optionalString(range, "feeMinimum", path),
    ...optionalString(range, "feeMaximum", path),
  };
}

function parseFeeRate(value: unknown, path: string): BankingFeeRate {
  const rate = expectRecord(value, path);

  return {
    rateType: expectEnum(
      rate.rateType,
      `${path}.rateType`,
      BANKING_FEE_RATE_TYPES,
    ),
    rate: expectString(rate.rate, `${path}.rate`),
    ...optionalString(rate, "accrualFrequency", path),
    ...optionalParsedObject(rate, "amountRange", path, parseFeeRange),
  };
}

function parseDiscount(value: unknown, path: string): BankingProductDiscount {
  const discount = expectRecord(value, path);

  return {
    description: expectString(discount.description, `${path}.description`),
    discountType: expectEnum(
      discount.discountType,
      `${path}.discountType`,
      BANKING_DISCOUNT_TYPES,
    ),
    discountMethodUType: expectEnum(
      discount.discountMethodUType,
      `${path}.discountMethodUType`,
      BANKING_DISCOUNT_METHODS,
    ),
    ...optionalParsedObject(
      discount,
      "fixedAmount",
      path,
      parseFeeDiscountAmount,
    ),
    ...optionalParsedObject(
      discount,
      "rateBased",
      path,
      parseFeeDiscountRate,
    ),
    ...optionalAdditionalFields(discount, path),
    ...optionalParsedArray(
      discount,
      "eligibility",
      path,
      parseDiscountEligibility,
    ),
  };
}

function parseFeeDiscountAmount(
  value: unknown,
  path: string,
): BankingFeeDiscountAmount {
  const amount = expectRecord(value, path);
  return { amount: expectString(amount.amount, `${path}.amount`) };
}

function parseFeeDiscountRange(
  value: unknown,
  path: string,
): BankingFeeDiscountRange {
  const range = expectRecord(value, path);

  return {
    ...optionalString(range, "discountMinimum", path),
    ...optionalString(range, "discountMaximum", path),
  };
}

function parseFeeDiscountRate(
  value: unknown,
  path: string,
): BankingFeeDiscountRate {
  const rate = expectRecord(value, path);

  return {
    rateType: expectEnum(
      rate.rateType,
      `${path}.rateType`,
      BANKING_DISCOUNT_RATE_TYPES,
    ),
    rate: expectString(rate.rate, `${path}.rate`),
    ...optionalParsedObject(
      rate,
      "amountRange",
      path,
      parseFeeDiscountRange,
    ),
  };
}

function parseDiscountEligibility(
  value: unknown,
  path: string,
): BankingProductDiscountEligibility {
  const eligibility = expectRecord(value, path);

  return {
    discountEligibilityType: expectEnum(
      eligibility.discountEligibilityType,
      `${path}.discountEligibilityType`,
      BANKING_DISCOUNT_ELIGIBILITY_TYPES,
    ),
    ...optionalAdditionalFields(eligibility, path),
  };
}

function parseDepositRate(
  value: unknown,
  path: string,
): BankingProductDepositRate {
  const rate = expectRecord(value, path);

  return {
    depositRateType: expectEnum(
      rate.depositRateType,
      `${path}.depositRateType`,
      BANKING_DEPOSIT_RATE_TYPES,
    ),
    rate: expectString(rate.rate, `${path}.rate`),
    applicationType: expectEnum(
      rate.applicationType,
      `${path}.applicationType`,
      BANKING_RATE_APPLICATION_TYPES,
    ),
    ...optionalString(rate, "calculationFrequency", path),
    ...optionalString(rate, "applicationFrequency", path),
    ...optionalParsedArray(rate, "tiers", path, parseRateTier),
    ...optionalParsedArray(
      rate,
      "applicabilityConditions",
      path,
      parseRateCondition,
    ),
    ...optionalAdditionalFields(rate, path),
  };
}

function parseLendingRate(
  value: unknown,
  path: string,
): BankingProductLendingRate {
  const rate = expectRecord(value, path);

  return {
    lendingRateType: expectEnum(
      rate.lendingRateType,
      `${path}.lendingRateType`,
      BANKING_LENDING_RATE_TYPES,
    ),
    rate: expectString(rate.rate, `${path}.rate`),
    applicationType: expectEnum(
      rate.applicationType,
      `${path}.applicationType`,
      BANKING_RATE_APPLICATION_TYPES,
    ),
    repaymentType: expectEnum(
      rate.repaymentType,
      `${path}.repaymentType`,
      BANKING_REPAYMENT_TYPES,
    ),
    loanPurpose: expectEnum(
      rate.loanPurpose,
      `${path}.loanPurpose`,
      BANKING_LOAN_PURPOSES,
    ),
    ...optionalString(rate, "comparisonRate", path),
    ...optionalString(rate, "calculationFrequency", path),
    ...optionalString(rate, "applicationFrequency", path),
    ...optionalEnum(
      rate,
      "interestPaymentDue",
      path,
      BANKING_INTEREST_PAYMENT_DUE_VALUES,
    ),
    ...optionalParsedArray(rate, "tiers", path, parseRateTier),
    ...optionalParsedArray(
      rate,
      "applicabilityConditions",
      path,
      parseRateCondition,
    ),
    ...optionalAdditionalFields(rate, path),
  };
}

function parseRateTier(value: unknown, path: string): BankingProductRateTier {
  const tier = expectRecord(value, path);

  return {
    name: expectString(tier.name, `${path}.name`),
    unitOfMeasure: expectEnum(
      tier.unitOfMeasure,
      `${path}.unitOfMeasure`,
      BANKING_RATE_TIER_UNITS,
    ),
    minimumValue: expectString(tier.minimumValue, `${path}.minimumValue`),
    ...optionalString(tier, "maximumValue", path),
    ...optionalEnum(
      tier,
      "rateApplicationMethod",
      path,
      BANKING_RATE_APPLICATION_METHODS,
    ),
    ...optionalParsedArray(
      tier,
      "applicabilityConditions",
      path,
      parseRateCondition,
    ),
    ...optionalString(tier, "additionalInfo", path),
    ...optionalString(tier, "additionalInfoUri", path),
  };
}

function parseRateCondition(
  value: unknown,
  path: string,
): BankingProductRateCondition {
  const condition = expectRecord(value, path);

  return {
    rateApplicabilityType: expectEnum(
      condition.rateApplicabilityType,
      `${path}.rateApplicabilityType`,
      BANKING_RATE_APPLICABILITY_TYPES,
    ),
    ...optionalAdditionalFields(condition, path),
  };
}

function parseInstalments(
  value: unknown,
  path: string,
): BankingProductInstalments {
  const instalments = expectRecord(value, path);

  return {
    minimumSplit: expectPositiveInteger(
      instalments.minimumSplit,
      `${path}.minimumSplit`,
    ),
    maximumSplit: expectPositiveInteger(
      instalments.maximumSplit,
      `${path}.maximumSplit`,
    ),
    ...optionalNonNegativeInteger(
      instalments,
      "maximumConcurrentPlans",
      path,
    ),
    ...optionalString(instalments, "instalmentsLimit", path),
    ...optionalString(instalments, "minimumPlanValue", path),
    ...optionalString(instalments, "maximumPlanValue", path),
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

function optionalAdditionalFields(
  value: Record<string, unknown>,
  path: string,
): Record<string, string> {
  return {
    ...optionalString(value, "additionalValue", path),
    ...optionalString(value, "additionalInfo", path),
    ...optionalString(value, "additionalInfoUri", path),
  };
}

function optionalStringArray<Key extends string>(
  value: Record<string, unknown>,
  key: Key,
  parentPath: string,
): Partial<Record<Key, string[]>> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  if (!Array.isArray(property) || !property.every((item) => typeof item === "string")) {
    throw new TypeError(`${parentPath}.${key} must be an array of strings`);
  }

  return { [key]: property } as Record<Key, string[]>;
}

function optionalParsedArray<Key extends string, Item>(
  value: Record<string, unknown>,
  key: Key,
  parentPath: string,
  parse: (item: unknown, path: string) => Item,
): Partial<Record<Key, Item[]>> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  if (!Array.isArray(property)) {
    throw new TypeError(`${parentPath}.${key} must be an array`);
  }

  return {
    [key]: property.map((item, index) =>
      parse(item, `${parentPath}.${key}[${index}]`),
    ),
  } as Record<Key, Item[]>;
}

function optionalParsedObject<Key extends string, Item>(
  value: Record<string, unknown>,
  key: Key,
  parentPath: string,
  parse: (item: unknown, path: string) => Item,
): Partial<Record<Key, Item>> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  return {
    [key]: parse(property, `${parentPath}.${key}`),
  } as Record<Key, Item>;
}

function optionalEnum<Key extends string, Values extends readonly string[]>(
  value: Record<string, unknown>,
  key: Key,
  parentPath: string,
  values: Values,
): Partial<Record<Key, Values[number]>> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  return {
    [key]: expectEnum(property, `${parentPath}.${key}`, values),
  } as Record<Key, Values[number]>;
}

function optionalNonNegativeInteger<Key extends string>(
  value: Record<string, unknown>,
  key: Key,
  parentPath: string,
): Partial<Record<Key, number>> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  return {
    [key]: expectNonNegativeInteger(property, `${parentPath}.${key}`),
  } as Record<Key, number>;
}

function expectEnum<Values extends readonly string[]>(
  value: unknown,
  path: string,
  values: Values,
): Values[number] {
  const text = expectString(value, path);

  if (!(values as readonly string[]).includes(text)) {
    throw new TypeError(`${path} is unknown`);
  }

  return text as Values[number];
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

function expectPositiveInteger(value: unknown, path: string): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw new TypeError(`${path} must be a positive integer`);
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
