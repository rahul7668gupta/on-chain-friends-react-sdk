import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatEthNftData from "../utils/formatEthNftData";

interface Token {
  name: string;
  address: string;
  tokenNfts: { tokenId: string }[];
  blockchain: string;
  logo: { small: string };
}

interface Owner {
  addresses: string[];
  domains: { name: string; isPrimary: boolean }[];
  socials: {
    dappName: string;
    blockchain: string;
    profileName: string;
    profileImage: string;
    profileTokenId: string;
    profileTokenAddress: string;
  }[];
  xmtp: {
    isXMTPEnabled: boolean;
  };
}

interface TokenBalance {
  token: Token;
  owner: Owner;
}

interface TokenBalancesData {
  TokenBalances: {
    TokenBalance: TokenBalance[];
  };
}

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

const fetchEthNft = async (
  address: string,
  existingUsers: Owner[] = [],
  query1: string = nftAddressesQuery,
  query2: string = nftQuery
): Promise<Owner[]> => {
  let ethNftDataResponse: any;
  let recommendedUsers: any = [...existingUsers];

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
          (bal: TokenBalance) => bal.token.address
        ) ?? [];

      let ethNftHoldersDataResponse: any;

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
