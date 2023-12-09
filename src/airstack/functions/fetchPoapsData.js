import { init, fetchQueryWithPagination } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript
import formatPoapsData from "../utils/formatPoapsData.js";

// get your API key at https://app.airstack.xyz/profile-settings/api-keys


const userPoapsEventIdsQuery = `
query MyQuery($user: Identity) {
  Poaps(input: {filter: {owner: {_eq: $user}}, blockchain: ALL}) {
    Poap {
      eventId
      poapEvent {
        isVirtualEvent
      }
    }
  }
}
`;

const poapsByEventIdsQuery = `
query MyQuery($eventIds: [String!]) {
  Poaps(input: {filter: {eventId: {_in: $eventIds}}, blockchain: ALL}) {
    Poap {
      eventId
      poapEvent {
        blockchain
        eventName
        contentValue {
          image {
            extraSmall
          }
        }
      }
      attendee {
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
}
`;


const fetchPoapsData = async (address, existingUsers = [], query1 = userPoapsEventIdsQuery, query2 = poapsByEventIdsQuery) => {
  let poapsDataResponse;
  let recommendedUsers = [...existingUsers];
  while (true) {
    if (!poapsDataResponse) {
      // Paagination #1: Fetch All POAPs
      poapsDataResponse = await fetchQueryWithPagination(
        query1,
        {
          user: address,
        }
      );
    }
    const {
      data: poapsData,
      error: poapsError,
      hasNextPage: poapsHasNextPage,
      getNextPage: poapsGetNextPage,
    } = poapsDataResponse ?? {};
    if (!poapsError) {
      const eventIds =
        poapsData?.Poaps.Poap?.filter(
          (poap) => !poap?.poapEvent?.isVirtualEvent
        ).map((poap) => poap?.eventId) ?? [];
      let poapHoldersDataResponse;
      while (true) {
        if (eventIds.length === 0) break;
        if (!poapHoldersDataResponse) {
          // Pagination #2: Fetch All POAP holders
          poapHoldersDataResponse = await fetchQueryWithPagination(
            query2,
            {
              eventIds,
            }
          );
        }
        const {
          data: poapHoldersData,
          error: poapHoldersError,
          hasNextPage: poapHoldersHasNextPage,
          getNextPage: poapHoldersGetNextPage,
        } = poapHoldersDataResponse;
        if (!poapHoldersError) {
          recommendedUsers = [
            ...formatPoapsData(poapHoldersData?.Poaps?.Poap, recommendedUsers),
          ];
          if (!poapHoldersHasNextPage) {
            break;
          } else {
            poapHoldersDataResponse = await poapHoldersGetNextPage();
          }
        } else {
          console.error("Error: ", poapHoldersError);
          break;
        }
      }
      if (!poapsHasNextPage) {
        break;
      } else {
        poapsDataResponse = await poapsGetNextPage();
      }
    } else {
      console.error("Error: ", poapsError);
      break;
    }
  }
  return recommendedUsers;
};

export default fetchPoapsData;