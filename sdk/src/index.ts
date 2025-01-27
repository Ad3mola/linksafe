import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import {TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { ed25519 } from "@noble/curves/ed25519";
import B58 from "./base58";
import { Buffer } from "buffer";


const connection = new Connection("https://solana-mainnet.api.syndica.io/api-key/2rx11auHBcq6zJWiq5v3MaMRN5zTPgpoFFfsEs1Qxj7tb2rw1NsERKE3DRnH99NMLHQpeVya8dw6DVXo7URBWJRGBQCHR1AKpmR", "confirmed");
const b58 = new B58();
const safeUrl = "https://linksafe-reown.vercel.app/lnv";

// Function to get Public Key
const getPublicKey = (priv: Uint8Array): Uint8Array => {
  const pub = ed25519.getPublicKey(priv);
  return pub;
};

// Function to create a link-safe
const createSafe = async () => {
  try {
    // Generate new Solana keypair
    const keypair = Keypair.generate();
    const privateKey = keypair.secretKey; // Keep the full secret key (64 bytes)

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


// Function to resolve a link-safe
const getSafe = async (linksafe: string) => {
  try {
    const safe = linksafe.replace(safeUrl, "");

    // Decode the private key from Base58
    const hex = b58.decodeBase58(safe);
    const hexBuffer = Buffer.from(hex, "hex");

    // Ensure the private key is 64 bytes
    if (hexBuffer.length !== 64) {
      throw new Error("Invalid private key length");
    }

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


const accountBalances = async (publicKey: string): Promise<Record<string, string>> => {
  try {
      const publicKeyObj = new PublicKey(publicKey);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKeyObj,
          {
              programId: TOKEN_PROGRAM_ID,
          }
      );

      const tokenBalances: Record<string, string> = {}; 

      for (const { account } of tokenAccounts.value) {
          const tokenAmount = account.data.parsed.info.tokenAmount;
          const mint = account.data.parsed.info.mint;

          tokenBalances[mint] = tokenAmount.uiAmountString; 
      }

      return tokenBalances;
  } catch (error) {
      console.error("Error fetching balances:", error);
      return {}; 
  }
};


export { getSafe, createSafe, getPublicKey };
