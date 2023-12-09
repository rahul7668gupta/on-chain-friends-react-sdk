# Airstack On-Chain Friends SDK (by Compound VR EthIndia 2023)

## Description

This repository contains a set of scripts and utilities for fetching, processing, and visualizing blockchain-related data. The primary focus is on fetching on-chain graph data, calculating scores for users, transforming data for visualization, and fetching details about NFTs (Non-Fungible Tokens) and POAP (Proof of Attendance Protocol) events.

## Getting Started

To use this project, follow the steps below:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Hrishikesh-Thakkar/compound-vr-eth-india-2023-sdk.git
   cd compound-vr-eth-india-2023-sdk

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your environment variables:**

    ***Create a .env file in the root of the project and add your Airstack API key:***

    ```
    AIRSTACK_API_KEY=your-api-key
    IDENTITY_OR_ADDRESS=your-identity-or-address
    ```

4. **Get data in .json files:**
    1. On ChainGraph Data
    2. Transformed onchain graph data for visualization graph
    3. Token Nft data by tokenAddress and tokenId
    4. POAP event data by eventId and blockchain

5. **Run the following command to see above data for given identity in json files:**
      ```bash
      npm run fetch
      ```

## Note
**Above command will fetch data for given identity and store it in json files in root folder.**
- `onChainGraphUsers.json`: OnChainGraph Data for given identity
- `onChainGraphWithScore.json`: OnChainGraph Data with score for given identity
- `visualisationData.json`: Transformed onchain graph data for visualization graph for given identity
- `nft.json`: Token Nft data by tokenAddress, tokenId and blockchain
- `poapEvent.json`: POAP event data by eventId and blockchain

### Functions

- `fetchOnChainGraphData(identityOrAddress):[recommendedUsers]`: Fetches onchain graph data for a given identity or address as input and returns onchain graph data
- `transformData(recommendedUsers, limit):{ nodes, links }`: Takes onchain graph data with score and limit of data to be used as input and returns transformed data for visualization graph in the form of nodes and links
- `calculatingScore(recommendedUser, weightsMap):{...recommendedUser, score}`: Takes a recommended user, weightsMap(optional) as input and returns it with a score based on weights of different parameters
- `createAddressMap(recommendedUsers):{address: recommendedUser}`: Takes onchain graph data as input and returns a map of address to recommended user for easy access of user details in visualisation graph
- `fetchNftDetails(tokenAddress, tokenId, blockchain):{...nftDetails}`: Takes tokenAddress, tokenId and blockchain as input and returns NFT details
- `fetchPoapEventDetails(eventId, blockchain):{...poapEventDetails}`: Takes eventId and blockchain as input and returns POAP event details
- `airstack`: A wrapper around the @airstack/node sdk so you don't have to install it separately