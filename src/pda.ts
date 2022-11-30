import { PublicKey } from "@solana/web3.js";
import { Cpamm, ProgramAuction, ProgramOracleManager, ProgramToken, UserPermissions, RiskManager, SharedDank } from "./seeds";
import { sortByPubkey } from "./utils";

export const coinfxManager = async ( ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy], cfxProgram)[0]
};

export const riskManager = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, RiskManager], cfxProgram)[0]
}

export const managerUserPermissions = async (ccy: string, adminPubkey: PublicKey, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, UserPermissions, adminPubkey.toBase58()], cfxProgram)[0]
}

export const usdxUsdOracleManager = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramOracleManager.USDXUSD], cfxProgram)[0]
}

export const fxUsdOracleManager = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramOracleManager.FXUSD], cfxProgram)[0]
}

export const solUsdOracleManager = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramOracleManager.SOLUSD], cfxProgram)[0]
}

export const cfxUsdxDa = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.CFXUSDX], cfxProgram)[0]
}

export const usdxCfxDa = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.USDXCFX], cfxProgram)[0]
}

export const dankCfxDa = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.DANKCFX], cfxProgram)[0]
}

export const usdxDankDa = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramAuction.USDXDANK], cfxProgram)[0]
}

export const cfxMint = async (ccy: string, cfxProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([ccy, ProgramToken.CFX], cfxProgram)[0]
}

export const dankMint = async (ccy: string, cfxProgram: PublicKey, sharedDank: boolean): Promise<PublicKey> => {
  const conditionalDankSeed = sharedDank ? SharedDank : ccy;
  return deriveAddressFromSeeds([conditionalDankSeed, ProgramToken.DANK], cfxProgram)[0]
}

export const dankMintAuthority = async (ccy: string, cfxProgram: PublicKey, sharedDank: boolean): Promise<PublicKey> => {
  const conditionalDankSeed = sharedDank ? SharedDank : ccy;
  
  // If dank is not shared, this will be the coinfxManager address
  return deriveAddressFromSeeds([conditionalDankSeed], cfxProgram)[0]
}

export const cpammFactory = async (creator: PublicKey, cpammProgram: PublicKey): Promise<[PublicKey, number]> => {
  return deriveAddressFromSeeds([Cpamm.FACTORY, creator.toBase58()], cpammProgram)
}

export const swapAccount = async (factory: PublicKey, token0: PublicKey, token1: PublicKey, cpammProgram: PublicKey): Promise<[PublicKey, number]> => {
  const [first, second] = sortByPubkey(token0, token1)!;
  return deriveAddressFromSeeds([Cpamm.SWAPINFO, factory.toBase58(), first.toBase58(), second.toBase58()], cpammProgram)
}

export const swapUserPermissions = async (adminPubkey: PublicKey, swapAccount: PublicKey, cpammProgram: PublicKey): Promise<PublicKey> => {
  return deriveAddressFromSeeds([UserPermissions, adminPubkey.toBase58(), swapAccount.toBase58()], cpammProgram)[0]
}

const deriveAddressFromSeeds = async (seeds: string[], program: PublicKey): Promise<[PublicKey, number]> => {
  const seedBuffers  = seeds.map((seed) => Buffer.from(seed));
  return await PublicKey.findProgramAddress(seedBuffers, program)
}