interface TokenTransfer {
  sent?: any[]; // Update the type based on the actual structure
  received?: any[]; // Update the type based on the actual structure
}

interface Follows {
  followingOnLens?: boolean;
  followedOnLens?: boolean;
  followingOnFarcaster?: boolean;
  followedOnFarcaster?: boolean;
}

interface Nft {
  address?: string;
  tokenNfts?: {
    tokenId?: string;
  }[];
  blockchain?: string;
}

interface User {
  addresses?: string[];
  domains?: { name?: string }[];
  follows?: Follows;
  tokenTransfers?: TokenTransfer;
  nfts?: Nft[];
  poaps?: any[]; // Update the type based on the actual structure
}

const defaultWeightsMap = {
  tokenSent: 10,
  tokenReceived: 0,
  followedByOnLens: 5,
  followingOnLens: 7,
  followedByOnFarcaster: 5,
  followingOnFarcaster: 5,
  commonPoaps: 7,
  commonEthNfts: 5,
  commonPolygonNfts: 0,
  commonBaseNfts: 3,
};

const identityMap = (identities: User[]) =>
  identities.reduce((acc, identity) => {
    acc[identity.addresses?.[0] ?? ""] = true;
    return acc;
  }, {} as User);

const isBurnedAddress = (address: string | undefined) => {
  if (!address) {
    return false;
  }
  address = address.toLowerCase();
  return (
    address === "0x0000000000000000000000000000000000000000" ||
    address === "0x000000000000000000000000000000000000dead"
  );
};

const calculatingScore = (
  user: User,
  scoreMap: typeof defaultWeightsMap = defaultWeightsMap
) => {

  const identities = [user];
  if (
    user.addresses?.some((address) => identityMap(identities)[address]) ||
    // user.domains?.some(({ name }) => identityMap(identities)[name]) ||
    user.addresses?.some((address) => isBurnedAddress(address))
  ) {
    return { ...user, _score: 0 };
  }

  let score = 0;
  if (user.follows?.followingOnLens) {
    score += scoreMap.followingOnLens;
  }
  if (user.follows?.followedOnLens) {
    score += scoreMap.followedByOnLens;
  }
  if (user.follows?.followingOnFarcaster) {
    score += scoreMap.followingOnFarcaster;
  }
  if (user.follows?.followedOnFarcaster) {
    score += scoreMap.followedByOnFarcaster;
  }
  if (user.tokenTransfers?.sent) {
    score += scoreMap.tokenSent;
  }
  if (user.tokenTransfers?.received) {
    score += scoreMap.tokenReceived;
  }
  let uniqueNfts: Nft[] = [];
  if (user.nfts) {
    const existingNFT: Record<string, boolean> = {};
    uniqueNfts = user.nfts.filter((nft) => {
      const key = `${nft.address}-${nft.tokenNfts?.[0]?.tokenId}`;
      if (existingNFT[key] || isBurnedAddress(nft.address)) {
        return false;
      }
      existingNFT[key] = true;
      return true;
    });

    const ethNftCount = uniqueNfts.filter(
      (nft) => nft.blockchain === "ethereum"
    ).length;
    const polygonNftCount = uniqueNfts.filter(
      (nft) => nft.blockchain === "polygon"
    ).length;
    const baseNftCount = uniqueNfts.filter(
      (nft) => nft.blockchain === "base"
    ).length;
    score +=
      scoreMap.commonEthNfts * ethNftCount +
      scoreMap.commonPolygonNfts * polygonNftCount +
      scoreMap.commonBaseNfts * baseNftCount;
  }
  if (user.poaps) {
    score += scoreMap.commonPoaps * user.poaps.length;
  }

  return {
    ...user,
    _score: score,
  };
};

export { calculatingScore };
