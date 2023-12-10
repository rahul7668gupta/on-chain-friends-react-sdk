import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatTokenReceivedData from "../utils/formatTokenReceivedData";

interface TokenReceivedQueryResult {
  TokenTransfer: {
    account: {
      addresses: string[];
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

const tokenReceivedQuery = `
  query MyQuery($user: Identity!) {
    Ethereum: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: to {
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
    Polygon: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: polygon, limit: 200}
    ) {
      TokenTransfer {
        account: to {
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
    Base: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: base, limit: 200}
    ) {
      TokenTransfer {
        account: to {
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

const fetchTokenReceived = async (
  address: string,
  existingUsers: TokenReceivedQueryResult["TokenTransfer"] = [],
  query: string = tokenReceivedQuery
): Promise<TokenReceivedQueryResult["TokenTransfer"]> => {
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
        ...formatTokenReceivedData(tokenTransfer, recommendedUsers),
      ];

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

export default fetchTokenReceived;
