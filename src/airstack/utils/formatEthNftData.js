const formatEthNftData = (data, _recommendedUsers = []) => {
  const recommendedUsers = [..._recommendedUsers];

  for (const nft of data) {
    const { owner, token } = nft ?? {};
    const { name, logo, address, tokenNfts = [] } = token ?? {};
    const { addresses } = owner ?? {};
    const tokenNft = tokenNfts?.[0];

    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.((address) =>
          addresses?.includes?.(address)
        )
    );

    if (existingUserIndex !== -1) {
      const _addresses = recommendedUsers?.[existingUserIndex]?.addresses || [];
      recommendedUsers[existingUserIndex].addresses = [
        ..._addresses,
        ...addresses,
      ]?.filter((address, index, array) => array.indexOf(address) === index);
      const _nfts = recommendedUsers?.[existingUserIndex]?.nfts || [];
      const nftExists = _nfts.some((nft) => nft.address === address);
      if (!nftExists) {
        _nfts?.push({
          name,
          image: logo?.small,
          blockchain: "ethereum",
          address,
          tokenId: tokenNft?.tokenId,
        });
      }
      recommendedUsers[existingUserIndex].nfts = [..._nfts];
    } else {
      recommendedUsers.push({
        ...owner,
        nfts: [
          {
            name,
            image: logo?.small,
            blockchain: "ethereum",
            address,
            tokenId: tokenNft?.tokenId,
          },
        ],
      });
    }
  }
  return recommendedUsers;
};

export default formatEthNftData;