import { init, fetchQueryWithPagination } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript
import formatPolygonNftDataUtil from "../utils/formatPolygonNftData.js";

// get your API key at https://app.airstack.xyz/profile-settings/api-keys


const nftAddressesQuery = `
query MyQuery($user: Identity!) {
  TokenBalances(input: {filter: {tokenType: {_in: [ERC721]}, owner: {_eq: $user}}, blockchain: polygon, limit: 200}) {
    TokenBalance {
      tokenAddress
    }
  }
}
`;

const nftQuery = `
query MyQuery($tokenAddresses: [Address!]) {
  TokenBalances(
    input: {filter: {tokenAddress: {_in: $tokenAddresses}, tokenType: {_in: [ERC721]}}, blockchain: polygon, limit: 200}
  ) {
    TokenBalance {
      token {
        name
        address
        tokenNfts {
          tokenId
        }
        blockchain
        logo {
          small
        }
      }
      owner {
        addresses
        domains {
          name
          isPrimary
        }
        socials {
          dappName
          blockchain
          profileName
          profileImage
          profileTokenId
          profileTokenAddress
        }
        xmtp {
          isXMTPEnabled
        }
      }
    }
  }
}
`;

const formatPolygonNftData = async (address, existingUsers = [], query1 = nftAddressesQuery, query2 = nftQuery) => {
  let polygonNftDataResponse;
  let recommendedUsers = [...existingUsers];
  while (true) {
    if (!polygonNftDataResponse) {
      // Pagination #1: Fetch Polygon NFTs
      polygonNftDataResponse = await fetchQueryWithPagination(
        query1,
        {
          user: address,
        }
      );
    }
    const {
      data: polygonNftData,
      error: polygonNftError,
      hasNextPage: polygonNftHasNextPage,
      getNextPage: polygonNftGetNextPage,
    } = polygonNftDataResponse ?? {};
    if (!polygonNftError) {
      const tokenAddresses =
        polygonNftData?.TokenBalances?.TokenBalance?.map(
          (token) => token.tokenAddress
        ) ?? [];
      let polygonNftHoldersDataResponse;
      while (true) {
        if (tokenAddresses.length === 0) break;
        if (!polygonNftHoldersDataResponse) {
          // Pagination #2: Fetch Polygon NFT Holders
          polygonNftHoldersDataResponse = await fetchQueryWithPagination(
            query2,
            {
              tokenAddresses,
            }
          );
        }
        const {
          data: polygonNftHoldersData,
          error: polygonNftHoldersError,
          hasNextPage: polygonNftHoldersHasNextPage,
          getNextPage: polygonNftHoldersGetNextPage,
        } = polygonNftHoldersDataResponse;
        if (!polygonNftHoldersError) {
          recommendedUsers = [
            ...formatPolygonNftDataUtil(
              polygonNftHoldersData?.TokenBalances?.TokenBalance,
              recommendedUsers
            ),
          ];
          // if (!polygonNftHoldersHasNextPage) {
          break;
          // } else {
          //   polygonNftHoldersDataResponse =
          //     await polygonNftHoldersGetNextPage();
          // }
        } else {
          console.error("Error: ", polygonNftHoldersError);
          break;
        }
      }
      if (!polygonNftHasNextPage) {
        break;
      } else {
        polygonNftDataResponse = await polygonNftGetNextPage();
      }
    } else {
      console.error("Error: ", polygonNftError);
      break;
    }
  }
  return recommendedUsers;
};

export default formatPolygonNftData;