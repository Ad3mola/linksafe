import { useEffect, useRef } from "react";
import { Asset } from "../../utils/assets.utils";
import OptionLabel from "../Option-Label";
import { AssetsShowcaseContainer } from "./Assets-Showcase.styles";
import { errorToast } from "../../utils/customToast";
import { useAppKitAccount } from "@reown/appkit/react";
import CustomHashLoader from "../CustomHashLoader";

interface OwnedAssets {
  ownedAssets: {
    tokens: Asset[];
    nfts: Asset[];
  };
  params: boolean;
  handleSelectAsset?: (asset: Asset) => void;
  selectedAsset?: any;
  showDropdownItems?: boolean;
  setShowDropdownItems?: any;
  loading: boolean;
  error: any;
}

export const AssetsShowcase: React.FC<OwnedAssets> = ({
  ownedAssets: { tokens, nfts },
  params,
  handleSelectAsset,
  selectedAsset,
  showDropdownItems,
  setShowDropdownItems,
  loading,
  error,
}: OwnedAssets) => {
  const dropdownRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const { address } = useAppKitAccount();

  // handles the click event when clicked outside of dropdown
  useEffect(() => {
    const handleClickOutsideDropdownItem = (event: MouseEvent) => {
      if (params) return;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        event.target instanceof Element
      ) {
        setShowDropdownItems(false);
      }
    };

    document.addEventListener("click", handleClickOutsideDropdownItem);
    return () => {
      document.removeEventListener("click", handleClickOutsideDropdownItem);
    };
  }, []);

  useEffect(() => {
    params ? setShowDropdownItems(true) : setShowDropdownItems(false);
  }, [params, setShowDropdownItems]);

  const handleDropdown = () => {
    if (params) return;
    if (!params && !address) {
      errorToast("Please connect your wallet");
      return;
    }
    params
      ? setShowDropdownItems(true)
      : setShowDropdownItems(!showDropdownItems);
  };

  return (
    <AssetsShowcaseContainer>
      <div className="link__container" ref={dropdownRef}>
        <div
          className={`link__types ${showDropdownItems ? "link__active" : ""} `}
          onClick={handleDropdown}
        >
          <span
            className={`link-span ${params ? "params-select" : "unset-params"} ${
              selectedAsset ? "asset-selected" : ""
            }`}
          >
            {selectedAsset ? (
              <div className="selected__link">
                <div className="selected__link__item">
                  <img
                    src={selectedAsset.logo}
                    alt="logo"
                    className="selected__link__icon"
                  />
                  <p className="selected__link__name">{selectedAsset.name}</p>
                </div>
                <p></p>
              </div>
            ) : (
              "Solana Assets"
            )}
          </span>
          {!params && (
            <img
              src={"/assets/svg/dropdown.svg"}
              alt="dropdown"
              className="dropdown__icon"
            />
          )}
        </div>
        {showDropdownItems && loading && (
          <div className="owned__assets">
            <CustomHashLoader />
          </div>
        )}
        {showDropdownItems && error && (
          <div className="owned__assets error__container">
            <p>There was an error fetching your assets</p>
          </div>
        )}
        {showDropdownItems && !loading && !error && (
          <div className="owned__assets">
            <div>
              <h3>Tokens</h3>
              {tokens?.length > 0 ? (
                tokens.map((asset: Asset, i: number) => (
                  <div
                    className="owned__assets__item"
                    key={i}
                    onClick={() => {
                      if (params) return;
                      handleSelectAsset(asset);
                    }}
                  >
                    <OptionLabel key={i} option={asset} />
                  </div>
                ))
              ) : (
                <p>There are no tokens in this wallet</p>
              )}
            </div>

            <div className="nfts__container">
              <h3>NFTs</h3>
              {nfts.length > 0 ? (
                nfts.map((nft: Asset, i: number) => (
                  <OptionLabel key={i} option={nft} />
                ))
              ) : (
                <p>There are no nfts in this wallet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AssetsShowcaseContainer>
  );
};

export default AssetsShowcase;
