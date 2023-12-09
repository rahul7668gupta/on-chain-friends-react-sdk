import { init, fetchQueryWithPagination } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript
import formatLensFollowingsData from "../utils/formatLensFollowingsData.js";

// get your API key at https://app.airstack.xyz/profile-settings/api-keys


const socialFollowingsQuery = `
query MyQuery($user: Identity!) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}, blockchain: ALL, limit: 200}
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
          mutualFollower: socialFollowers(
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}}
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

const fetchLensFollowings = async (address, existingUsers = [], query = socialFollowingsQuery) => {
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
        data?.SocialFollowings?.Following?.map(
          (following) => following.followingAddress
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