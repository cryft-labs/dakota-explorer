import config from 'src/config';
import dedent from 'dedent';
import { layerLabels } from 'src/features/rollup/common/utils/layer';

export function generateStandard(): string {
    const chainName = config.chain.name ?? '';
    const chainId = config.chain.id ?? '';
    const coreApiUrl = config.apis.core ? config.apis.core.endpoint + config.apis.core.basePath : '';
    const statsApiUrl = config.apis.stats ? config.apis.stats.endpoint + config.apis.stats.basePath : undefined;

    const rollupFeature = config.features.rollup;
    const parentChainUrl = rollupFeature.isEnabled ? rollupFeature.parentChain.baseUrl : undefined;
    const currentToParentLayerLabel = layerLabels.current + '→' + layerLabels.parent;
    const parentToCurrentLayerLabel = layerLabels.parent + '→' + layerLabels.current;

    const validatorsFeature = config.features.validators;

    const GENERAL_COUNTERS_TEMPLATE = statsApiUrl ? `
        ### General Counters

        \`\`\`bash
        curl --request GET --url '${statsApiUrl}/api/v1/counters'
        \`\`\`
    ` : '{blank}';

    const USER_OPS_TEMPLATE = config.features.userOps.isEnabled ? `
        ### Account Abstraction info

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/proxy/account-abstraction/accounts/{account_address}'
        \`\`\`

        ### User Operations by Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/proxy/account-abstraction/operations?sender={account_address}'
        \`\`\`

        ### User Operations by Transaction

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/proxy/account-abstraction/operations?transaction_hash={transaction_hash}'
        \`\`\`

        ### User Operation Details

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/proxy/account-abstraction/operations/{user_operation_hash}'
        \`\`\`
    ` : '{blank}';

    const BEACON_CHAIN_TEMPLATE = config.features.beaconChain.isEnabled ? `
        ### Deposits by Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/beacon/deposits'
        \`\`\`

        ### Deposits by Block

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/blocks/{block_hash_or_number}/beacon/deposits'
        \`\`\`

        ### Withdrawals by Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/withdrawals'
        \`\`\`

        ### Withdrawals by Block

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/blocks/{block_number}/withdrawals'
        \`\`\`
    ` : undefined;

    const ARBITRUM_CHAIN_TEMPLATE = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' ? `
        ### Latest Committed Batch Number

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/main-page/arbitrum/batches/latest-number'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/arbitrum/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/blocks/arbitrum-batch/{batch_number}'
        \`\`\`

        ### Get ${parentToCurrentLayerLabel} messages

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/arbitrum/messages/to-rollup'
        \`\`\`

        ### Get ${currentToParentLayerLabel} messages

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/arbitrum/messages/from-rollup'
        \`\`\`

        ### ${currentToParentLayerLabel} messages by transaction:

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/arbitrum/messages/withdrawals/{transactions_hash}'
        \`\`\`
    ` : undefined;

    const OPTIMISM_CHAIN_TEMPLATE = rollupFeature.isEnabled && rollupFeature.type === 'optimistic' ? `
        ### Latest Committed Batch Number (top of)

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/optimism/batches'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/optimism/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch (TODO: not needed if the batch returns blocks range)

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/blocks/optimism-batch/{batch_number}'
        \`\`\`

        ### Dispute Games

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/optimism/games'
        \`\`\`

        ### Get ${parentToCurrentLayerLabel} messages

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/optimism/deposits'
        \`\`\`

        ### Get ${currentToParentLayerLabel} messages

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/optimism/withdrawals'
        \`\`\`
    ` : undefined;

    const CELO_CHAIN_TEMPLATE = config.features.celo.isEnabled ? `
        ### Latest Finalized Epoch (top of)

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/celo/epochs'
        \`\`\`

        ### Get Epoch Information

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/celo/epochs/{epoch_number}'
        \`\`\`

        ### Validator Group Reward by Epoch

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/celo/epochs/{epoch_number}/election-rewards/group'
        \`\`\`

        ### Validator Rewards by Epoch

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/celo/epochs/{epoch_number}/election-rewards/validator'
        \`\`\`

        ### Voting Rewards by Epoch

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/celo/epochs/{epoch_number}/election-rewards/voter'
        \`\`\`
    ` : undefined;

    const ZKSYNC_CHAIN_TEMPLATE = rollupFeature.isEnabled && rollupFeature.type === 'zkSync' ? `
        ### Latest Committed Batch Number

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/main-page/zksync/batches/latest-number'
        \`\`\`

        ### Batch info

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/zksync/batches/{batch_number}'
        \`\`\`
    ` : undefined;

    const TAC_CHAIN_TEMPLATE = config.features.tac.isEnabled && config.apis.tac ? `
        ### TAC Operations:

        \`\`\`bash
        curl --request GET --url '${config.apis.tac.endpoint}/api/v1/tac/operations'
        \`\`\`

        ### TAC Operation Info:

        \`\`\`bash
        curl --request GET --url '${config.apis.tac.endpoint}/api/v1/tac/operations/{operation_id}'
        \`\`\`
    ` : undefined;

    const SCROLL_CHAIN_TEMPLATE = rollupFeature.isEnabled && rollupFeature.type === 'scroll' ? `
        ### Latest Committed Batch Number (top of)

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/scroll/batches'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/scroll/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/blocks/scroll-batch/{batch_number}'
        \`\`\`

        ### Deposits (${parentToCurrentLayerLabel})

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/scroll/deposits'
        \`\`\`

        ### Withdrawals (${currentToParentLayerLabel})

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/scroll/withdrawals'
        \`\`\`
    ` : undefined;

    const SHIBARIUM_CHAIN_TEMPLATE = rollupFeature.isEnabled && rollupFeature.type === 'shibarium' ? `
        ### Deposits (${parentToCurrentLayerLabel})

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/shibarium/deposits'
        \`\`\`

        ### Withdrawals (${currentToParentLayerLabel})

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/shibarium/withdrawals'
        \`\`\`
    ` : undefined;

    const ZILLIQA_CHAIN_TEMPLATE = validatorsFeature.isEnabled && validatorsFeature.chainType === 'zilliqa' ? `
        ### Validators list:

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/validators/zilliqa'
        \`\`\`

        ### Validator Info:

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/validators/zilliqa/{validator_public_key}'
        \`\`\`
    ` : undefined;

    const STABILITY_CHAIN_TEMPLATE = validatorsFeature.isEnabled && validatorsFeature.chainType === 'stability' ? `
        ### Validators list:

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/validators/stability'
        \`\`\`
    ` : undefined;

    const CHAIN_SPECIFIC_DATA = [
        BEACON_CHAIN_TEMPLATE,
        ARBITRUM_CHAIN_TEMPLATE,
        OPTIMISM_CHAIN_TEMPLATE,
        CELO_CHAIN_TEMPLATE,
        ZKSYNC_CHAIN_TEMPLATE,
        TAC_CHAIN_TEMPLATE,
        SCROLL_CHAIN_TEMPLATE,
        ZILLIQA_CHAIN_TEMPLATE,
        STABILITY_CHAIN_TEMPLATE,
        SHIBARIUM_CHAIN_TEMPLATE,
    ].filter(Boolean);

    const CHAIN_SPECIFIC_TEMPLATE = CHAIN_SPECIFIC_DATA.length > 0 ? `
        ## Chain-Specific Data
        ${ CHAIN_SPECIFIC_DATA.join('\n') }
    ` : '{blank}';

    const MAIN_TEMPLATE = dedent`
        # Cryft Network Explorer - ${chainName}

        Blockscout is a human-friendly blockchain explorer for EVM-compatible networks. It lets users browse blocks, transactions, addresses, tokens (ERC-20/721/1155), logs, contract ABIs, and decoded contract interactions. While the site is primarily designed for people, all rendered information is backed by API endpoints that machines can consume. Large Language Models should prefer the LLM-ready endpoints listed below to retrieve precise, structured data.

        Chain name: ${chainName}
        Chain ID: ${chainId}
        ${parentChainUrl ? `Settlement layer Blockscout URL: ${parentChainUrl}` : '{blank}'}

        ## General LLM-ready Data

        The links below are this explorer's own REST API (Blockscout API v2), read-only and JSON. Limits: 10 requests a second per client (burst 100); a 429 carries \`Retry-After\`.

        ### Specific Block Info

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/blocks/{block_number_or_hash}'
        curl --request GET --url '${coreApiUrl}/api/v2/blocks/{block_number_or_hash}/transactions'
        \`\`\`

        ### Transaction Info, Logs and Summary

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/transactions/{transaction_hash}'
        curl --request GET --url '${coreApiUrl}/api/v2/transactions/{transaction_hash}/logs'
        curl --request GET --url '${coreApiUrl}/api/v2/transactions/{transaction_hash}/token-transfers'
        curl --request GET --url '${coreApiUrl}/api/v2/transactions/{transaction_hash}/summary'
        \`\`\`

        ### Address Info, Transactions and Token Transfers

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}'
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/transactions'
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/token-transfers'
        \`\`\`

        ### Tokens and NFTs Held by Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/tokens'
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/nft'
        \`\`\`

        ### Search (token symbol, address, hash, name)

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/search?q={query}'
        \`\`\`

        ### Smart Contract Source and ABI

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/smart-contracts/{contract_address}'
        \`\`\`

        ## Miscellaneous Blockchain Data

        ${GENERAL_COUNTERS_TEMPLATE}
        ### Gas Tracker

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/stats'
        \`\`\`

        ### Coin Balance History by Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/coin-balance-history-by-day'
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/coin-balance-history'
        \`\`\`

        ### Logs Emitted by Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/logs'
        \`\`\`

        ### Blocks Validated by Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/addresses/{account_address}/blocks-validated'
        \`\`\`
        ${USER_OPS_TEMPLATE}
        ### Holders By Token Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/tokens/{token_contract_address}/holders'
        \`\`\`

        ### NFT Inventory By Token Address

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/tokens/{token_contract_address}/instances'
        \`\`\`

        ### NFT Instance Info

        \`\`\`bash
        curl --request GET --url '${coreApiUrl}/api/v2/tokens/{token_contract_address}/instances/{instance_id}'
        curl --request GET --url '${coreApiUrl}/api/v2/tokens/{token_contract_address}/instances/{instance_id}/transfers'
        \`\`\`
        ${CHAIN_SPECIFIC_TEMPLATE}
        ## Additional Info

        - API reference: ${config.app.baseUrl}/api-docs
        - Explorer: ${config.app.baseUrl}
    `;

    return MAIN_TEMPLATE.replace('{blank}\n', '');
}
