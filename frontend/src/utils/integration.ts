// @ts-nocheck

import { errorToast, successToast } from "./customToast";

import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { OwnedAssets } from "./assets.utils";

export const claimVault = async (
  vault,
  recipientAddress: string,
  connection: Connection,
  storedAssets: OwnedAssets
) => {
  try {
    const transaction = new Transaction();
    const recentBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = vault.keypair.publicKey;

    // Process each asset
    for (const asset of storedAssets) {
      // Handle SPL Tokens
      const mint = new PublicKey(asset.mint);
      const sourceTokenAccount = await getAssociatedTokenAddress(
        mint,
        vault.publicKey
      );

      const recipientTokenAccount = await getAssociatedTokenAddress(
        mint,
        new PublicKey(recipientAddress)
      );

      // Create ATA if needed (vault pays for creation)
      const ataAccountInfo = await connection.getAccountInfo(
        recipientTokenAccount
      );
      if (!ataAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            vault.publicKey, // Payer
            recipientTokenAccount,
            new PublicKey(recipientAddress),
            mint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          sourceTokenAccount,
          recipientTokenAccount,
          vault.publicKey,
          asset.amount
        )
      );
    }

    // Sign and send transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [vault.keypair] // Vault keypair signs the transaction
    );

    successToast("successfully claimed asset");

    return {
      success: true,
      signature,
      message: "Assets claimed successfully",
    };
  } catch (error) {
    errorToast(`Claim failed: ${error.message}`);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// const resolveVault = async (vault) => {
//   const sk = await vault.keypair.privateKey;
//   const pk = await vault.keypair.publicKey;
//   const vaultSK = new Uint8Array([...sk, ...pk]);
//   return vaultSK;
// };
