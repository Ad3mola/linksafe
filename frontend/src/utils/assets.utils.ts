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

interface OwnedAsset {
  amount: number;
  "asset-id": number;
  "is-frozen": boolean;
}
export interface NFT {
  amount: number;
  "asset-id": number;
  "is-frozen": boolean;
}

const resolveAssets = async (results: any) => {
  const filteredTokens = results.filter(
    (asset) => asset && asset.decimals !== 0
  ) as Asset[];

  const filteredNFTs = results.filter(
    (asset) => asset && asset.decimals === 0 && asset.amount === 1
  ) as Asset[];

  return { tokens: filteredTokens, nfts: filteredNFTs };
};

export const computeAssets = async (vaultInfo, connection) => {
  try {
    if (!vaultInfo.address) {
      return;
    }

    // Transform balances object into an array
    const assetsList = Object.entries(vaultInfo.balances).map(
      ([key, value]) => ({
        mint: key,
        balance: value,
      })
    );

    if (!assetsList) {
      return;
    }

    const tokenPromises = assetsList.map(async (asset) => {
      const tokenInfo = await getSolanaAssetName(asset.mint, connection);

      if (!tokenInfo?.name) {
        return null; // Skip if no valid name is found
      }

      return {
        logo: tokenInfo.logo || null,
        name: tokenInfo.name,
        amount: Number(asset.balance),
      };
    });

    const results = await Promise.all(tokenPromises);

    return {
      assets: results ?? [],
      nfts: [],
    };
  } catch (error) {
    console.error("Error fetching or processing assets:", error);
  }
};
