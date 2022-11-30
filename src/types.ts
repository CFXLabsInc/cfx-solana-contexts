import { PublicKey } from "@solana/web3.js";

export interface Config {
  adminPubkey: PublicKey;
  cpammProgramId: PublicKey;
  cfxProgramId: PublicKey;
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
  usdxUsdOracleManager: UsdxUsdOracleManager;
  fxUsdOracleManager: FxUsdOracleManager;
  solUsdOracleManager: SolUsdOracleManager;
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
