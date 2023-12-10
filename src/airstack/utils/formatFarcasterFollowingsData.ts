interface Following {
  addresses?: string[];
  mutualFollower?: {
    Follower?: {
      followerAddress?: {
        socials?: {
          profileName?: string;
        }[];
      };
    }[];
  };
}

interface User {
  addresses?: string[];
  follows?: {
    followingOnFarcaster?: boolean;
    followedOnFarcaster?: boolean;
  };
}

function formatFarcasterFollowingsData(
  followings: Following[],
  existingUser: User[] = []
) {
  const recommendedUsers: User[] = [...existingUser];
  for (const following of followings) {
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.((address) =>
          following.addresses?.includes?.(address)
        )
    );

    const followsBack = Boolean(following?.mutualFollower?.Follower?.[0]);
    if (existingUserIndex !== -1) {
      const follows = recommendedUsers?.[existingUserIndex]?.follows ?? {};
      recommendedUsers[existingUserIndex] = {
        ...following,
        ...recommendedUsers[existingUserIndex],
        follows: {
          ...follows,
          followingOnFarcaster: true,
          followedOnFarcaster: followsBack,
        },
      };
    } else {
      recommendedUsers.push({
        ...following,
        follows: {
          followingOnFarcaster: true,
          followedOnFarcaster: followsBack,
        },
      });
    }
  }
  return recommendedUsers;
}

export default formatFarcasterFollowingsData;
