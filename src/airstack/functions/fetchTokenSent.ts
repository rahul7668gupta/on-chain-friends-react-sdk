import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatTokenSentData from "../utils/formatTokenSentData";

interface TokenSentQueryResult {
  TokenTransfer: {
    account: {
      addresses: string[];
      primaryDomain?: {
        name: string;
      };
      domains: {
        name: string;
        isPrimary: boolean;
      }[];
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
    };
  }[];
}

const tokenSentQuery = `
  query TokenSent($user: Identity!) {
    Ethereum: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
          primaryDomain {
            name
          }
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
    Polygon: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: polygon, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
          primaryDomain {
            name
          }
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
    Base: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: base, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
          primaryDomain {
            name
          }
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

const fetchTokenSent = async (
  address: string,
  existingUsers: TokenSentQueryResult["TokenTransfer"] = [],
  query: string = tokenSentQuery
): Promise<TokenSentQueryResult["TokenTransfer"]> => {
  let res: any;
  let recommendedUsers: any = [...existingUsers];

  while (true) {
    if (!res) {
      res = await fetchQueryWithPagination(query, {
        user: address,
      });
    }

    const {
      data,
      error,
      hasNextPage,
      getNextPage,
    } = res ?? {};

    if (!error) {
      const ethData = (data?.Ethereum?.TokenTransfer ?? []).map(
        (transfer) => transfer.account
      );
      const polygonData = (data?.Polygon?.TokenTransfer ?? []).map(
        (transfer) => transfer.account
      );
      const baseData = (data?.Base?.TokenTransfer ?? []).map(
        (transfer) => transfer.account
      );

      const tokenTransfer = [...ethData, ...polygonData, ...baseData];
      recommendedUsers = [
        ...formatTokenSentData(tokenTransfer, recommendedUsers),
      ] as TokenSentQueryResult["TokenTransfer"]; // Add type assertion here

      if (!hasNextPage) {
        break;
      } else {
        res = await getNextPage();
      }
    } else {
      console.error("Error: ", error);
      break;
    }
  }

  return recommendedUsers;
};

export default fetchTokenSent;
