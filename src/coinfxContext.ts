import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { SolanaContext, Config, Env, SolanaCluster, OracleConfig } from "./types";
import { decodeOracles } from "./utils";
import * as Pda from "./pda";

import devConfig = require("./config/dev.json");
import devOracleConfig = require("./config/oracles/dev.json");

export class CoinfxContext {
  public env: Env;
  public cluster: SolanaCluster;
  private readonly config: Config;
  private readonly oracleConfig: OracleConfig;

  constructor(env: Env) {
    this.env = env;
    this.cluster = this.getCluster(env);
    this.config = this.readConfig(env);
    this.oracleConfig = this.readOracleConfig(env);
  }

  public getConfig(): Config {
    return this.config;
  }

  public getOracleConfig(): OracleConfig {
    return this.oracleConfig;
  }

  public getCluster(env: Env): SolanaCluster {
    return env == "prod" ? "mainnet-beta" : "devnet"
  }

  public async getContext(ccy: string): Promise<SolanaContext> {
    const {
      adminPubkey,
      permissionedSwapPubkeys,
      authorityPubkey,
      cpammProgram,
      cfxProgram,
      usdxMint,
      sharedDank,
    } = this.config;

    const { fx, usdx, sol } = this.oracleConfig;

    // CFX PDA's

    const coinfxManager = await Pda.coinfxManager(ccy, cfxProgram);
    const riskManager = await Pda.riskManager(ccy, cfxProgram);
    const userPermissions = await Pda.managerUserPermissions(
      ccy,
      adminPubkey,
      cfxProgram
    );
    const usdxUsdOracleManager = await Pda.usdxUsdOracleManager(
      ccy,
      cfxProgram
    );
    const fxUsdOracleManager = await Pda.fxUsdOracleManager(ccy, cfxProgram);
    const solUsdOracleManager = await Pda.solUsdOracleManager(ccy, cfxProgram);
    const cfxUsdxDa = await Pda.cfxUsdxDa(ccy, cfxProgram);
    const usdxCfxDa = await Pda.usdxCfxDa(ccy, cfxProgram);
    const dankCfxDa = await Pda.dankCfxDa(ccy, cfxProgram);
    const usdxDankDa = await Pda.usdxDankDa(ccy, cfxProgram);
    const cfxMint = await Pda.cfxMint(ccy, cfxProgram);
    const dankMint = await Pda.dankMint(ccy, cfxProgram, sharedDank);
    const dankMintAuthority = await Pda.dankMintAuthority(
      ccy,
      cfxProgram,
      sharedDank
    );

    // CPAMM PDA's

    const cpammFactory = await Pda.cpammFactory(adminPubkey, cpammProgram);
    const usdxDankSwap = await Pda.swapAccount(
      cpammFactory,
      usdxMint,
      dankMint,
      cpammProgram
    );
    const usdxDankLpMint = await Pda.lpMint(usdxMint, dankMint, cpammProgram)
    const usdxDankSwapUserPermissions = await Pda.swapUserPermissions(
      adminPubkey,
      usdxDankSwap,
      cpammProgram
    );
    const usdxCfxSwap = await Pda.swapAccount(
      cpammFactory,
      usdxMint,
      cfxMint,
      cpammProgram
    );
    const usdxCfxLpMint = await Pda.lpMint(usdxMint, cfxMint, cpammProgram)
    const usdxCfxSwapUserPermissions = await Pda.swapUserPermissions(
      adminPubkey,
      usdxCfxSwap,
      cpammProgram
    );

    // AssociatedTokenAccounts

    const usdxDankReserveTokenAccountUsdx = await getAssociatedTokenAddress(
      usdxMint,
      usdxDankSwap,
      true
    );

    const usdxDankReserveTokenAccountDank = await getAssociatedTokenAddress(
      dankMint,
      usdxDankSwap,
      true
    );

    const usdxCfxReserveTokenAccountUsdx = await getAssociatedTokenAddress(
      usdxMint,
      usdxCfxSwap,
      true
    );

    const usdxCfxReserveTokenAccountCfx = await getAssociatedTokenAddress(
      cfxMint,
      usdxCfxSwap,
      true
    );

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

    const usdxDankLpTokenAccount = await getAssociatedTokenAddress(usdxDankLpMint, adminPubkey);

    const usdxCfxLpTokenAccount = await getAssociatedTokenAddress(usdxCfxLpMint, adminPubkey);

    return {
      cluster: this.cluster,
      permissionedSwapPubkeys,
      currency: ccy,
      adminPubkey,
      authorityPubkey,
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
      cpammFactory,
      fxUsdOracleManager: {
        oracleManager: fxUsdOracleManager,
        invertQuote: fx[ccy].invertQuote,
        pythOracle: fx[ccy].pyth,
        switchboardAggregator: fx[ccy].switchboard,
      },
      usdxUsdOracleManager: {
        oracleManager: usdxUsdOracleManager,
        pythOracle: usdx.pyth,
        switchboardAggregator: usdx.switchboard,
      },
      solUsdOracleManager: {
        oracleManager: solUsdOracleManager,
        pythOracle: sol.pyth,
        switchboardAggregator: sol.switchboard,
      },
      usdxDankSwap: {
        swap: usdxDankSwap,
        lpMint: usdxDankLpMint,
        lpTokenAccount: usdxDankLpTokenAccount,
        userPermissions: usdxDankSwapUserPermissions,
        usdxInfo: {
          reserve: usdxDankReserveTokenAccountUsdx,
          mint: usdxMint,
        },
        dankInfo: {
          reserve: usdxDankReserveTokenAccountDank,
          mint: dankMint,
        },
      },
      usdxCfxSwap: {
        swap: usdxCfxSwap,
        lpMint: usdxCfxLpMint,
        lpTokenAccount: usdxCfxLpTokenAccount,
        userPermissions: usdxCfxSwapUserPermissions,
        usdxInfo: {
          reserve: usdxCfxReserveTokenAccountUsdx,
          mint: usdxMint,
        },
        cfxInfo: {
          reserve: usdxCfxReserveTokenAccountCfx,
          mint: cfxMint,
        },
      },
    };
  }

  private readConfig(env: Env): Config {
    let config: Config;
    switch(env) {
      case "dev":
        config = this.decodeConfig(devConfig);
        break;
      default:
        throw Error(`Config not located for: ${env}`)
    }

    return config
  }

  private readOracleConfig(env: Env): OracleConfig {
    let config: OracleConfig;
    switch(env) {
      case "dev":
        config = this.decodeOracleConfig(devOracleConfig);
        break;
      default:
        throw Error(`Oracle Config not located for: ${env}`)
    }

    return config
  }

  private decodeOracleConfig(json: { [key: string]: any }): OracleConfig {
    return {
      cluster: json["cluster"],
      fx: decodeOracles(json["fx"]),
      usdx: decodeOracles(json["usdx"]),
      sol: decodeOracles(json["sol"]),
    } as OracleConfig
  }

  private decodeConfig(json: { [key: string]: any }): Config {
    const permissionedSwapPubkeys: string[] = json["permissionedSwapPubkeys"];
    return {
      cluster: json["cluster"],
      permissionedSwapPubkeys: permissionedSwapPubkeys.map((key) => new PublicKey(key)),
      adminPubkey: new PublicKey(json["adminPubkey"]),
      authorityPubkey: new PublicKey(json["authorityPubkey"]),
      cpammProgram: new PublicKey(json["cpammProgram"]),
      cfxProgram: new PublicKey(json["cfxProgram"]),
      usdxMint: new PublicKey(json["usdxMint"]),
      sharedDank: json["sharedDank"]
    }
  }
}
