import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatFarcasterFollowersData from "../utils/formatFarcasterFollowersData";

interface SocialFollowersData {
  Follower: {
    followerAddress: {
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
      mutualFollowing: {
        Following: {
          followingAddress: {
            socials: {
              profileName: string;
            }[];
          };
        }[];
      };
    };
  }[];
}

const socialFollowersQuery = `
  query MyQuery($user: Identity!) {
    SocialFollowers(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}, blockchain: ALL, limit: 200}
    ) {
      Follower {
        followerAddress {
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
          mutualFollowing: socialFollowings(
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}}
          ) {
            Following {
              followingAddress {
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

const fetchFarcasterFollowers = async (
  address: string,
  existingUsers: SocialFollowersData["Follower"] = [],
  query: string = socialFollowersQuery
): Promise<SocialFollowersData["Follower"]> => {
  let res: any;
  let recommendedUsers: any = [...existingUsers];

  while (true) {
    if (!res) {
      res = await fetchQueryWithPagination(query, {
        user: address,
      });
    }

    const { data, error, hasNextPage, getNextPage } = res ?? {};

    if (!error) {
      const followings =
        data?.SocialFollowers?.Follower?.map(
          (follower: SocialFollowersData["Follower"][0]) =>
            follower.followerAddress
        ) ?? [];

      recommendedUsers = [
        ...formatFarcasterFollowersData(followings, recommendedUsers),
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

export default fetchFarcasterFollowers;
