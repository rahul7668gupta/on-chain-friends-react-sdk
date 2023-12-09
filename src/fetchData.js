import fetchPoapEventDetails from "./airstack/functions/fetchPoapEventDetails.js";
import fetchNftDetails from "./airstack/functions/fetchNftDetails.js";
import fetchPoapsData from "./airstack/functions/fetchPoapsData.js";
import fetchFarcasterFollowings from "./airstack/functions/fetchFarcasterFollowings.js";
import fetchLensFollowings from "./airstack/functions/fetchLensFollowings.js";
import fetchFarcasterFollowers from "./airstack/functions/fetchFarcasterFollowers.js";
import fetchLensFollowers from "./airstack/functions/fetchLensFollowers.js";
import fetchTokenSent from "./airstack/functions/fetchTokenSent.js";
import fetchTokenReceived from "./airstack/functions/fetchTokenReceived.js";
import fetchEthNft from "./airstack/functions/fetchEthNft.js";
import fetchPolygonNft from "./airstack/functions/fetchPolygonNft.js";
import fetchBaseNft from "./airstack/functions/fetchBaseNft.js";

const fetchOnChainGraphData = async (address) => {
  let recommendedUsers = [];
  const fetchFunctions = [
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