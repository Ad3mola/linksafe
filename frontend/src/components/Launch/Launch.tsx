// @ts-nocheck

import { LaunchContainer } from "./Lauch.styles";
import CustomButton from "../Button";
import { getSafe } from "linksafe-sdk";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { computeAssets } from "../../utils/assets.utils";
import AssetsShowcase from "../Assets-Showcase";
import PopUp from "../Popup";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { claimVault } from "../../utils/integration";
import { LoadingState } from "../LoadingState/LoadingState";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
const REACT_APP_CLIENT_URL = import.meta.env.VITE_APP_CLIENT_URL;

const LaunchVault = () => {
  const [ownedAssets, setOwnedAssets] = useState<any>({ assets: [], nfts: [] });
  const [vaultNobleLink, setVaultNobleLink] = useState<any>(null);
  const [showDropdownItems, setShowDropdownItems] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [handleCopyAddress, setHandleCopyAddress] = useState(false);
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAppKitAccount();

  const { connection } = useAppKitConnection();

  const getSafeNobleLink = async () => {
    setIsLoading(true);
    const nobleCurveKey = `${REACT_APP_CLIENT_URL}${location.pathname}`;
    const res = await getSafe(nobleCurveKey);
    setVaultNobleLink(res);
    setIsLoading(false);
    return res;
  };

  const AVAILABLE_ASSETS = async () => {
    setIsLoading(true);
    const assets = await computeAssets(vaultNobleLink, connection);
    setOwnedAssets({ assets: assets.assets, nfts: assets.nfts });

    setIsLoading(false);
  };

  // const vaultLink =
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const result = await getSafeNobleLink();
      // if (!result) navigate("/");
    })();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!vaultNobleLink) return;
    AVAILABLE_ASSETS();
    setIsLoading(false);
  }, [vaultNobleLink]);

  const handleClaim = async () => {
    const vault: any = await claimVault(
      vaultNobleLink,
      address,
      connection,
      ownedAssets
    );

    setShowPopup(false);
    setTimeout(() => {
      window.location.reload();
    }, 3200);
  };

  return (
    <LaunchContainer>
      {isLoading ? (
        <LoadingState width={500} height={"50vh"} />
      ) : (
        <div className="launch__">
          <div className="launch__header">
            <h3>Welcome,</h3>
          </div>
          <div className="launch__body">
            <AssetsShowcase
              loading={false}
              error={null}
              ownedAssets={{
                tokens: ownedAssets.assets,
                nfts: ownedAssets.nfts,
              }}
              params={true}
              setShowDropdownItems={setShowDropdownItems}
              showDropdownItems={showDropdownItems}
            />
            <div className="buttons__container">
              <CustomButton
                variant="filled"
                type="button"
                className="deposit__button"
                onClick={() => setShowDepositPopup(true)}
              >
                Deposit
              </CustomButton>
              <CustomButton
                variant="filled"
                type="button"
                disabled={ownedAssets.assets.length === 0}
                className="claim__button"
                onClick={() => setShowPopup(true)}
              >
                Claim
              </CustomButton>
            </div>
          </div>
        </div>
      )}
      {showPopup && (
        <PopUp isOpen={showPopup} onClose={() => setShowPopup(false)}>
          <div className="popup__modal">
            <h2>Select withdrawal mode</h2>
            <div className="popup__container">
              <div className="popup__first" onClick={handleClaim}>
                <h3>via the connected wallet</h3>
                <p>Asset will be sent to the connected solana wallet</p>
              </div>
              <div className="popup__second">
                <a
                  href={`https://remit-flex.netlify.app/app${location.pathname}${location.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h3>via remit flex</h3>
                  <p>
                    Make remittances and pay over 18,000 bill categories in
                    africa
                  </p>
                </a>
              </div>
              <div className="popup__third">
                <h3>via gift card</h3>
                <p>Claim into your gift card</p>
              </div>
            </div>
          </div>
        </PopUp>
      )}
      {showDepositPopup && (
        <PopUp
          isOpen={showDepositPopup}
          onClose={() => setShowDepositPopup(false)}
        >
          <div className="popup__modal">
            <h2 className="deposit">Deposit asset via vault wallet address</h2>
            <div className="popup__container noble__link">
              <QRCode value={vaultNobleLink.address} />

              <CopyToClipboard text={vaultNobleLink.address}>
                <CustomButton
                  variant="filled"
                  className="button__transparent"
                  onClick={() => {
                    setHandleCopyAddress(!handleCopyAddress);
                    setTimeout(() => {
                      setHandleCopyAddress(false);
                    }, 800);
                  }}
                >
                  {!handleCopyAddress ? (
                    <img
                      className="copy__icon"
                      src="/assets/svg/copy-created.svg"
                      alt="link copy"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <img
                      src="/assets/png/copy.png"
                      alt="copy"
                      className="copy__icon"
                    />
                  )}
                  {"Copy Address"}
                </CustomButton>
              </CopyToClipboard>
            </div>
          </div>
        </PopUp>
      )}
    </LaunchContainer>
  );
};

export default LaunchVault;
