// @ts-nocheck
import CustomButton from "../Button";
import { HeaderContainer, LogoContainer, HeaderAddons } from "./Header.styles";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useAppKit,
  useAppKitAccount,
  useWalletInfo,
} from "@reown/appkit/react";

export const Header = () => {
  const navigate = useNavigate();

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();
  const location = useLocation();

  return (
    <HeaderContainer>
      <LogoContainer onClick={() => navigate("/")}>
        <img src={"/assets/svg/logo.svg"} alt="logo" />
        <h2>LinkSafe</h2>
      </LogoContainer>
      <HeaderAddons>
        {location.pathname === "/" ? (
          <a
            href="https://docs.reown.com/?_gl=1*14qp0s1*_ga*NzI3OTI3Mzk1LjE3MzY1MjA2NjM.*_ga_X117BZWK4X*MTczNzIxMDA1OS4zLjEuMTczNzIxMDA1OS4wLjAuMA.."
            target="_blank"
            className="target__blank"
            rel="noreferrer"
          >
            <div className="header__addons__items">
              <span>Documentation</span>
            </div>
          </a>
        ) : null}

        <CustomButton
          variant="filled"
          type="button"
          onClick={() => (isConnected ? open({ view: "Account" }) : open())}
          className={
            isConnected ? "address__button address__main" : "address__main"
          }
        >
          {isConnected ? (
            <>
              <span className="address__">
                {address?.substring(0, 5)}...
                {address?.substring(54, 57)}
              </span>
              {walletInfo?.icon && (
                <img
                  // src="/assets/png/sol.png"
                  src={walletInfo.icon}
                  alt="solana"
                  className="solana__icon"
                />
              )}
            </>
          ) : (
            "Connect"
          )}
        </CustomButton>
      </HeaderAddons>
    </HeaderContainer>
  );
};

export default Header;
