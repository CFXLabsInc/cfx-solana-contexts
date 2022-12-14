export const UserPermissions = "access_control";

export const SharedDank = "shared_dank";

export const Shared = "shared";

export enum RiskManager {
  MINT = "risk_mg_mint",
  REDEEM = "risk_mg_redeem",
}

export enum Cpamm {
  FACTORY = "Factory",
  SWAPINFO = "SwapInfo",
}

export enum ProgramToken {
  DANK = "dank_mint",
  CFX = "cfx_mint",
}

export enum ProgramAuction {
  CFXUSDX = "cfx_usdx_da",
  USDXCFX = "usdx_cfx_da",
  DANKCFX = "dank_cfx_da",
  USDXDANK = "usdx_dank_da",
}

export enum ProgramOracleManager {
  USDXUSD = "usdx_usd_oracle_manager",
  FXUSD = "fx_usd_oracle_manager",
  SOLUSD = "sol_usd_oracle_manager",
}
