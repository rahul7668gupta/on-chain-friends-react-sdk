import { fetchQuery } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript

const nftDetailsQuery = `
query MyQuery($tokenAddress: Address, $tokenId: String, $blockchain: TokenBlockchain!) {
  TokenNfts(
    input: {filter: {address: {_eq: $tokenAddress}, tokenId: {_eq: $tokenId}}, blockchain: $blockchain}
  ) {
    TokenNft {
      id
      address
      tokenId
      blockchain
      chainId
      type
      token{
        totalSupply
        type
      }
      lastTransferTimestamp
      lastTransferBlock
      lastTransferHash
      tokenURI
      contentType
      contentValue {
        image {
          small
        }
      }
      metaData {
        name
        description
        image
        attributes {
          trait_type
          value
          displayType
          maxValue
        }
      }
      rawMetaData
      lastTransferHash
      lastTransferBlock
      lastTransferTimestamp
    }
  }
}
`;

const fetchNftDetails = async (tokenAddress, tokenId, blockchain, query = nftDetailsQuery) => {
  let res = await fetchQuery(query, {
    tokenAddress,
    tokenId,
    blockchain
  });
  if (!res.error && res.data.TokenNfts.TokenNft.length > 0) {
    return res.data.TokenNfts.TokenNft[0];
  } else {
    console.log(res.error);
    return null;
  }
};

export default fetchNftDetails;