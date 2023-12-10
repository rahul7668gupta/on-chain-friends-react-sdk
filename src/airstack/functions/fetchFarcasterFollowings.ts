import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatFarcasterFollowingsData from "../utils/formatFarcasterFollowingsData";

interface SocialFollowingsData {
  Following: {
    followingAddress: {
      addresses: string[];
      domains: { name: string; isPrimary: boolean }[];
      socials: {
        dappName: string;
        blockchain: string;
        profileName: string;
        profileImage: string;
        profileTokenId: string;
        profileTokenAddress: string;
        profileImageContentValue: {
          image: {
            small: string;
            extraSmall: string;
          };
        };
      }[];
      xmtp: {
        isXMTPEnabled: boolean;
      };
      mutualFollower: {
        Follower: {
          followerAddress: {
            socials: {
              profileName: string;
            }[];
          };
        }[];
      };
    };
  }[];
}

const socialFollowingsQuery = `
  query MyQuery($user: Identity!) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}, blockchain: ALL, limit: 200}
    ) {
      Following {
        followingAddress {
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
            profileImageContentValue {
              image {
                small
                extraSmall
              }
            }
          }
          xmtp {
            isXMTPEnabled
          }
          mutualFollower: socialFollowers(
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}}
          ) {
            Follower {
              followerAddress {
                socials {
                  profileName
                }
              }
            }
          }
        }
      }
    }
  }
`;

const fetchFarcasterFollowings = async (
  address: string,
  existingUsers: SocialFollowingsData["Following"] = [],
  query: string = socialFollowingsQuery
): Promise<SocialFollowingsData["Following"]> => {
  let farcasterFollowingsDataResponse: any;
  let recommendedUsers: any = [...existingUsers];

  while (true) {
    if (!farcasterFollowingsDataResponse) {
      farcasterFollowingsDataResponse = await fetchQueryWithPagination(query, {
        user: address,
      });
    }

    const {
      data: farcasterFollowingsData,
      error: farcasterFollowingsError,
      hasNextPage: farcasterFollowingsHasNextPage,
      getNextPage: farcasterFollowingsGetNextPage,
    } = farcasterFollowingsDataResponse ?? {};

    if (!farcasterFollowingsError) {
      const followings =
        farcasterFollowingsData?.SocialFollowings?.Following?.map(
          (following: SocialFollowingsData["Following"][0]) =>
            following.followingAddress
        ) ?? [];

      recommendedUsers = [
        ...formatFarcasterFollowingsData(followings, recommendedUsers),
      ];

      // if (!farcasterFollowingsHasNextPage) {
      break;
      // } else {
      //   farcasterFollowingsDataResponse = await farcasterFollowingsGetNextPage();
      // }
    } else {
      console.error("Error: ", farcasterFollowingsError);
      break;
    }
  }

  return recommendedUsers;
};

export default fetchFarcasterFollowings;
