# Thirdweb Wallet Connection and Contract Writing

<!-- cspell:ignore Eeuo ltnp -->

Contract writing is enabled by the Dakota Network Explorer frontend. Thirdweb
provides the wallet connection experience, and the official Thirdweb Wagmi
adapter makes the connected account available to the explorer's existing Wagmi
contract interaction flow.

The branded frontend supports Google, Apple, email, MetaMask, Coinbase,
and WalletConnect-compatible wallets. It requires this runtime variable:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=0e4af511c829602455e0dc651b354649
```

Do not add `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`. That variable belonged to
the previous Reown integration and is not used by the Thirdweb-enabled frontend.

`NEXT_PUBLIC_WEB3_WALLETS=none` may remain in the Dakota configuration. It only
disables Blockscout's separate add-network and add-token browser-extension
helpers; it does not disable Thirdweb wallet connection or contract writing.

## 1. Configure the Thirdweb application

The Thirdweb client ID is public by design. Never place a private key, seed
phrase, admin credential, or server secret in a `NEXT_PUBLIC_*` variable.

In the Thirdweb dashboard, restrict the client to the origins that use it:

```text
https://explore.dakota.cards
http://localhost:3010
```

The localhost origin is needed only for local development. Keep the production
domain restriction in place before deploying publicly.

## 2. Back up and update the production environment

Create a timestamped backup before changing the existing environment:

```bash
THIRDWEB_CLIENT_ID='0e4af511c829602455e0dc651b354649'
TS="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="/srv/backups/dakota-enable-thirdweb-${TS}"

sudo mkdir -p "${BACKUP_DIR}"
sudo cp -a \
  /etc/blockscout/frontend.env \
  "${BACKUP_DIR}/frontend.env.before-thirdweb.bak"

echo "Backup created at ${BACKUP_DIR}/frontend.env.before-thirdweb.bak"
```

Update the existing environment without replacing unrelated explorer settings:

```bash
sudo env THIRDWEB_CLIENT_ID="${THIRDWEB_CLIENT_ID}" bash <<'EOF'
set -Eeuo pipefail

ENV_FILE="/etc/blockscout/frontend.env"

set_env() {
  local key="$1"
  local value="$2"
  local tmp="${ENV_FILE}.tmp"

  grep -v -E "^${key}=" "${ENV_FILE}" > "${tmp}" || true
  printf '%s=%s\n' "${key}" "${value}" >> "${tmp}"
  mv "${tmp}" "${ENV_FILE}"
}

remove_env() {
  local key="$1"
  local tmp="${ENV_FILE}.tmp"

  grep -v -E "^${key}=" "${ENV_FILE}" > "${tmp}" || true
  mv "${tmp}" "${ENV_FILE}"
}

# Enables Thirdweb wallet connection and explorer contract writing.
set_env NEXT_PUBLIC_THIRDWEB_CLIENT_ID "${THIRDWEB_CLIENT_ID}"

# This legacy helper is independent of Thirdweb and may remain disabled.
set_env NEXT_PUBLIC_WEB3_WALLETS "none"

# Remove obsolete Reown settings so the active provider is unambiguous.
remove_env NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
remove_env NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS

# Confirm the Dakota chain definition exposed to Thirdweb and Wagmi.
set_env NEXT_PUBLIC_NETWORK_NAME '"Dakota Network"'
set_env NEXT_PUBLIC_NETWORK_SHORT_NAME "Dakota"
set_env NEXT_PUBLIC_NETWORK_ID "112311"
set_env NEXT_PUBLIC_NETWORK_RPC_URL "https://rpc1.dakota.cards"
set_env NEXT_PUBLIC_NETWORK_CURRENCY_NAME '"Dakota Coin"'
set_env NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL "KOTA"
set_env NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS "18"

chown root:blockscout "${ENV_FILE}"
chmod 0640 "${ENV_FILE}"

grep -E \
  '^(NEXT_PUBLIC_THIRDWEB_CLIENT_ID|NEXT_PUBLIC_WEB3_WALLETS|NEXT_PUBLIC_NETWORK_NAME|NEXT_PUBLIC_NETWORK_ID|NEXT_PUBLIC_NETWORK_RPC_URL|NEXT_PUBLIC_NETWORK_CURRENCY_NAME|NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL)=' \
  "${ENV_FILE}"
EOF
```

## 3. Deploy the Thirdweb-enabled frontend

The first Thirdweb deployment must use a new production build because the
provider and Wagmi adapter are part of the application code. Adding the client
ID to an older Reown build does not convert that build to Thirdweb.

Use the normal Dakota Explorer deployment script after adding this line to its
environment update block:

```bash
set_env NEXT_PUBLIC_THIRDWEB_CLIENT_ID "0e4af511c829602455e0dc651b354649"
```

Remove any lines that set these obsolete Reown variables:

```text
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS
```

The deployment must continue to:

1. Copy `/etc/blockscout/frontend.env` to the release `.env.local` file.
2. Export the production environment before running `pnpm build:next`.
3. Run `./deploy/scripts/make_envs_script.sh` to generate
   `public/assets/envs.js`.
4. Copy `public` and `.next/static` into the standalone release.
5. Restart `blockscout-frontend`.

After deployment, verify the service locally on the host:

```bash
sudo systemctl restart blockscout-frontend
sleep 8

