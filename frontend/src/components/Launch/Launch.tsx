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
import { useAppKitAccount } from "@reown/appkit/react";
import { connection } from "../../hooks/useSolanaWalletTokens";

const REACT_APP_CLIENT_URL = import.meta.env.VITE_APP_CLIENT_URL;

const LaunchVault = () => {
  const [ownedAssets, setOwnedAssets] = useState({ assets: [], nfts: [] });
  const [vaultNobleLink, setVaultNobleLink] = useState(null);
  const [showDropdownItems, setShowDropdownItems] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [handleCopyAddress, setHandleCopyAddress] = useState(false);
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const location = useLocation();
  const { address, isConnected } = useAppKitAccount();

  // Fetch noble link for the vault
  const fetchVaultNobleLink = async () => {
    const nobleCurveKey = `${REACT_APP_CLIENT_URL}${location.pathname}`;
    try {
      const res = await getSafe(nobleCurveKey);
      if (!res) {
        setError(true);
        setIsLoading(false);
      }
      setVaultNobleLink(res);
      return res;
    } catch (err) {
      console.error("Error fetching Noble link:", err);
      setError(true);
    }
  };

  // Fetch available assets
  const fetchAvailableAssets = async () => {
    setIsLoading(true); // Ensure loading state is set at the beginning
    setError(false); // Reset error state before fetching

    try {
      const assets = await computeAssets(vaultNobleLink, connection);

      if (assets.error) {
        throw new Error("Failed to fetch assets or connection issue.");
      }

      setOwnedAssets({ assets: assets.assets || [], nfts: assets.nfts || [] });
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(true);
    } finally {
      setIsLoading(false); // Ensure loading is turned off in all cases
    }
  };
  // Fetch vault noble link on component mount
  useEffect(() => {
    (async () => {
      await fetchVaultNobleLink();
    })();
  }, []);

  // Fetch available assets when vaultNobleLink is updated
  useEffect(() => {
    if (vaultNobleLink) {
      fetchAvailableAssets();
    }
  }, [isConnected, vaultNobleLink]);

  // Handle claim action
  const handleClaim = async () => {
    try {
      await claimVault(vaultNobleLink, address, connection, ownedAssets);
      setShowPopup(false);
      setTimeout(() => window.location.reload(), 3200);
    } catch (err) {
      console.error("Error claiming assets:", err);
    }
  };

  return (
    <LaunchContainer>
      <div className="launch__">
        <div className="launch__header">
          <h3>Welcome,</h3>
        </div>
        <div className="launch__body">
          <AssetsShowcase
            loading={isLoading}
            error={error}
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
              className="deposit__button"
              onClick={() => setShowDepositPopup(true)}
            >
              Deposit
            </CustomButton>
            <CustomButton
              variant="filled"
              className="claim__button"
              disabled={ownedAssets.assets.length === 0}
              onClick={() => setShowPopup(true)}
            >
              Claim
            </CustomButton>
          </div>
        </div>
      </div>

      {showPopup && (
        <PopUp isOpen={showPopup} onClose={() => setShowPopup(false)}>
          <div className="popup__modal">
            <h2>Select withdrawal mode</h2>
            <div className="popup__container">
              <div className="popup__first" onClick={handleClaim}>
                <h3>via the connected wallet</h3>
                <p>Assets will be sent to the connected Solana wallet</p>
              </div>
              <div className="popup__second">
                <a
                  href={`https://remit-flex.netlify.app/app${location.pathname}${location.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h3>via Remit Flex</h3>
                  <p>
                    Make remittances and pay over 18,000 bill categories in
                    Africa
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
            <h2 className="deposit">Deposit assets via vault wallet address</h2>
            <div className="popup__container noble__link">
              <QRCode value={vaultNobleLink?.address || ""} />
              <CopyToClipboard text={vaultNobleLink?.address || ""}>
                <CustomButton
                  variant="filled"
                  className="button__transparent"
                  onClick={() => {
                    setHandleCopyAddress(true);
                    setTimeout(() => setHandleCopyAddress(false), 800);
                  }}
                >
                  {!handleCopyAddress ? (
                    <img
                      className="copy__icon"
                      src="/assets/svg/copy-created.svg"
                      alt="Copy address"
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <img
                      src="/assets/png/copy.png"
                      alt="Copied"
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
