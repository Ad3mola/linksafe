// @ts-nocheck

import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";
import B58 from "./base58";
import { Buffer } from "buffer";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const b58 = new B58();
const safeUrl = "https://linksafe-reown.vercel.app/lnv";


const getPublicKey = (priv: Uint8Array): Uint8Array => {
  const privateKeyString = Buffer.from(priv).toString("hex");
  const pub = ed25519.getPublicKey(privateKeyString);
  return pub;
};

const createSafe = async () => {
  try {
    // Generate new Solana keypair
    const keypair = Keypair.generate();
    const privateKey = keypair.secretKey.slice(0, 32);

    // Convert private key to a hex string
    const privateKeyString = Buffer.from(privateKey).toString("hex");
    // Encode the private key to Base58
    const safeKey = b58.encodeBase58(privateKeyString);
    const linksafe = `${safeUrl}${safeKey}`;

    const safe = {
      address: keypair.publicKey.toBase58(),
      safe: linksafe,
    };
    return safe;
  } catch (error) {
    console.error("Error creating safe:", error);
    return null;
  }
};

const getSafe = async (linksafe: string) => {
  try {
    const safe = linksafe.replace(safeUrl, "");

    // Decode the private key from Base58
    const hex = b58.decodeBase58(safe);
    const hexBuffer = Buffer.from(hex, "hex");
    const privateKey = new Uint8Array(hexBuffer);
    const keypair = Keypair.fromSecretKey(privateKey);

    const publicKey = keypair.publicKey.toBase58();
    const balances = await accountBalances(publicKey);

    const wallet = {
      address: publicKey,
      linksafe,
      keypair: { privateKey, publicKey },
      balances,
    };
    console.log(wallet);
    return wallet;
  } catch (err) {
    console.error("Safe could not be resolved", err);
    return null;
  }
};

export { getSafe, createSafe };
