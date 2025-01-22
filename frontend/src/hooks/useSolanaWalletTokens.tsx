import { useState, useEffect } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import {
  Asset,
  SolanaAsset,
  UseSolanaTokensAndNFTsResult,
} from "../utils/assets.utils";

/**
 * Fetch the name and logo of a Solana asset using its mint address.
 * Handles both token and NFT assets.
 *
 * @param {string} mintAddress - The mint address of the asset.
 * @param {Connection} connection - Solana connection instance.
 * @returns {Promise<SolanaAsset | string>} - Asset details or an error message.
 */

const getSolanaAssetName = async (
  mintAddress: string,
  connection: Connection
): Promise<SolanaAsset | string> => {
  const metaplex = new Metaplex(connection);

  try {
    const mintPublicKey = new PublicKey(mintAddress);

    // Attempt to fetch NFT metadata
    const nft = await metaplex
      .nfts()
      .findByMint({ mintAddress: mintPublicKey });

    if (nft) {
      const metadataResponse = await fetch(nft.uri);
      const metadata = await metadataResponse.json();

      return { name: nft.name, logo: metadata.image };
    }

    return "Unknown Asset";
  } catch (error) {
    console.error("Error fetching asset name:", error);
    return "Error";
  }
};

/**
 * Custom hook to fetch Solana tokens and NFTs for a given wallet address.
 *
 * @param {string} address - Wallet address to fetch assets for.
 * @param {string} [network="solana-mainnet"] - Solana network to connect to.
 * @returns {UseSolanaTokensAndNFTsResult} - Tokens, NFTs, loading state, and error state.
 */
const useSolanaTokensAndNFTs = (
  address: string,
  network: string = "solana-mainnet"
): UseSolanaTokensAndNFTsResult => {
  const [tokens, setTokens] = useState<Asset[]>([]);
  const [nfts, setNfts] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokensAndNFTs = async () => {
      try {
        setLoading(true);
        setError(null);

        const connection = new Connection(
          `https://${network}.api.syndica.io/api-key/${import.meta.env.VITE_SOLANA_API_KEY}`
        );
        const publicKey = new PublicKey(address);

        // Fetch token accounts for the wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );

        const fetchedTokens: Asset[] = [];
        const fetchedNFTs: Asset[] = [];

        // Process token accounts
        tokenAccounts.value.map(async (accountInfo) => {
          const data = accountInfo.account.data.parsed.info;
          const tokenInfo = await getSolanaAssetName(data.mint, connection);

          // Ensure asset has a valid name before including it
          if (typeof tokenInfo === "string" || !tokenInfo.name) {
            return;
          }

          const tokenData: Asset = {
            mint: data.mint,
            owner: data.owner,
            amount: data.tokenAmount.uiAmount,
            decimals: data.tokenAmount.decimals,
            logo: (tokenInfo as SolanaAsset).logo || null,
            name: (tokenInfo as SolanaAsset).name || "Unknown",
          };

          // Classify assets as tokens or NFTs
          if (
            data.tokenAmount.decimals === 0 &&
            data.tokenAmount.uiAmount === 1
          ) {
            fetchedNFTs.push(tokenData);
          } else {
            fetchedTokens.push(tokenData);
          }
        });

        setTokens(fetchedTokens);
        setNfts(fetchedNFTs);
      } catch (err: any) {
        console.error("Error fetching tokens and NFTs:", err);
        setError(err.message || "Failed to fetch tokens and NFTs");
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchTokensAndNFTs();
    }
  }, [address, network]);

  return { tokens, nfts, loading, error };
};

export default useSolanaTokensAndNFTs;
