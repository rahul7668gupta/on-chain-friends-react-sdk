import { init, fetchQueryWithPagination } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript
import formatEthNftData from "../utils/formatEthNftData.js";

// get your API key at https://app.airstack.xyz/profile-settings/api-keys


const nftAddressesQuery = `
query MyQuery($user: Identity!) {
  TokenBalances(input: {filter: {tokenType: {_in: [ERC721]}, owner: {_eq: $user}}, blockchain: ethereum, limit: 200}) {
    TokenBalance {
      tokenAddress
    }
  }
}
`;

const nftQuery = `
query MyQuery($tokenAddresses: [Address!]) {
  TokenBalances(
    input: {filter: {tokenAddress: {_in: $tokenAddresses}, tokenType: {_in: [ERC721]}}, blockchain: ethereum, limit: 200}
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

const fetchEthNft = async (address, existingUsers = [], query1 = nftAddressesQuery, query2 = nftQuery) => {
  let ethNftDataResponse;
  let recommendedUsers = [...existingUsers];
  while (true) {
    if (!ethNftDataResponse) {
      // Pagination #1: Fetch Ethereum NFTs
      ethNftDataResponse = await fetchQueryWithPagination(query1, {
        user: address,
      });
    }
    const {
      data: ethNftData,
      error: ethNftError,
      hasNextPage: ethNftHasNextPage,
      getNextPage: ethNftGetNextPage,
    } = ethNftDataResponse ?? {};
    if (!ethNftError) {
      const tokenAddresses =
        ethNftData?.TokenBalances?.TokenBalance?.map(
          (token) => token.tokenAddress
        ) ?? [];
      let ethNftHoldersDataResponse;
      while (true) {
        if (tokenAddresses.length === 0) break;
        if (!ethNftHoldersDataResponse) {
          // Pagination #2: Fetch Ethereum NFT Holders
          ethNftHoldersDataResponse = await fetchQueryWithPagination(query2, {
            tokenAddresses,
          });
        }
        const {
          data: ethNftHoldersData,
          error: ethNftHoldersError,
          hasNextPage: ethNftHoldersHasNextPage,
          getNextPage: ethNftHoldersGetNextPage,
        } = ethNftHoldersDataResponse;
        if (!ethNftHoldersError) {
          recommendedUsers = [
            ...formatEthNftData(
              ethNftHoldersData?.TokenBalances?.TokenBalance,
              recommendedUsers
            ),
          ];
          // if (!ethNftHoldersHasNextPage) {
          break;
          // } else {
          //   ethNftHoldersDataResponse = await ethNftHoldersGetNextPage();
          // }
        } else {
          console.error("Error: ", ethNftHoldersError);
          break;
        }
      }
      if (!ethNftHasNextPage) {
        break;
      } else {
        ethNftDataResponse = await ethNftGetNextPage();
      }
    } else {
      console.error("Error: ", ethNftError);
      break;
    }
  }
  return recommendedUsers;
};

export default fetchEthNft;