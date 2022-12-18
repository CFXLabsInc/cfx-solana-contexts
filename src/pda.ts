import { PublicKey } from "@solana/web3.js";
import {
  Cpamm,
  ProgramAuction,
  ProgramOracleManager,
  ProgramToken,
  UserPermissions,
  RiskManager,
  SharedDank,
  Shared,
} from "./seeds";
import { Currency } from "./types";
export const coinfxManager = (
  ccy: Currency,
  cfxProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds([ccy], cfxProgram);
};

export const riskManager = (
  ccy: Currency,
  cfxProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds([ccy, RiskManager], cfxProgram);
};

export const managerUserPermissions = (
  ccy: Currency,
  adminPubkey: PublicKey,
  cfxProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds(
    [ccy, UserPermissions, adminPubkey.toBuffer()],
    cfxProgram
  );
};

export const usdxUsdOracleManager = (
  ccy: Currency,
  cfxProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds(
    [Shared, ProgramOracleManager.USDXUSD],
    cfxProgram
  );
};

export const fxUsdOracleManager = (
  ccy: Currency,
  cfxProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds([ccy, ProgramOracleManager.FXUSD], cfxProgram);
};

export const solUsdOracleManager = (
  ccy: Currency,
  cfxProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds(
    [Shared, ProgramOracleManager.SOLUSD],
    cfxProgram
  );
};

export const cfxUsdxDa = (ccy: Currency, cfxProgram: PublicKey): PublicKey => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.CFXUSDX], cfxProgram);
};

export const usdxCfxDa = (ccy: Currency, cfxProgram: PublicKey): PublicKey => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.USDXCFX], cfxProgram);
};

export const dankCfxDa = (ccy: Currency, cfxProgram: PublicKey): PublicKey => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.DANKCFX], cfxProgram);
};

export const usdxDankDa = (ccy: Currency, cfxProgram: PublicKey): PublicKey => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.USDXDANK], cfxProgram);
};

export const cfxMint = (ccy: Currency, cfxProgram: PublicKey): PublicKey => {
  return deriveAddressFromSeeds([ccy, ProgramToken.CFX], cfxProgram);
};

export const dankMint = (
  ccy: Currency,
  cfxProgram: PublicKey,
  sharedDank: boolean
): PublicKey => {
  const conditionalDankSeed = sharedDank ? SharedDank : ccy;
  return deriveAddressFromSeeds(
    [conditionalDankSeed, ProgramToken.DANK],
    cfxProgram
  );
};

export const lpMint = (
  token0: PublicKey,
  token1: PublicKey,
  cpammProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds(
    [token0.toBuffer(), token1.toBuffer()],
    cpammProgram
  );
};

export const dankMintAuthority = (
  ccy: Currency,
  cfxProgram: PublicKey,
  sharedDank: boolean
): PublicKey => {
  const conditionalDankSeed = sharedDank ? SharedDank : ccy;

  // If dank is not shared, this will be the coinfxManager address
  return deriveAddressFromSeeds([conditionalDankSeed], cfxProgram);
};

export const cpammFactory = (
  creator: PublicKey,
  cpammProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds(
    [Cpamm.FACTORY, creator.toBuffer()],
    cpammProgram
  );
};

export const swapAccount = (
  factory: PublicKey,
  token0: PublicKey,
  token1: PublicKey,
  cpammProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds(
    [Cpamm.SWAPINFO, factory.toBuffer(), token0.toBuffer(), token1.toBuffer()],
    cpammProgram
  );
};

export const swapUserPermissions = (
  adminPubkey: PublicKey,
  swapAccount: PublicKey,
  cpammProgram: PublicKey
): PublicKey => {
  return deriveAddressFromSeeds(
    [UserPermissions, adminPubkey.toBuffer(), swapAccount.toBuffer()],
    cpammProgram
  );
};

const deriveAddressFromSeeds = (
  seeds: Array<string | Buffer>,
  program: PublicKey
): PublicKey => {
  const seedBuffers = seeds.map((seed) => Buffer.from(seed));
  return PublicKey.findProgramAddressSync(seedBuffers, program)[0];
};
