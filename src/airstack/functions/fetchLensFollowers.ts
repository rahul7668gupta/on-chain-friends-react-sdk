import { fetchQueryWithPagination } from "@airstack/airstack-react";
import formatLensFollowersData from "../utils/formatLensFollowersData";

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

const socialFollowingsQuery = `
  query MyQuery($user: Identity!) {
    SocialFollowers(
      input: {filter: {identity: {_eq: $user}, dAppName: {_eq: lens}}, blockchain: ALL, limit: 200}
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
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}}
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

const fetchLensFollowers = async (
  address: string,
  existingUsers: SocialFollowersData["Follower"] = [],
  query: string = socialFollowingsQuery
): Promise<SocialFollowersData["Follower"]> => {
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
        data?.SocialFollowers?.Follower?.map(
          (follower: SocialFollowersData["Follower"][0]) =>
            follower.followerAddress
        ) ?? [];

      recommendedUsers = [
        ...formatLensFollowersData(followings, recommendedUsers),
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

export default fetchLensFollowers;
