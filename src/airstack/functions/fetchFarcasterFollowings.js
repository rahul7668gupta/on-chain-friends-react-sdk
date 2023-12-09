import { init, fetchQueryWithPagination } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript
import formatFarcasterFollowingsData from "../utils/formatFarcasterFollowingsData.js";

// get your API key at https://app.airstack.xyz/profile-settings/api-keys


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

const fetchFarcasterFollowings = async (address, existingUsers = [], query = socialFollowingsQuery) => {
  let farcasterFollowingsDataResponse;
  let recommendedUsers = [...existingUsers];
  while (true) {
    if (!farcasterFollowingsDataResponse) {
      farcasterFollowingsDataResponse = await fetchQueryWithPagination(
        query,
        {
          user: address,
        }
      );
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
          following => following.followingAddress
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