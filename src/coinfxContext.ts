import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import {
  SolanaContext,
  Config,
  Env,
  SolanaCluster,
  OracleConfig,
  Currency,
  CURRENCIES,
} from "./types";
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
    this.cluster = env == "prod" ? "mainnet-beta" : "devnet";
    this.config = this.readConfig(env);
    this.oracleConfig = this.readOracleConfig(env);
  }

  public getConfig(): Config {
    return this.config;
  }

  public getOracleConfig(): OracleConfig {
    return this.oracleConfig;
  }

  public getCluster(): SolanaCluster {
    return this.cluster;
  }

  static parseCurrency(ccy: string): Currency | undefined {
    return CURRENCIES.includes(ccy as Currency) ? (ccy as Currency) : undefined;
  }

  public getSolanaContext(_ccy: string): SolanaContext {
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

    const ccy = CoinfxContext.parseCurrency(_ccy);

    if (!ccy) throw new Error("Not a valid currency");

    // CFX PDA's
    const coinfxManager = Pda.coinfxManager(ccy, cfxProgram);
    const riskManager = Pda.riskManager(ccy, cfxProgram);
    const userPermissions = Pda.managerUserPermissions(
      ccy,
      adminPubkey,
      cfxProgram
    );
    const usdxUsdOracleManager = Pda.usdxUsdOracleManager(ccy, cfxProgram);
    const fxUsdOracleManager = Pda.fxUsdOracleManager(ccy, cfxProgram);
    const solUsdOracleManager = Pda.solUsdOracleManager(ccy, cfxProgram);
    const cfxUsdxDa = Pda.cfxUsdxDa(ccy, cfxProgram);
    const usdxCfxDa = Pda.usdxCfxDa(ccy, cfxProgram);
    const dankCfxDa = Pda.dankCfxDa(ccy, cfxProgram);
    const usdxDankDa = Pda.usdxDankDa(ccy, cfxProgram);
    const cfxMint = Pda.cfxMint(ccy, cfxProgram);
    const dankMint = Pda.dankMint(ccy, cfxProgram, sharedDank);
    const dankMintAuthority = Pda.dankMintAuthority(
      ccy,
      cfxProgram,
      sharedDank
    );

    // CPAMM PDA's

    const cpammFactory = Pda.cpammFactory(adminPubkey, cpammProgram);
    const usdxDankSwap = Pda.swapAccount(
      cpammFactory,
      usdxMint,
      dankMint,
      cpammProgram
    );
    const usdxDankLpMint = Pda.lpMint(usdxMint, dankMint, cpammProgram);
    const usdxDankSwapUserPermissions = Pda.swapUserPermissions(
      adminPubkey,
      usdxDankSwap,
      cpammProgram
    );
    const usdxCfxSwap = Pda.swapAccount(
      cpammFactory,
      usdxMint,
      cfxMint,
      cpammProgram
    );
    const usdxCfxLpMint = Pda.lpMint(usdxMint, cfxMint, cpammProgram);
    const usdxCfxSwapUserPermissions = Pda.swapUserPermissions(
      adminPubkey,
      usdxCfxSwap,
      cpammProgram
    );

    // AssociatedTokenAccounts

    const usdxDankReserveTokenAccountUsdx = getAssociatedTokenAddressSync(
      usdxMint,
      usdxDankSwap,
      true
    );

    const usdxDankReserveTokenAccountDank = getAssociatedTokenAddressSync(
      dankMint,
      usdxDankSwap,
      true
    );

    const usdxCfxReserveTokenAccountUsdx = getAssociatedTokenAddressSync(
      usdxMint,
      usdxCfxSwap,
      true
    );

    const usdxCfxReserveTokenAccountCfx = getAssociatedTokenAddressSync(
      cfxMint,
      usdxCfxSwap,
      true
    );

    const cfxTokenAccount = getAssociatedTokenAddressSync(cfxMint, adminPubkey);
    const usdxTokenAccount = getAssociatedTokenAddressSync(
      usdxMint,
      adminPubkey
    );
    const dankTokenAccount = getAssociatedTokenAddressSync(
      dankMint,
      adminPubkey
    );

    const cfxVault = getAssociatedTokenAddressSync(
      cfxMint,
      coinfxManager,
      true
    );
    const dankVault = getAssociatedTokenAddressSync(
      dankMint,
      coinfxManager,
      true
    );
    const usdxVault = getAssociatedTokenAddressSync(
      usdxMint,
      coinfxManager,
      true
    );

    const usdxDankLpTokenAccount = getAssociatedTokenAddressSync(
      usdxDankLpMint,
      adminPubkey
    );

    const usdxCfxLpTokenAccount = getAssociatedTokenAddressSync(
      usdxCfxLpMint,
      adminPubkey
    );

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
    switch (env) {
      case "dev":
        config = this.decodeConfig(devConfig);
        break;
      default:
        throw Error(`Config not located for: ${env}`);
    }

    return config;
  }

  private readOracleConfig(env: Env): OracleConfig {
    let config: OracleConfig;
    switch (env) {
      case "dev":
        config = this.decodeOracleConfig(devOracleConfig);
        break;
      default:
        throw Error(`Oracle Config not located for: ${env}`);
    }

    return config;
  }

  private decodeOracleConfig(json: { [key: string]: any }): OracleConfig {
    return {
      cluster: json["cluster"],
      defaultAcceptedDelay: json["defaultAcceptedDelay"],
      defultAcceptedConf: json["defultAcceptedConf"],
      fx: decodeOracles(json["fx"]),
      usdx: decodeOracles(json["usdx"]),
      sol: decodeOracles(json["sol"]),
    } as OracleConfig;
  }

  private decodeConfig(json: { [key: string]: any }): Config {
    const permissionedSwapPubkeys: string[] = json["permissionedSwapPubkeys"];
    return {
      cluster: json["cluster"],
      permissionedSwapPubkeys: permissionedSwapPubkeys.map(
        (key) => new PublicKey(key)
      ),
      adminPubkey: new PublicKey(json["adminPubkey"]),
      authorityPubkey: new PublicKey(json["authorityPubkey"]),
      cpammProgram: new PublicKey(json["cpammProgram"]),
      cfxProgram: new PublicKey(json["cfxProgram"]),
      usdxMint: new PublicKey(json["usdxMint"]),
      sharedDank: json["sharedDank"],
    };
  }
}
