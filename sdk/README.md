```markdown
# LinkSafe SDK

LinkSafe SDK allows you to interact with Solana blockchain wallets in a secure and efficient manner. It supports the creation of wallets, resolving wallets from secure links, and fetching the SOL and token balances associated with a wallet.

## Features

- **Generate a new Solana wallet** and encode the private key into a secure, link-safe format.
- **Resolve an existing link-safe** to retrieve the wallet's public key, private key, and balances.
- **Fetch token balances** for a wallet, including SPL token balances.

## Installation

To install the SDK, run the following command in your project directory:

```bash
npm install linksafe-sdk
```

## Usage

### 1. **Creating a New Link-Safe**

This function generates a new Solana wallet, encodes the private key in Base58 format, and returns a secure link to access the wallet.

```ts
import { createSafe } from "linksafe-sdk";

const safe = await createSafe();
console.log(safe);
```

**Response:**

```json
{
  "address": "SOLANA_PUBLIC_KEY",
  "safe": "https://linksafe-reown.vercel.app/lnv/SafeKeyHere"
}
```

### 2. **Resolving a Link-Safe**

This function resolves a link-safe by decoding the Base58 encoded private key and fetching the wallet's public key and token balances.

```ts
import { getSafe } from "linksafe-sdk";

const wallet = await getSafe("https://linksafe-reown.vercel.app/lnv/SafeKeyHere");
console.log(wallet);
```

**Response:**

```json
{
  "address": "SOLANA_PUBLIC_KEY",
  "linksafe": "https://linksafe-reown.vercel.app/lnv/SafeKeyHere",
  "keypair": {
    "privateKey": "PRIVATE_KEY_HEX",
    "publicKey": "SOLANA_PUBLIC_KEY"
  },
  "balances": {
    "SOL": "100",
    "Token_Mint_Address_1": "50",
    "Token_Mint_Address_2": "10"
  }
}
```


## Contributing

We welcome contributions to the LinkSafe SDK! To contribute, please fork the repository, create a feature branch, and submit a pull request.

## License

MIT License. See [LICENSE](LICENSE) for more details.

---

> This SDK uses [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) and [@solana/spl-token](https://github.com/solana-labs/solana-program-library/tree/master/token) to interact with the Solana blockchain.
```

