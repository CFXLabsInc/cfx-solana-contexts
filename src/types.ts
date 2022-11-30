import { PublicKey } from "@solana/web3.js";

export interface Config {
  adminPubkey: PublicKey;
  cpammProgram: PublicKey;
  cfxProgram: PublicKey;
  usdxMint: PublicKey;
  sharedDank: boolean;
  sharedOracleAccounts: {
    [currency: string]: {
      pyth: PublicKey;
      switchboard: PublicKey;
    };
  };
  fxOracleAccounts: {
    [currency: string]: {
      pyth: PublicKey;
      switchboard: PublicKey;
    };
  };
}

export interface CoinFxContext
  extends Omit<Config, "sharedOracleAccounts" | "fxOracleAccounts"> {
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
  // usdxCfxSwap: UsdxCfxSwap;
  // usdxDankSwap: UsdxDankSwap;
  // userPermissions: PublicKey;
}

export interface UsdxCfxSwap {
  userPermissions: PublicKey;
  swap: PublicKey;
  usdxInfo: {
    mint: PublicKey;
    reserve: PublicKey;
    fees: PublicKey
  },
  cfxInfo: {
    mint: PublicKey;
    reserve: PublicKey;
    fees: PublicKey
  }
}

export interface UsdxDankSwap {
  userPermissions: PublicKey;
  swap: PublicKey;
  usdxInfo: {
    mint: PublicKey;
    reserve: PublicKey;
    fees: PublicKey
  },
  dankInfo: {
    mint: PublicKey;
    reserve: PublicKey;
    fees: PublicKey
  }
}

export interface UsdxUsdOracleManager {
  oracleManager: PublicKey;
  pythOracle: PublicKey;
  switchboardAggregator: PublicKey;
}

export interface FxUsdOracleManager {
  oracleManager: PublicKey;
  pythOracle: PublicKey;
  switchboardAggregator: PublicKey;
}

export interface SolUsdOracleManager {
  oracleManager: PublicKey;
  pythOracle: PublicKey;
  switchboardAggregator: PublicKey;
}

export type Env = "dev" | "pre-prod" | "cust-sandbox" | "prod";