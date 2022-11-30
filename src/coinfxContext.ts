import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { ProgramAuction, ProgramOracleManager, ProgramToken } from "./enums";
import { RiskManagerSeed } from "./constants";
import { CoinFxContext, Config, Env } from "./types";
import { decodeObjectToPubkeys } from "./utils";
import * as Pda from "./pda";

import devConfig = require("./config/dev.json");

export class CoinfxContext {
  public env: Env;
  private readonly config: Config;

  constructor(env: Env) {
    this.env = env;

    if (env === "dev") {
      this.config = this.decodeConfig(devConfig);
    } else {
      throw Error("config file not found");
    }
  }

  public getConfig(): Config {
    return this.config;
  }

  public async getContext(ccy: string): Promise<CoinFxContext> {
    const {
      adminPubkey,
      cpammProgram,
      cfxProgram,
      usdxMint,
      sharedDank,
      fxOracleAccounts,
      sharedOracleAccounts,
    } = this.config;

    const coinfxManager = await Pda.coinfxManager(ccy, cfxProgram);
    const riskManager = await Pda.riskManager(ccy, cfxProgram);
    const usdxUsdOracleManager = await Pda.usdxUsdOracleManager(ccy, cfxProgram);
    const fxUsdOracleManager = await Pda.fxUsdOracleManager(ccy, cfxProgram);
    const solUsdOracleManager = await Pda.solUsdOracleManager(ccy, cfxProgram);
    const cfxUsdxDa = await Pda.cfxUsdxDa(ccy, cfxProgram);
    const usdxCfxDa = await Pda.usdxCfxDa(ccy, cfxProgram);
    const dankCfxDa = await Pda.dankCfxDa(ccy, cfxProgram);
    const usdxDankDa = await Pda.usdxDankDa(ccy, cfxProgram);
    const cfxMint = await Pda.cfxMint(ccy, cfxProgram);
    const dankMint = await Pda.dankMint(ccy, cfxProgram, sharedDank);
    const dankMintAuthority = await Pda.dankMintAuthority(ccy, cfxProgram, sharedDank);
    const userPermissions = await Pda.userPermissions(cfxProgram, adminPubkey);

    const cfxTokenAccount = await getAssociatedTokenAddress(
      cfxMint,
      adminPubkey
    );
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

    return {
      adminPubkey,
      cpammProgram,
      cfxProgram,
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
      userPermissions,
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
    json["cpammProgram"] = new PublicKey(json["cpammProgram"]);
    json["cfxProgram"] = new PublicKey(json["cfxProgram"]);
    json["usdxMint"] = new PublicKey(json["usdxMint"]);
    json["sharedOracleAccounts"] = decodeObjectToPubkeys(
      json["sharedOracleAccounts"]
    );
    json["fxOracleAccounts"] = decodeObjectToPubkeys(json["fxOracleAccounts"]);
    return json as Config;
  }
}
