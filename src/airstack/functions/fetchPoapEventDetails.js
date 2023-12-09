import { fetchQuery } from "@airstack/airstack-react"; // or @airstack/airstack-react for frontend javascript

const poapEventDetailsQuery = `query MyQuery($eventId:String, $limit: Int=2) {
  PoapEvents(input: {filter: {eventId: {_eq:$eventId}}, blockchain: ALL, limit: $limit}) {
    PoapEvent {
      blockchain
      chainId
      city
      contentType
      contentValue {
        animation_url {
          original
        }
        image {
          extraSmall
          large
          medium
          original
          small
        }
        json
        video {
          original
        }
      }
      country
      dappName
      dappSlug
      dappVersion
      description
      endDate
      eventId
      eventName
      eventURL
      id
      isVirtualEvent
      metadata
      startDate
      tokenMints
    }
  }
}`;

const fetchPoapEventDetails = async (blockchain, eventId, limit = 2, query = poapEventDetailsQuery) => {
  let res = await fetchQuery(query, {
    eventId,
    limit
  });
  if (!res.error && res.data.PoapEvents.PoapEvent.length > 0) {
    // loop through the array and return the first element which matches the blockchain
    for (let i = 0; i < res.data.PoapEvents.PoapEvent.length; i++) {
      if (res.data.PoapEvents.PoapEvent[i].blockchain === blockchain) {
        return res.data.PoapEvents.PoapEvent[i];
      }
    }
    return null;
  } else {
    console.log(res.error);
    return null;
  }
};

export default fetchPoapEventDetails;