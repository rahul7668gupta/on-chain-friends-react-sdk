import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatBaseNftData from "../utils/formatBaseNftData";

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
    TokenBalances(input: {filter: {tokenType: {_in: [ERC721]}, owner: {_eq: $user}}, blockchain: base, limit: 200}) {
      TokenBalance {
        tokenAddress
      }
    }
  }
`;

const nftQuery = `
  query MyQuery($tokenAddresses: [Address!]) {
    TokenBalances(
      input: {filter: {tokenAddress: {_in: $tokenAddresses}, tokenType: {_in: [ERC721]}}, blockchain: base, limit: 200}
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

const fetchBaseNft = async (
  address: string,
  existingUsers: Owner[] = [],
  query1: string = nftAddressesQuery,
  query2: string = nftQuery
): Promise<Owner[]> => {
  let baseNftDataResponse: any;
  let recommendedUsers: any = [...existingUsers];

  while (true) {
    if (!baseNftDataResponse) {
      // Pagination #1: Fetch Base NFTs
      baseNftDataResponse = await fetchQueryWithPagination(query1, {
        user: address,
      });
    }

    const {
      data: baseNftData,
      error: baseNftError,
      hasNextPage: baseNftHasNextPage,
      getNextPage: baseNftGetNextPage,
    } = baseNftDataResponse ?? {};

    if (!baseNftError) {
      const tokenAddresses =
        baseNftData?.TokenBalances?.TokenBalance?.map(
          (bal: TokenBalance) => bal.token.address
        ) ?? [];

      let baseNftHoldersDataResponse: any;

      while (true) {
        if (tokenAddresses.length === 0) break;

        if (!baseNftHoldersDataResponse) {
          // Pagination #2: Fetch Base NFT Holders
          baseNftHoldersDataResponse = await fetchQueryWithPagination(query2, {
            tokenAddresses,
          });
        }

        const {
          data: baseNftHoldersData,
          error: baseNftHoldersError,
          hasNextPage: baseNftHoldersHasNextPage,
          getNextPage: baseNftHoldersGetNextPage,
        } = baseNftHoldersDataResponse;

        if (!baseNftHoldersError) {
          recommendedUsers = [
            ...formatBaseNftData(
              baseNftHoldersData?.TokenBalances?.TokenBalance,
              recommendedUsers
            ),
          ];

          if (!baseNftHoldersHasNextPage) {
            break;
          } else {
            baseNftHoldersDataResponse =
              await baseNftHoldersGetNextPage();
          }
        } else {
          console.error("Error: ", baseNftHoldersError);
          break;
        }
      }

      if (!baseNftHasNextPage) {
        break;
      } else {
        baseNftDataResponse = await baseNftGetNextPage();
      }
    } else {
      console.error("Error: ", baseNftError);
      break;
    }
  }

  return recommendedUsers;
};

export default fetchBaseNft;
