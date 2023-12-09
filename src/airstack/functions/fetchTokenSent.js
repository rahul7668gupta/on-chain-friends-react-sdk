import { init, fetchQueryWithPagination } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript
import formatTokenSentData from "../utils/formatTokenSentData.js";

// get your API key at https://app.airstack.xyz/profile-settings/api-keys


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

const fetchTokenSent = async (address, existingUsers = [], query = tokenSentQuery) => {
  let res;
  let recommendedUsers = [...existingUsers];
  while (true) {
    if (!res) {
      res = await fetchQueryWithPagination(query, {
        user: address,
      });
    }
    const { data, error, hasNextPage, getNextPage } = res ?? {};
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
      ];
      // if (!hasNextPage) {
      break;
      // } else {
      //   res = await getNextPage();
      // }
    } else {
      console.error("Error: ", error);
      break;
    }
  }
  return recommendedUsers;
};

export default fetchTokenSent;