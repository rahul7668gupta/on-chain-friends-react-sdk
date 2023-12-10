import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatPoapsData from "../utils/formatPoapsData";

interface PoapEventData {
  Poap: {
    eventId: string;
    poapEvent: {
      isVirtualEvent: boolean;
      blockchain: string;
      eventName: string;
      contentValue: {
        image: {
          extraSmall: string;
        };
      };
    };
  }[];
}

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

const fetchPoapsData = async (
  address: string,
  existingUsers: PoapEventData["Poap"] = [],
  query1: string = userPoapsEventIdsQuery,
  query2: string = poapsByEventIdsQuery
): Promise<PoapEventData["Poap"]> => {
  let poapsDataResponse: any;
  let recommendedUsers: any = [...existingUsers];

  while (true) {
    if (!poapsDataResponse) {
      // Pagination #1: Fetch All POAPs
      poapsDataResponse = await fetchQueryWithPagination(query1, {
        user: address,
      });
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

      let poapHoldersDataResponse: any;
      while (true) {
        if (eventIds.length === 0) break;

        if (!poapHoldersDataResponse) {
          // Pagination #2: Fetch All POAP holders
          poapHoldersDataResponse = await fetchQueryWithPagination(query2, {
            eventIds,
          });
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
