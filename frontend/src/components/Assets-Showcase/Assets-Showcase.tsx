import { useEffect, useRef } from "react";
import { Asset } from "../../utils/assets.utils";
import OptionLabel from "../Option-Label";
import { AssetsShowcaseContainer } from "./Assets-Showcase.styles";
import { errorToast } from "../../utils/customToast";
import { useAppKitAccount } from "@reown/appkit/react";

interface OwnedAssets {
  ownedAssets: {
    tokens: Asset[];
    nfts: Asset[];
  };
  params: boolean;
  handleSelectAsset?: (asset: Asset) => void;
  selectedAsset?: any;
  showDropdownItems: boolean;
  setShowDropdownItems: any;
}

export const AssetsShowcase: React.FC<OwnedAssets> = ({
  ownedAssets: { tokens, nfts },
  params,
  handleSelectAsset,
  selectedAsset,
  showDropdownItems,
  setShowDropdownItems,
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
              "Solana assets"
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
        {showDropdownItems && (
          <div className="owned__assets">
            <h3>Tokens</h3>
            {tokens.length > 0 &&
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
              ))}
            <h3>Nfts</h3>
            {nfts.length > 0 ? (
              nfts.map((nft: Asset, i: number) => (
                <OptionLabel key={i} option={nft} />
              ))
            ) : (
              <p>There are no nfts in this wallet</p>
            )}
          </div>
        )}
      </div>
    </AssetsShowcaseContainer>
  );
};

export default AssetsShowcase;
