import { PublicKey } from "@solana/web3.js";

export interface Config {
  cluster: SolanaCluster;
  permissionedSwapPubkeys: PublicKey[];
  adminPubkey: PublicKey;
  authorityPubkey: PublicKey;
  cpammProgram: PublicKey;
  cfxProgram: PublicKey;
  usdxMint: PublicKey;
  sharedDank: boolean;
}

export interface OracleConfig {
  cluster: SolanaCluster;
  defaultAcceptedDelay: number;
  defaultAcceptedConf: number;
  usdx: {
    pyth?: PublicKey;
    switchboard?: PublicKey;
    acceptedConf: number;
    invertQuote: boolean;
  };
  sol: {
    pyth?: PublicKey;
    switchboard?: PublicKey;
    acceptedConf: number;
    invertQuote: boolean;
  };
  fx: {
    [currency: string]: FxOracle;
  };
}

export interface FxOracle {
  invertQuote: boolean;
  acceptedConf?: number;
  pyth?: PublicKey;
  switchboard?: PublicKey;
}

export interface SolanaContext extends Config {
  currency: Currency;
  coinfxManager: PublicKey;
  cfxMint: PublicKey;
  dankMint: PublicKey;
  cfxVault: PublicKey;
  dankVault: PublicKey;
  usdxVault: PublicKey;
  cfxUsdxDa: PublicKey;
  usdxCfxDa: PublicKey;
  dankCfxDa: PublicKey;
  usdxDankDa: PublicKey;
  riskManager: PublicKey;
  dankMintAuthority: PublicKey;
  cfxTokenAccount: PublicKey;
  usdxTokenAccount: PublicKey;
  dankTokenAccount: PublicKey;
  userPermissions: PublicKey;
  usdxUsdOracleManager: UsdxUsdOracleManager;
  fxUsdOracleManager: FxUsdOracleManager;
  solUsdOracleManager: SolUsdOracleManager;
  cpammFactory: PublicKey;
  usdxCfxSwap: UsdxCfxSwap;
  usdxDankSwap: UsdxDankSwap;
}

export interface UsdxCfxSwap {
  userPermissions: PublicKey;
  swap: PublicKey;
  lpMint: PublicKey;
  lpTokenAccount: PublicKey;
  usdxInfo: {
    mint: PublicKey;
    reserve: PublicKey;
  };
  cfxInfo: {
    mint: PublicKey;
    reserve: PublicKey;
  };
}

export interface UsdxDankSwap {
  userPermissions: PublicKey;
  swap: PublicKey;
  lpMint: PublicKey;
  lpTokenAccount: PublicKey;
  usdxInfo: {
    mint: PublicKey;
    reserve: PublicKey;
  };
  dankInfo: {
    mint: PublicKey;
    reserve: PublicKey;
  };
}

export interface UsdxUsdOracleManager {
  oracleManager: PublicKey;
  invertQuote: boolean;
  pythOracle?: PublicKey;
  switchboardAggregator?: PublicKey;
}

export interface FxUsdOracleManager {
  oracleManager: PublicKey;
  invertQuote: boolean;
  pythOracle?: PublicKey;
  switchboardAggregator?: PublicKey;
}

export interface SolUsdOracleManager {
  oracleManager: PublicKey;
  invertQuote: boolean;
  pythOracle?: PublicKey;
  switchboardAggregator?: PublicKey;
}

export type Env = "dev" | "pre-prod" | "cust-sandbox" | "prod";

export type SolanaCluster = "devnet" | "mainnet-beta";

export const CURRENCIES = [
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AZN",
  "BBD",
  "BDT",
  "BHD",
  "BND",
  "BOB",
  "BRL",
  "BWP",
  "BZD",
  "CAD",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ETB",
  "EUR",
  "FJD",
  "GBP",
  "GEL",
  "GHS",
  "GMD",
  "GNF",
  "GTQ",
  "HKD",
  "HNL",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KMF",
  "KRW",
  "KWD",
  "KZT",
  "LKR",
  "LSL",
  "MAD",
  "MDL",
  "MGA",
  "MMK",
  "MNT",
  "MOP",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MYR",
  "NAD",
  "NGN",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RWF",
  "SAR",
  "SCR",
  "SEK",
  "SGD",
  "STN",
  "SVC",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TRY",
  "TTD",
  "TWD",
  "TZS",
  "UGX",
  "USD",
  "UYU",
  "UZS",
  "VND",
  "VUV",
  "XAF",
  "XCD",
  "XOF",
  "ZAR",
] as const;

type CurrencyTuple = typeof CURRENCIES;
export type Currency = CurrencyTuple[number];
