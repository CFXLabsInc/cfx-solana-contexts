import { PublicKey } from "@solana/web3.js";
import { zip } from "lodash";

export const sortByPubkey = (a: PublicKey, b: PublicKey) => {
  let bytes: Uint8Array[] = zip(a.toBytes(), b.toBytes());
  for (const byte of bytes) {
    return byte[0] < byte[1] ? [a, b] : [b, a]
  }
};

// @ts-ignore
export const decodeObjectToPubkeys = (json: { [key: string]: any }) => {
  for (const [key, value] of Object.entries(json)) {
    if (value instanceof Object) {
      decodeObjectToPubkeys(value);
    } else {
      json[key] = new PublicKey(value);
    }
  }
  return json;
};
