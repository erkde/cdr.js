export const CDR_REGISTER_BASE_URL = "https://api.cdr.gov.au/";

export const CDR_INDUSTRIES = [
  "banking",
  "energy",
  "non-bank-lending",
  "telco",
] as const;

export type CdrIndustry = (typeof CDR_INDUSTRIES)[number];
export type CdrIndustryFilter = CdrIndustry | "all";

export interface DataHolderBrand {
  dataHolderBrandId?: string;
  interimId?: string;
  brandName: string;
  brandGroup?: string;
  publicBaseUri: string;
  productBaseUri?: string;
  logoUri: string;
  industries: CdrIndustry[];
  lastUpdated: string;
  abn?: string;
  acn?: string;
  arbn?: string;
}

export interface ListDataHoldersOptions {
  industry?: CdrIndustryFilter;
  signal?: AbortSignal;
}

export interface RegisterClient {
  listDataHolders(
    options?: ListDataHoldersOptions,
  ): Promise<DataHolderBrand[]>;
}

export interface RegisterClientOptions {
  baseUrl?: string | URL;
  fetch?: typeof globalThis.fetch;
}

interface RegisterErrorOptions extends ErrorOptions {
  status?: number;
  url?: string;
}

export class CdrRegisterError extends Error {
  readonly status: number | undefined;
  readonly url: string | undefined;

  constructor(message: string, options: RegisterErrorOptions = {}) {
    super(message, options);
    this.name = "CdrRegisterError";
    this.status = options.status;
    this.url = options.url;
  }
}

export function isCdrIndustry(value: string): value is CdrIndustry {
  return (CDR_INDUSTRIES as readonly string[]).includes(value);
}

export function createRegisterClient(
  options: RegisterClientOptions = {},
): RegisterClient {
  const baseUrl = new URL(options.baseUrl ?? CDR_REGISTER_BASE_URL);
  const fetcher = options.fetch ?? globalThis.fetch;

  if (typeof fetcher !== "function") {
    throw new TypeError("A fetch implementation is required");
  }

  return {
    async listDataHolders(
      query: ListDataHoldersOptions = {},
    ): Promise<DataHolderBrand[]> {
      const industry = query.industry ?? "all";
      const url = new URL(
        `/cdr-register/v1/${industry}/data-holders/brands/summary`,
        baseUrl,
      );
      const request: RequestInit = {
        headers: {
          accept: "application/json",
          "x-v": "2",
        },
      };

      if (query.signal !== undefined) {
        request.signal = query.signal;
      }

      let response: Response;

      try {
        response = await fetcher(url, request);
      } catch (cause) {
        throw new CdrRegisterError(
          `Unable to reach the CDR Register at ${url.origin}`,
          { cause, url: url.href },
        );
      }

      if (!response.ok) {
        throw new CdrRegisterError(
          `CDR Register request failed with HTTP ${response.status}`,
          { status: response.status, url: url.href },
        );
      }

      let payload: unknown;

      try {
        payload = await response.json();
      } catch (cause) {
        throw new CdrRegisterError(
          "CDR Register returned an invalid JSON response",
          { cause, status: response.status, url: url.href },
        );
      }

      try {
        return parseDataHolderResponse(payload);
      } catch (cause) {
        throw new CdrRegisterError(
          "CDR Register returned an unexpected response",
          { cause, status: response.status, url: url.href },
        );
      }
    },
  };
}

const defaultClient = createRegisterClient();

export function listDataHolders(
  options?: ListDataHoldersOptions,
): Promise<DataHolderBrand[]> {
  return defaultClient.listDataHolders(options);
}

function parseDataHolderResponse(value: unknown): DataHolderBrand[] {
  const response = expectRecord(value, "response");

  if (!Array.isArray(response.data)) {
    throw new TypeError("response.data must be an array");
  }

  return response.data.map((item, index) => parseDataHolder(item, index));
}

function parseDataHolder(value: unknown, index: number): DataHolderBrand {
  const path = `response.data[${index}]`;
  const holder = expectRecord(value, path);
  const industries = expectStringArray(holder.industries, `${path}.industries`);

  if (!industries.every(isCdrIndustry)) {
    throw new TypeError(`${path}.industries contains an unknown industry`);
  }

  return {
    brandName: expectString(holder.brandName, `${path}.brandName`),
    publicBaseUri: expectString(
      holder.publicBaseUri,
      `${path}.publicBaseUri`,
    ),
    logoUri: expectString(holder.logoUri, `${path}.logoUri`),
    industries,
    lastUpdated: expectString(holder.lastUpdated, `${path}.lastUpdated`),
    ...optionalString(holder, "dataHolderBrandId"),
    ...optionalString(holder, "interimId"),
    ...optionalString(holder, "brandGroup"),
    ...optionalString(holder, "productBaseUri"),
    ...optionalString(holder, "abn"),
    ...optionalString(holder, "acn"),
    ...optionalString(holder, "arbn"),
  };
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

function expectStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new TypeError(`${path} must be an array of strings`);
  }

  return value;
}

function optionalString(
  value: Record<string, unknown>,
  key: string,
): Record<string, string> {
  const property = value[key];

  if (property === undefined || property === null) {
    return {};
  }

  return { [key]: expectString(property, key) };
}
