import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatLensFollowingsData from "../utils/formatLensFollowingsData";

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
      input: {filter: {identity: {_eq: $user}, dAppName: {_eq: lens}}, blockchain: ALL, limit: 200}
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
            input: {filter: {identity: {_eq: $user}, dAppName: {_eq: lens}}}
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

const fetchLensFollowings = async (
  address: string,
  existingUsers: SocialFollowingsData["Following"] = [],
  query: string = socialFollowingsQuery
): Promise<SocialFollowingsData["Following"]> => {
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
      const followings =
        data?.SocialFollowings?.Following?.map(
          (following: SocialFollowingsData["Following"][0]) =>
            following.followingAddress
        ) ?? [];

      recommendedUsers = [
        ...formatLensFollowingsData(followings, recommendedUsers),
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

export default fetchLensFollowings;
