import {
  handleAttach,
  handleCancel,
  handleCheck,
  handleCheckout,
  handleEntitled,
  handleEvent,
  handleQuery,
  handleSetupPayment,
  handleTrack,
  handleUsage,
} from "./general/genMethods";

import {
  CancelParams,
  CheckParams,
  QueryParams,
  SetupPaymentParams,
  TrackParams,
  UsageParams,
} from "./general/genTypes";

import { AttachParams, CheckoutParams } from "./general/attachTypes";

import { autumnApiUrl } from "../libraries/backend/constants";
import { customerMethods } from "./customers/cusMethods";
import { entityMethods } from "./customers/entities/entMethods";
import { productMethods } from "./products/prodMethods";
import { referralMethods } from "./referrals/referralMethods";
import { toContainerResult } from "./response";
import { staticWrapper } from "./utils";
import { logger } from "../utils/logger";
import { featureMethods } from "./features/featureMethods";

const LATEST_API_VERSION = "1.2";

export class Autumn {
  private readonly secretKey: string | undefined;
  private readonly publishableKey: string | undefined;
  private headers: Record<string, string>;
  private url: string;
  private logger: any = console;

  constructor(options?: {
    secretKey?: string;
    publishableKey?: string;
    url?: string;
    version?: string;
    headers?: Record<string, string>;
    logLevel?: string;
  }) {
    try {
      this.secretKey = options?.secretKey || process.env.AUTUMN_SECRET_KEY;
      this.publishableKey =
        options?.publishableKey || process.env.AUTUMN_PUBLISHABLE_KEY;
    } catch (error) {}

    if (!this.secretKey && !this.publishableKey && !options?.headers) {
      throw new Error("Autumn secret key or publishable key is required");
    }

    this.headers = options?.headers || {
      Authorization: `Bearer ${this.secretKey || this.publishableKey}`,
      "Content-Type": "application/json",
    };

    let version = options?.version || LATEST_API_VERSION;
    this.headers["x-api-version"] = version;
    this.url = options?.url || autumnApiUrl;

    this.logger = logger;
    this.logger.level = options?.logLevel || "info";
  }

  async get(path: string) {
    const response = await fetch(`${this.url}${path}`, {
      headers: this.headers,
    });

    return toContainerResult({ response, logger: this.logger });
  }

  async post(path: string, body: any) {
    try {
      const response = await fetch(`${this.url}${path}`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      });

      return toContainerResult({ response, logger: this.logger });
    } catch (error) {
      console.error("Error sending request:", error);
      throw error;
    }
  }

  async delete(path: string) {
    const response = await fetch(`${this.url}${path}`, {
      method: "DELETE",
      headers: this.headers,
    });
    return toContainerResult({ response, logger: this.logger });
  }

  static customers = customerMethods();
  static products = productMethods();
  static entities = entityMethods();
  static referrals = referralMethods();
  static features = featureMethods();

  customers = customerMethods(this);
  products = productMethods(this);
  entities = entityMethods(this);
  referrals = referralMethods(this);
  features = featureMethods(this);

  static checkout = (params: CheckoutParams) =>
    staticWrapper(handleCheckout, undefined, { params });

  async checkout(params: CheckoutParams) {
    return handleCheckout({
      instance: this,
      params,
    });
  }

  static attach = (params: AttachParams) =>
    staticWrapper(handleAttach, undefined, { params });

  static usage = (params: UsageParams) =>
    staticWrapper(handleUsage, undefined, { params });

  async attach(params: AttachParams) {
    return handleAttach({
      instance: this,
      params,
    });
  }

  static setupPayment = (params: SetupPaymentParams) =>
    staticWrapper(handleSetupPayment, undefined, { params });
  async setupPayment(params: SetupPaymentParams) {
    return handleSetupPayment({
      instance: this,
      params,
    });
  }

  static cancel = (params: CancelParams) =>
    staticWrapper(handleCancel, undefined, { params });

  async cancel(params: CancelParams) {
    return handleCancel({
      instance: this,
      params,
    });
  }

  static check = (params: CheckParams) =>
    staticWrapper(handleCheck, undefined, { params });

  async check(params: CheckParams) {
    return handleCheck({
      instance: this,
      params,
    });
  }

  static track = (params: TrackParams) =>
    staticWrapper(handleTrack, undefined, { params });

  async track(params: TrackParams) {
    return handleTrack({
      instance: this,
      params,
    });
  }

  async usage(params: UsageParams) {
    return handleUsage({
      instance: this,
      params,
    });
  }

  static query = (params: QueryParams) =>
    staticWrapper(handleQuery, undefined, { params });

  async query(params: QueryParams) {
    return handleQuery({
      instance: this,
      params,
    });
  }
}
