import { init, fetchQueryWithPagination } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript
import formatLensFollowersData from "../utils/formatLensFollowersData.js";

// get your API key at https://app.airstack.xyz/profile-settings/api-keys


const socialFollowingsQuery = `
query MyQuery($user: Identity!) {
  SocialFollowers(
    input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}, blockchain: ALL, limit: 200}
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
          profileImageContentValue{
            image{
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

const fetchLensFollowers = async (address, existingUsers = [], query = socialFollowingsQuery) => {
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
      const followings =
        data?.SocialFollowers?.Follower?.map(
          (follower) => follower.followerAddress
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