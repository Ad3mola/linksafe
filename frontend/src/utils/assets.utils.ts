// @ts-nocheck

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

export const computeAssets = (vaultInfo) => {
  try {
    if (!vaultInfo.address) {
      return;
    }
    const assetsList: Record<string, Asset> | any = vaultInfo.balances;

    if (!assetsList) {
      return;
    }

    const assetsArray = Object.values(assetsList);
    const ownedAssets = resolveAssets(assetsArray);

    return {
      assets: ownedAssets.tokens ?? [],
      nfts: ownedAssets.nfts ?? [],
    };
  } catch (error) {
    console.error("Error fetching or processing assets:", error);
  }
};
