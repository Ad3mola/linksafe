// @ts-nocheck

import { getSolanaAssetName } from "../hooks/useSolanaWalletTokens";

export interface SolanaAsset {
  name: string;
  logo: string;
}

export interface OwnedAssets {
  assets: Asset[];
  nfts: Asset[];
}

export interface UseSolanaTokensAndNFTsResult {
  tokens: Asset[];
  nfts: Asset[];
  loading: boolean;
  error: string | null;
}

export interface Asset {
  mint: string;
  decimals: number;
  owner: string;
  amount: number;
  logo: string;
  name: string;
}

export interface NFT {
  amount: number;
  "asset-id": number;
  "is-frozen": boolean;
}

export const computeAssets = async (vaultInfo, connection) => {
  try {
    // Ensure vaultInfo and address are valid
    if (!vaultInfo?.address) {
      throw new Error("Invalid vault information: address is missing.");
    }

    // Transform balances object into an array of assets
    const assetsList = Object.entries(vaultInfo.balances || {}).map(
      ([mint, balance]) => ({
        mint,
        balance: Number(balance), // Ensure balance is a number
      })
    );

    if (assetsList.length === 0) {
      console.warn("No assets found in the vault.");
      return { assets: [], nfts: [] };
    }

    // Fetch asset details asynchronously
    const tokenPromises = assetsList.map(async (asset) => {
      try {
        const tokenInfo = await getSolanaAssetName(asset.mint, connection);

        if (!tokenInfo?.name) {
          return; // Skip if no valid name is found
        }
        return {
          logo: tokenInfo?.logo || null,
          name: tokenInfo?.name || "Unknown Token",
          amount: asset.balance,
        };
      } catch (tokenError) {
        console.error(
          `Error fetching token info for ${asset.mint}:`,
          tokenError
        );
        return null; // Skip problematic assets
      }
    });

    // Resolve all promises and filter out any null values
    const resolvedAssets = (await Promise.all(tokenPromises)).filter(Boolean);

    return {
      assets: resolvedAssets,
      nfts: [], // Placeholder for NFTs; populate if needed
    };
  } catch (error) {
    console.error("Error computing assets:", error);
    return {
      assets: [],
      nfts: [],
      error,
    };
  }
};
