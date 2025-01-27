// @ts-nocheck

import { useEffect, useState, useRef } from "react";
import Card from "../Card";

import { computeAssets, Asset, NFT } from "../../utils/assets.utils";
import CustomButton from "../Button";
import { useSelector, useDispatch } from "react-redux";
import { createSafe } from "linksafe-sdk";
import { useNavigate } from "react-router-dom";
import { CreatedLinkContainer } from "./Create-link.styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import AssetsShowcase from "../Assets-Showcase";
import { PeraWalletConnect } from "@perawallet/connect";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import PopUp from "../Popup/Popup";
import { errorToast, successToast } from "../../utils/customToast";
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";
import useSolanaTokensAndNFTs from "../../hooks/useSolanaWalletTokens";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

const CreateLink = () => {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showDropdownItems, setShowDropdownItems] = useState(false);
  const [createdVault, setCreatedVault] = useState<any>(null);
  const [handleCopyAddress, setHandleCopyAddress] = useState(false);
  const [amount, setAmount] = useState(null);
  const [isVaultResolved, setIsVaultResolved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { address, status } = useAppKitAccount();

  const { caipNetwork } = useAppKitNetwork();

  const network = (caipNetwork as any).network;

  const { tokens, nfts, loading, error } = useSolanaTokensAndNFTs(
    address,
    network
  );

  const { connection } = useAppKitConnection();

  const { walletProvider } = useAppKitProvider<Provider>("solana");

  useEffect(() => {
    if (status === "disconnected") {
      setSelectedAsset(null);
    }
  }, [status]);

  const AVAILABLE_ASSETS = async () => {
    const assets = await computeAssets(address, connection);
    setOwnedAssets(assets ?? { tokens: [], nfts: [] });
  };

  useEffect(() => {
    if (!address) return;
    AVAILABLE_ASSETS();
  }, [address]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "",
          text: "share your link vault with who you want to tip or gift (if there is an asset in the link 😄)",
          url: createdVault?.safe,
        });
        console.log("Successfully shared");
      } else {
        console.log("Web Share API not supported");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDropdown = () => {
    if (!address) {
      errorToast("Please connect your wallet");
      return;
    }
    setShowDropdownItems(!showDropdownItems);
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDropdownItems(false);
  };

  const createEmptyLinkVault = async () => {
    const createdVault = await createSafe();
    if (createdVault.address) {
      setCreatedVault(createdVault);
      successToast("Link created successfully");
      setIsVaultResolved(true);
    }
  };

  const createSafeAndFund = async () => {
    if (!address) return errorToast("Please connect your wallet");
    if (!selectedAsset)
      return errorToast(
        "Please select a token you want to fund your vault with"
      );
    if (!amount)
      return errorToast("Please enter an amount to fund your vault with");
    if (selectedAsset.amount < amount)
      return errorToast(
        `You do not have sufficient balance to make this transaction`
      );
    try {
      const publicKey = new PublicKey(address);
      const mintPublicKey = new PublicKey(selectedAsset.mint);

      const createdVault = await createSafe();

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      // Create transaction with required parameters
      const transaction = new Transaction({
        feePayer: publicKey,
        blockhash,
        lastValidBlockHeight,
      });

      if (createdVault.address) {
        const sourceTokenAccount = await getAssociatedTokenAddress(
          mintPublicKey,
          publicKey
        );

        const vaultTokenAccount = await getAssociatedTokenAddress(
          mintPublicKey,
          new PublicKey(createdVault.address)
        );

        transaction
          .add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              vaultTokenAccount,
              new PublicKey(createdVault.address),
              mintPublicKey
            )
          )
          .add(
            createTransferInstruction(
              sourceTokenAccount,
              vaultTokenAccount,
              publicKey,
              amount
            )
          );

        const signedTx = await walletProvider.signTransaction(transaction, [
          publicKey,
        ]);

        const signature = await connection.sendRawTransaction(
          signedTx.serialize()
        );

        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });

        successToast(`Transaction confirmed: ${signature}`);

        if (signature) {
          successToast("Solana Vault created and funded!");
          setCreatedVault({
            safe: vaultAccount.publicKey.toString(),
            address: vaultAccount.publicKey.toString(),
          });
          setIsVaultResolved(true);
          setCreatedVault(createdVault);
          successToast("Link created successfully");
        }
      }
    } catch (error) {
      errorToast(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <>
      {!isVaultResolved ? (
        <Card>
          <h2>Create a linkSafe</h2>
          <AssetsShowcase
            loading={loading}
            error={error}
            ownedAssets={{
              tokens,
              nfts,
            }}
            params={false}
            handleSelectAsset={handleSelectAsset}
            selectedAsset={selectedAsset}
            showDropdownItems={showDropdownItems}
            setShowDropdownItems={setShowDropdownItems}
          />
          <div className="link__amount">
            <h3>Amount</h3>
            <input
              type="number"
              placeholder={selectedAsset ? `0 ${selectedAsset.name}` : "0"}
              className="input__amount"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="empty__link" onClick={createEmptyLinkVault}>
            Create an empty link to fund later?
          </p>
          <CustomButton
            variant="filled"
            type="button"
            onClick={createSafeAndFund}
          >
            Create
          </CustomButton>
        </Card>
      ) : (
        <CreatedLinkContainer>
          <img src="/assets/svg/link-created.svg" alt="link created" />
          <h2> Link Created!</h2>
          <a href={createdVault?.safe} target="_blank" rel="noreferrer">
            <p className="link__address">{`${createdVault?.safe.substring(0, 36)}...`}</p>
          </a>
          <div className="buttons__container">
            <CopyToClipboard text={createdVault?.safe}>
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
                {"Copy Link"}
              </CustomButton>
            </CopyToClipboard>
            <CustomButton className="button__transparent" onClick={handleShare}>
              <img
                src="/assets/svg/share-link.svg"
                alt="share"
                className="copy__icon"
              />
              Share Link
            </CustomButton>
          </div>
          <div className="qr__container">
            <QRCode value={createdVault?.safe} />
          </div>
        </CreatedLinkContainer>
      )}
      {showPopup && (
        <PopUp isOpen={showPopup} onClose={() => setShowPopup(false)}>
          <div className="popup__modal">
            <h2>Select withdrawal mode</h2>
            <div className="popup__first">
              <h3>via the connected wallet</h3>
              <p>Asset will be sent to the connected Solana wallet</p>
            </div>
            <div className="popup__second">
              <h3>via Remit flex</h3>
              <p>
                Make remittances and pay over 18,000 bill categories in africa
              </p>
            </div>
          </div>
        </PopUp>
      )}
    </>
  );
};

export default CreateLink;
