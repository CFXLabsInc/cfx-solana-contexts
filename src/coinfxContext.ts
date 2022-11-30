import { getAssociatedTokenAddress, thawAccountInstructionData } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { ProgramAuction, ProgramOracleManager, ProgramToken } from "./enums";
import { RiskManagerSeed } from "./constants";
import { CoinFxContext, Config, Env } from "./types";
import { decodeObjectToPubkeys } from "./utils";

import devConfig = require('./config/dev.json');

export class CoinfxContext {
  public env: Env
  private readonly config: Config

  constructor(env: Env) {
    this.env = env;

    if (env === 'dev') {
      this.config = this.decodeConfig(devConfig);
    } else {
      throw Error('config file not found')
    }
  }

  public getConfig(): Config {
    return this.config
  }

  public async getContext(ccy: string): Promise<CoinFxContext> {
    const {
      adminPubkey,
      cpammProgramId,
      cfxProgramId,
      usdxMint,
      sharedDank,
      fxOracleAccounts,
      sharedOracleAccounts
    } = this.config;

    const [coinfxManager] = await PublicKey.findProgramAddress(
      [Buffer.from(ccy, "utf-8")],
      cfxProgramId
    );
  
    const [cfxMint] = await PublicKey.findProgramAddress(
      [Buffer.from(ccy, "utf-8"), Buffer.from(ccy, "utf-8")],
      cfxProgramId
    );
  
    const [dankMint] = await PublicKey.findProgramAddress(
      [
        sharedDank
          ? Buffer.from("shared_dank", "utf-8")
          : Buffer.from(ccy, "utf-8"),
        Buffer.from(ProgramToken.DANK, "utf-8"),
      ],
      cfxProgramId
    );
  
    const cfxTokenAccount = await getAssociatedTokenAddress(cfxMint, adminPubkey);
    const usdxTokenAccount = await getAssociatedTokenAddress(
      usdxMint,
      adminPubkey
    );
    const dankTokenAccount = await getAssociatedTokenAddress(
      dankMint,
      adminPubkey
    );
  
    const cfxVault = await getAssociatedTokenAddress(
      cfxMint,
      coinfxManager,
      true
    );
    const dankVault = await getAssociatedTokenAddress(
      dankMint,
      coinfxManager,
      true
    );
    const usdxVault = await getAssociatedTokenAddress(
      usdxMint,
      coinfxManager,
      true
    );
  
    const [cfxUsdxDa] = await PublicKey.findProgramAddress(
      [Buffer.from(ccy, "utf-8"), Buffer.from(ProgramAuction.CFXUSDX, "utf-8")],
      cfxProgramId
    );
    const [usdxCfxDa] = await PublicKey.findProgramAddress(
      [Buffer.from(ccy, "utf-8"), Buffer.from(ProgramAuction.USDXCFX, "utf-8")],
      cfxProgramId
    );
    const [dankCfxDa] = await PublicKey.findProgramAddress(
      [Buffer.from(ccy, "utf-8"), Buffer.from(ProgramAuction.DANKCFX, "utf-8")],
      cfxProgramId
    );
    const [usdxDankDa] = await PublicKey.findProgramAddress(
      [Buffer.from(ccy, "utf-8"), Buffer.from(ProgramAuction.USDXDANK, "utf-8")],
      cfxProgramId
    );
  
    const [riskManager] = await PublicKey.findProgramAddress(
      [Buffer.from(ccy, "utf-8"), Buffer.from(RiskManagerSeed, "utf-8")],
      cfxProgramId
    );
  
    const [dankMintAuthority] = await PublicKey.findProgramAddress(
      [
        sharedDank
          ? Buffer.from("shared_dank", "utf-8")
          : Buffer.from(ccy, "utf-8"),
      ],
      cfxProgramId
    );
  
    const [usdxUsdOracleManager] = await PublicKey.findProgramAddress(
      [
        Buffer.from(ccy, "utf-8"),
        Buffer.from(ProgramOracleManager.USDXUSD, "utf-8"),
      ],
      cfxProgramId
    );
  
    const [fxUsdOracleManager] = await PublicKey.findProgramAddress(
      [
        Buffer.from(ccy, "utf-8"),
        Buffer.from(ProgramOracleManager.FXUSD, "utf-8"),
      ],
      cfxProgramId
    );
  
    const [solUsdOracleManager] = await PublicKey.findProgramAddress(
      [
        Buffer.from(ccy, "utf-8"),
        Buffer.from(ProgramOracleManager.SOLUSD, "utf-8"),
      ],
      cfxProgramId
    );
  
    return {
      adminPubkey,
      cpammProgramId,
      cfxProgramId,
      usdxMint,
      sharedDank,
      coinfxManager,
      cfxMint,
      dankMint,
      cfxVault,
      dankVault,
      usdxVault,
      cfxUsdxDa,
      usdxCfxDa,
      dankCfxDa,
      usdxDankDa,
      riskManager,
      dankMintAuthority,
      cfxTokenAccount,
      usdxTokenAccount,
      dankTokenAccount,
      fxUsdOracleManager: {
        oracleManager: fxUsdOracleManager,
        pythOracle: fxOracleAccounts[ccy].pyth,
        switchboardAggregator: fxOracleAccounts[ccy].switchboard,
      },
      usdxUsdOracleManager: {
        oracleManager: usdxUsdOracleManager,
        pythOracle: sharedOracleAccounts["USDX"].pyth,
        switchboardAggregator: sharedOracleAccounts["USDX"].switchboard,
      },
      solUsdOracleManager: {
        oracleManager: solUsdOracleManager,
        pythOracle: sharedOracleAccounts["SOL"].pyth,
        switchboardAggregator: sharedOracleAccounts["SOL"].switchboard,
      },
    };
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

    // const [userPermissions] = await PublicKey.findProgramAddress(
    //   [
    //     Buffer.from(this.encodeString("access_control")),
    //     authorityPk.toBuffer(),
    //   ],
    //   cfxProgramPk
    // );
  }

  private decodeConfig(json: { [key: string]: any }): Config {
    json["adminPubkey"] = new PublicKey(json["adminPubkey"]);
    json["cpammProgramId"] = new PublicKey(json["cpammProgramId"]);
    json["cfxProgramId"] = new PublicKey(json["cfxProgramId"]);
    json["usdxMint"] = new PublicKey(json["usdxMint"]);
    json["sharedOracleAccounts"] = decodeObjectToPubkeys(
      json["sharedOracleAccounts"]
    );
    json["fxOracleAccounts"] = decodeObjectToPubkeys(json["fxOracleAccounts"]);
    return json as Config
  }
}