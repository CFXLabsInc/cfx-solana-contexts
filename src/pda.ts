import { PublicKey } from "@solana/web3.js";
import {
  Cpamm,
  ProgramAuction,
  ProgramOracleManager,
  ProgramToken,
  UserPermissions,
  RiskManager,
  SharedDank,
} from "./seeds";
import { sortByPubkey } from "./utils";

export const coinfxManager = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy], cfxProgram);
};

export const riskManager = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, RiskManager], cfxProgram);
};

export const managerUserPermissions = async (
  ccy: string,
  adminPubkey: PublicKey,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds(
    [ccy, UserPermissions, adminPubkey.toBase58()],
    cfxProgram
  );
};

export const usdxUsdOracleManager = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds(
    [ccy, ProgramOracleManager.USDXUSD],
    cfxProgram
  );
};

export const fxUsdOracleManager = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramOracleManager.FXUSD], cfxProgram);
};

export const solUsdOracleManager = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramOracleManager.SOLUSD], cfxProgram);
};

export const cfxUsdxDa = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.CFXUSDX], cfxProgram);
};

export const usdxCfxDa = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.USDXCFX], cfxProgram);
};

export const dankCfxDa = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.DANKCFX], cfxProgram);
};

export const usdxDankDa = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.USDXDANK], cfxProgram);
};

export const cfxMint = async (
  ccy: string,
  cfxProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramToken.CFX], cfxProgram);
};

export const dankMint = async (
  ccy: string,
  cfxProgram: PublicKey,
  sharedDank: boolean
): Promise<PublicKey> => {
  const conditionalDankSeed = sharedDank ? SharedDank : ccy;
  return deriveAddressFromSeeds(
    [conditionalDankSeed, ProgramToken.DANK],
    cfxProgram
  );
};

export const dankMintAuthority = async (
  ccy: string,
  cfxProgram: PublicKey,
  sharedDank: boolean
): Promise<PublicKey> => {
  const conditionalDankSeed = sharedDank ? SharedDank : ccy;

  // If dank is not shared, this will be the coinfxManager address
  return deriveAddressFromSeeds([conditionalDankSeed], cfxProgram);
};

export const cpammFactory = async (
  creator: PublicKey,
  cpammProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds(
    [Cpamm.FACTORY, creator.toBase58()],
    cpammProgram
  );
};

export const swapAccount = async (
  factory: PublicKey,
  token0: PublicKey,
  token1: PublicKey,
  cpammProgram: PublicKey
): Promise<PublicKey> => {
  const [first, second] = sortByPubkey(token0, token1)!;
  return deriveAddressFromSeeds(
    [Cpamm.SWAPINFO, factory.toBase58(), first.toBase58(), second.toBase58()],
    cpammProgram
  );
};

export const swapUserPermissions = async (
  adminPubkey: PublicKey,
  swapAccount: PublicKey,
  cpammProgram: PublicKey
): Promise<PublicKey> => {
  return deriveAddressFromSeeds(
    [UserPermissions, adminPubkey.toBase58(), swapAccount.toBase58()],
    cpammProgram
  );
};

const deriveAddressFromSeeds = async (
  seeds: string[],
  program: PublicKey
): Promise<PublicKey> => {
  const seedBuffers = seeds.map((seed) => Buffer.from(seed));
  return await PublicKey.findProgramAddress(seedBuffers, program)[0];
};