sudo systemctl status blockscout-frontend --no-pager -l || true
sudo ss -ltnp | grep ':3000' || true
curl -I http://127.0.0.1:3000
```

Once a Thirdweb-enabled build is deployed, a later client ID change is a
runtime-only update. Regenerate `public/assets/envs.js`, refresh the standalone
public assets, and restart the service using the same deployment steps.

## 4. Confirm the public runtime configuration

Confirm that the deployed frontend exposes the Thirdweb client ID and Dakota
chain settings:

```bash
curl -sS \
  "https://explore.dakota.cards/assets/envs.js?bust=$(date +%s)" \
  | grep -E \
    'NEXT_PUBLIC_THIRDWEB_CLIENT_ID|NEXT_PUBLIC_WEB3_WALLETS|NEXT_PUBLIC_NETWORK_ID|NEXT_PUBLIC_NETWORK_RPC_URL|NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL'
```

Expected values include:

```text
NEXT_PUBLIC_THIRDWEB_CLIENT_ID: "0e4af511c829602455e0dc651b354649"
NEXT_PUBLIC_WEB3_WALLETS: "none"
NEXT_PUBLIC_NETWORK_ID: "112311"
NEXT_PUBLIC_NETWORK_RPC_URL: "https://rpc1.dakota.cards"
NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL: "KOTA"
```

Also confirm that the obsolete Reown key is not present:

```bash
if curl -sS \
  "https://explore.dakota.cards/assets/envs.js?bust=$(date +%s)" \
  | grep -q 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'; then
  echo "ERROR: Obsolete Reown configuration is still present."
  exit 1
fi
```

## 5. Configure local development on port 3010

Add the Thirdweb client ID to the existing `.env.local` file without changing
the Dakota API, RPC, chain, or branding variables:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=0e4af511c829602455e0dc651b354649
```

Start the branded explorer:

```bash
pnpm dev:3010
```

The `dev:3010` script generates local `public/assets/envs.js` from `.env.local`
before starting Next.js. Verify both the app and runtime value:

```bash
curl -I http://localhost:3010
curl -sS http://localhost:3010/assets/envs.js \
  | grep 'NEXT_PUBLIC_THIRDWEB_CLIENT_ID'
```

## 6. Verify the explorer RPC route

A wallet can connect successfully while contract reads, simulations, or writes
still fail because of the explorer RPC route. Verify the same-origin route used
by the public frontend:

```bash
curl -sS \
  -H 'Origin: https://explore.dakota.cards' \
  -H 'Content-Type: application/json' \
  https://explore.dakota.cards/api/eth-rpc \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  | jq .
```

Expected response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1b6b7"
}
```

Test a real contract read:

```bash
curl -sS \
  -H 'Origin: https://explore.dakota.cards' \
  -H 'Content-Type: application/json' \
  https://explore.dakota.cards/api/eth-rpc \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
      {
        "to": "0x0000000000000000000000000000000000001111",
        "data": "0xb7ab4db5"
      },
      "latest"
    ],
    "id": 2
  }' \
  | jq .
```

If this route returns `403` or non-JSON output, Thirdweb may still connect, but
the explorer's read and simulation stages can fail. Correct the
`/api/eth-rpc` Cloudflare and Nginx path before relying on contract interaction.

## 7. Connect a wallet and write to a contract

Open a verified contract page, for example:

```text
https://explore.dakota.cards/address/0x0000000000000000000000000000000000001111
```

Then:

1. Open the **Contract** section.
2. Select **Write Contract** or **Read/Write Contract**.
3. Click **Connect wallet**.
4. Choose Google, Apple, email, MetaMask, Coinbase, or WalletConnect.
5. Approve the connection or complete the Thirdweb sign-in flow.
6. Approve the switch to Dakota Network if an external wallet requests it.
7. Expand the contract method and enter its arguments.
8. Click **Write**.
9. Review the destination, method data, value, and gas estimate.
10. Confirm the transaction in the connected wallet.

The connected account must:

- Have enough `KOTA` for gas.
- Be connected to chain ID `112311`.
- Be authorized for the selected contract method.

Owner-, voter-, validator-, or role-restricted methods revert when called from
an unauthorized account. Thirdweb changes how the user connects; it does not
bypass contract permissions or transaction confirmation.

## 8. Add Dakota Network to an external wallet when needed

Thirdweb should request the Dakota Network switch for supported external
wallets. If an injected wallet does not add the chain automatically, use:

```text
Network name: Dakota Network
Default RPC URL: https://rpc1.dakota.cards
Chain ID: 112311
Currency symbol: KOTA
Block explorer URL: https://explore.dakota.cards
```

Thirdweb in-app wallets created through Google, Apple, or email do not require
the user to add a network manually in a separate browser extension.

## 9. Confirm transaction submission support

The connected wallet signs locally, but the Dakota RPC must accept submitted
transactions:

```bash
curl -sS https://rpc1.dakota.cards \
  -H 'Content-Type: application/json' \
  --data '{
    "jsonrpc": "2.0",
    "method": "rpc_modules",
    "params": [],
    "id": 1
  }' \
  | jq .
```

The response should include the `eth` module. Do not test
`eth_sendRawTransaction` without a real signed transaction.

## Configuration distinction

This variable enables the Thirdweb connection used by contract writing:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=0e4af511c829602455e0dc651b354649
```

This separate variable only controls legacy add-network and add-token helpers:

```bash
NEXT_PUBLIC_WEB3_WALLETS=none
```

The complete contract-writing flow also requires a Thirdweb-enabled production
build, valid Dakota chain settings, a working explorer RPC route, an authorized
account, and enough `KOTA` for gas.
