import fetchPoapEventDetails from "./airstack/functions/fetchPoapEventDetails";
import fetchNftDetails from "./airstack/functions/fetchNftDetails";
import fetchPoapsData from "./airstack/functions/fetchPoapsData";
import fetchFarcasterFollowings from "./airstack/functions/fetchFarcasterFollowings";
import fetchLensFollowings from "./airstack/functions/fetchLensFollowings";
import fetchFarcasterFollowers from "./airstack/functions/fetchFarcasterFollowers";
import fetchLensFollowers from "./airstack/functions/fetchLensFollowers";
import fetchTokenSent from "./airstack/functions/fetchTokenSent";
import fetchTokenReceived from "./airstack/functions/fetchTokenReceived";
import fetchEthNft from "./airstack/functions/fetchEthNft";
import fetchPolygonNft from "./airstack/functions/fetchPolygonNft";
import fetchBaseNft from "./airstack/functions/fetchBaseNft";

const fetchOnChainGraphData = async (address: string) => {
  let recommendedUsers: any[] = [];
  const fetchFunctions: ((address: string, existingUsers: any[]) => Promise<any[]>)[] = [
    fetchPoapsData,
    fetchFarcasterFollowings,
    fetchFarcasterFollowers,
    fetchLensFollowings,
    fetchLensFollowers,
    fetchTokenSent,
    fetchTokenReceived,
    fetchEthNft,
    fetchPolygonNft,
    fetchBaseNft,
  ];
  for (const func of fetchFunctions) {
    recommendedUsers = await func(address, recommendedUsers);
  }
  return recommendedUsers;
};

export { fetchOnChainGraphData, fetchNftDetails, fetchPoapEventDetails };
