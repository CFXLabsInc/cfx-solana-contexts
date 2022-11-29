import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { ProgramAuction, ProgramToken } from "./enums";
import { RiskManagerSeed } from "./constants";
import { CoinfxCurrencyContext, Config, EnvType } from "./types";

const devConfig = require('../config/dev.json');

export const coinfxManager = "3t41U2XXcdab8hwLyf7p3keVhU7sC6gxdBQMiNhum7wj";
export const usdxMint = "6aj4iVXQe9RckXa1TzHKMSxUuvUmu65Q8gSRitjeJD8W";
export const cfxProgram = "AEdtcbKYEAoJ1NQcwRjL4GA2Xh9sVHuVSYUMC5YRGUKa";
export const cpammProgram = "9fy74asi1xE4ZMJPju45myLSakMK18PR97uGWPMUJBPr";
export const authority = "9xLqB9SMbMqwxPrm8arnc6sX49FaBsK21TLW3UoCVFEW";
export const pythProgram = "11111111111111111111111111111111";

export class CoinfxContext {
  public env: EnvType
  private readonly config: Config

  constructor(env: EnvType) {
    this.env = env;

    if (env === 'dev') {
      this.config = devConfig
    } else {
      throw Error('config file not found')
    }
  }

  private encodeString(value: string): string {
    return Buffer.from(value, 'utf-8').toString();
  }

  public getConfig(): Config {
    return this.config
  }

  public async getCurrencyContext(ccy: string): Promise<CoinfxCurrencyContext> {

    const cfxProgramPk = new PublicKey(cfxProgram)
    const coinfxManagerPk = new PublicKey(coinfxManager)
    const usdxMintPk = new PublicKey(usdxMint)
    const authorityPk = new PublicKey(authority)
    const cpammProgramPk = new PublicKey(cpammProgram)

    const usdxVault = await getAssociatedTokenAddress(
      usdxMintPk,
      coinfxManagerPk,
      true
    );
    const [cfxMint] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramToken.CFX)),
      ],
      cfxProgramPk
    );
    const cfxVault = await getAssociatedTokenAddress(
      cfxMint,
      coinfxManagerPk,
      true
    );
    const [dankMint] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString("shared_dank")),
        Buffer.from(this.encodeString(ProgramToken.DANK)),
      ],
      cfxProgramPk
    );
    const dankVault = await getAssociatedTokenAddress(
      dankMint,
      coinfxManagerPk,
      true
    );

    const [cfxUsdxDa] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramAuction.CFXUSDX)),
      ],
      cfxProgramPk
    );

    const [usdxCfxDa] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramAuction.USDXCFX)),
      ],
      cfxProgramPk
    );
    const [dankCfxDa] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramAuction.DANKCFX)),
      ],
      cfxProgramPk
    );
    const [usdxDankDa] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramAuction.USDXDANK)),
      ],
      cfxProgramPk
    );

    const [riskManager] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(RiskManagerSeed)),
      ],
      cfxProgramPk
    );

    const [dankMintAuthority] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString("shared_dank")),
      ],
      cfxProgramPk
    );

    // todo: swap
    // const [cpammFactory] = await PublicKey.findProgramAddress(
    //   [
    //     Buffer.from(this.encodeString("Factory")),
    //     authorityPk.toBuffer(),
    //   ],
    //   cpammProgramPk
    // );

    // const [token0, token1] = sortByPubkey(usdxMintPk, dankMint)!;
    // const [usdxDankSwap] = await PublicKey.findProgramAddress(
    //   [
    //     Buffer.from(this.encodeString("SwapInfo")),
    //     cpammFactory.toBuffer(),
    //     token0.toBuffer(),
    //     token1.toBuffer(),
    //   ],
    //   authorityPk
    // );

    const [userPermissions] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString("access_control")),
        authorityPk.toBuffer(),
      ],
      cfxProgramPk
    );

    // todo: oracle and oracle manager

    return {
      cfxProgram: cfxProgram,
      cpammProgram: cpammProgram,
      coinfxManager: coinfxManager,
      userPermissions: userPermissions.toBase58(),
      usdxMint: usdxMint,
      usdxVault: usdxVault.toBase58(),
      cfxMint: cfxMint.toBase58(),
      cfxVault: cfxVault.toBase58(),
      dankMint: dankMint.toBase58(),
      dankVault: dankVault.toBase58(),
      cfxUsdxDa: cfxUsdxDa.toBase58(),
      usdxCfxDa: usdxCfxDa.toBase58(),
      dankCfxDa: dankCfxDa.toBase58(),
      usdxDankDa: usdxDankDa.toBase58(),
      riskManager: riskManager.toBase58(),
      dankMintAuthority: dankMintAuthority.toBase58(),
      pythProgram: pythProgram
    }
  }
}