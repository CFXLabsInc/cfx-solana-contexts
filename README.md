# cfx-solana-contexts

## Installing

Grab the latest version of the package [here](https://github.com/CFXLabsInc/cfx-solana-contexts/pkgs/npm/solana-contexts).

You need to be [authenticated](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages) with GitHub packages to be able to install the dependencies.

This is already baked into our github actions workflows, but for local development in any repo using this package, you will need to set a `GITHUB_TOKEN` in your `.env` file.

## Usage

Currently, this package enables developers to fetch all Solana accounts associated with our protocol.

```typescript
import { CoinfxContext, Config, OracleConfig, SolanaContext } from "@cfxlabsinc/solana-contexts;

const context = new CoinfxContext("dev");

const config: Config = context.getConfig();

const oracleConfig: OracleConfig = context.getOracleConfig();

const solanaContext: SolanaContext = context.getSolanaContext("EUR");

```
