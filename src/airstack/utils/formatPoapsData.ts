interface Poap {
  attendee?: {
    owner?: {
      addresses?: string[];
    };
  };
  poapEvent?: {
    eventName?: string;
    contentValue?: {
      image?: {
        extraSmall?: string;
      };
    };
    blockchain?: string;
  };
  eventId?: string;
}

interface User {
  addresses?: string[];
  poaps?: {
    name?: string;
    image?: string;
    eventId?: string;
    blockchain?: string;
  }[];
}

function formatPoapsData(poaps: Poap[], existingUser: User[] = []) {
  const recommendedUsers: User[] = [...existingUser];
  for (const poap of poaps ?? []) {
    const { attendee, poapEvent, eventId } = poap ?? {};
    const { eventName: name, contentValue, blockchain } = poapEvent ?? {};
    const { addresses } = attendee?.owner ?? {};
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.((address) =>
          addresses?.includes?.(address)
        )
    );
    if (existingUserIndex !== -1) {
      recommendedUsers[existingUserIndex].addresses = [
        ...(recommendedUsers?.[existingUserIndex]?.addresses ?? []),
        ...(addresses ?? []),
      ]?.filter((address, index, array) => array.indexOf(address) === index);
      const _poaps = recommendedUsers?.[existingUserIndex]?.poaps || [];
      const poapExists = _poaps.some((poap) => poap.eventId === eventId);
      if (!poapExists) {
        _poaps?.push({ name, image: contentValue?.image?.extraSmall, eventId, blockchain });
        recommendedUsers[existingUserIndex].poaps = [..._poaps];
      }
    } else {
      recommendedUsers.push({
        ...(attendee?.owner ?? {}),
        poaps: [{ name, image: contentValue?.image?.extraSmall, eventId, blockchain }],
      });
    }
  }
  return recommendedUsers;
}

export default formatPoapsData;
