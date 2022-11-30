import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { ProgramAuction, ProgramOracleManager, ProgramToken } from "./enums";
import { RiskManagerSeed } from "./constants";
import { CoinfxCurrencyContext, Config, EnvType } from "./types";

import devConfig = require('./config/dev.json');

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

    const cfxProgramPk = new PublicKey(this.config.cfxProgram)
    const coinfxManagerPk = new PublicKey(this.config.coinfxManager)
    const usdxMintPk = new PublicKey(this.config.usdxMint)
    const authorityPk = new PublicKey(this.config.authority)
    const cpammProgramPk = new PublicKey(this.config.cpammProgram)

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
        this.config.shareDank ?
          Buffer.from(this.encodeString("shared_dank"))
          : Buffer.from(this.encodeString(ccy)),
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
        this.config.shareDank ?
          Buffer.from(this.encodeString("shared_dank"))
          : Buffer.from(this.encodeString(ccy)),
      ],
      cfxProgramPk
    );

    const [usdxUsdOracleManager] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramOracleManager.USDXUSD)),
      ],
      cfxProgramPk
    );

    const [fxUsdOracleManager] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramOracleManager.FXUSD)),
      ],
      cfxProgramPk
    );

    const [solUsdOracleManager] = await PublicKey.findProgramAddress(
      [
        Buffer.from(this.encodeString(ccy)),
        Buffer.from(this.encodeString(ProgramOracleManager.SOLUSD)),
      ],
      cfxProgramPk
    );
    // todo: oracle

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

    return {
      cfxProgram: this.config.cfxProgram,
      cpammProgram: this.config.cpammProgram,
      coinfxManager: this.config.coinfxManager,
      userPermissions: userPermissions.toBase58(),
      usdxMint: this.config.usdxMint,
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
      pythProgram: this.config.pythProgram,
      fxUsdOracleManager: {
        oracleManager: fxUsdOracleManager.toBase58(),
        pythOracle: PublicKey.default.toBase58(), // TODO: derive oracle
        switchboardAggregator: PublicKey.default.toBase58(),
      },
      usdxUsdOracleManager: {
        oracleManager: usdxUsdOracleManager.toBase58(),
        pythOracle: PublicKey.default.toBase58(),
        switchboardAggregator: PublicKey.default.toBase58(),
      },
      solUsdOracleManager: {
        oracleManager: solUsdOracleManager.toBase58(),
        pythOracle: PublicKey.default.toBase58(),
        switchboardAggregator: PublicKey.default.toBase58(),
      },
    }
  }
}