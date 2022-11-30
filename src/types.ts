export type EnvType = "dev" | "pre-pod"

export interface Config {
  env: string,
  coinfxManager: string,
  usdxMint: string,
  cfxProgram: string,
  cpammProgram: string,
  pythProgram: string,
  authority: string,
  shareDank: boolean
}

export interface CoinfxCurrencyContext {
  coinfxManager: string
  usdxMint: string
  usdxVault: string
  cfxMint: string
  cfxVault: string
  dankMint: string
  dankVault: string
  cfxUsdxDa: string
  usdxCfxDa: string
  dankCfxDa: string
  usdxDankDa: string
  usdxUsdOracleManager: UsdxUsdOracleManager
  fxUsdOracleManager: FxUsdOracleManager
  solUsdOracleManager: SolUsdOracleManager
  cfxProgram: string
  pythProgram: string
  cpammProgram: string
  // TODO: add swap
  // usdxDankSwap: UsdxDankSwap
  // usdxCfxSwap: UsdxCfxSwap
  dankMintAuthority: string
  userPermissions: string
  riskManager: string
}

export interface UsdxUsdOracleManager {
  oracleManager: string
  pythOracle: string
  switchboardAggregator: string
}

export interface FxUsdOracleManager {
  oracleManager: string
  pythOracle: string
  switchboardAggregator: string
}

export interface SolUsdOracleManager {
  oracleManager: string
  pythOracle: string
  switchboardAggregator: string
}

export interface UsdxDankSwap {
  swap: string
  dankInfo: DankInfo
  usdxInfo: UsdxInfo
  userPermissions: string
}

export interface DankInfo {
  mint: string
  reserve: string
  fees: string
}

export interface UsdxInfo {
  mint: string
  reserve: string
  fees: string
}

export interface UsdxCfxSwap {
  swap: string
  usdxInfo: UsdxInfo2
  cfxInfo: CfxInfo
  userPermissions: string
}

export interface UsdxInfo2 {
  mint: string
  reserve: string
  fees: string
}

export interface CfxInfo {
  mint: string
  reserve: string
  fees: string
}
