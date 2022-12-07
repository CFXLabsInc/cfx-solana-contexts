import { PublicKey } from "@solana/web3.js";

export interface Config {
  cluster: SolanaCluster;
  adminPubkey: PublicKey;
  authorityPubkey: PublicKey;
  cpammProgram: PublicKey;
  cfxProgram: PublicKey;
  usdxMint: PublicKey;
  sharedDank: boolean;
}

export interface OracleConfig {
  cluster: SolanaCluster;
  usdx: {
    pyth?: PublicKey;
    switchboard?: PublicKey;
  },
  sol: {
    pyth?: PublicKey;
    switchboard?: PublicKey;
  },
  fx: {
    [currency: string]: FxOracle
  },
}

export interface FxOracle {
  invertQuote: boolean;
  pyth?: PublicKey;
  switchboard?: PublicKey;
}

export interface SolanaContext extends Config {
  currency: string;
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
  pythOracle?: PublicKey;
  switchboardAggregator?: PublicKey;
}

export type Env = "dev" | "pre-prod" | "cust-sandbox" | "prod";

export type SolanaCluster = "devnet" | "mainnet-beta";
