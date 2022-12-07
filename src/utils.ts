import { PublicKey } from "@solana/web3.js";

// eslint-disable-next-line
export const decodeOracles = (json: { [key: string]: any }) => {
  for (const [key, value] of Object.entries(json)) {
    if (value instanceof Object) {
      decodeOracles(value);
    } else if (key === "invertQuote"){
      continue
    } else {
      json[key] = new PublicKey(value);
    }
  }
  return json;
};