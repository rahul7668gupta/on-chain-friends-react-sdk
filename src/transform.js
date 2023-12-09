import { calculatingScore } from "./airstack/score.js";
import { getPreferredProfileImage } from "../utils/utils.js";

function transformData(inputData, limit = 10, scoringMutiplier = 1) {
  let nodes = [];
  let links = [];

  // sort input data by score
  inputData.sort((a, b) => {
    return b._score - a._score
  });

  // limit input data
  if (inputData.length > limit) {
    inputData = inputData.slice(0, limit);
  }
  
  inputData.forEach((user) => {
    user.addresses.forEach((address) => {
      const addressId = address;
      const userImage = getPreferredProfileImage(user.socials);
      const addressNode = {
        id: addressId,
        type: "address",
        name: address,
        value: user._score ? user._score * scoringMutiplier : 0,
        image: userImage,
      };

      let shouldAddAddressNode = false;

      // Link address to NFTs
      if (user.nfts) {
        user.nfts.forEach((nft) => {
          const nftId = nft.address;
          const nftNode = {
            id: nftId,
            type: 'nft',
            name: nft.name,
            value: user._score || 0,
            image: nft.image,
            tokenAddress: nft.address,
            tokenId: nft.tokenId,
            blockchain: nft.blockchain,
          };

          nodes.push(nftNode);

          const linkToNft = {
            source: addressId,
            target: nftId,
          };

          links.push(linkToNft);
          shouldAddAddressNode = true;
        });
      }

      // Link address to POAPs
      if (user.poaps) {
        user.poaps.forEach((poap) => {
          const poapId = poap.eventId;
          const poapNode = {
            id: poapId,
            type: "poap",
            name: poap.name,
            value: user._score || 0,
            image: poap.image,
            blockchain: poap.blockchain,
            eventId: poap.eventId,
          };

          nodes.push(poapNode);

          const linkToPoap = {
            source: addressId,
            target: poapId,
          };

          links.push(linkToPoap);
          shouldAddAddressNode = true;
        });
      }

      if (shouldAddAddressNode) {
        nodes.push(addressNode);
      }
    });
  });

  nodes = reduceDuplicateNodes(nodes);

  return { nodes, links };
}

function reduceDuplicateNodes(nodes = []) {
  const reducedNodes = [];
  const nodeMap = new Map();

  nodes.forEach((node) => {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, true);
      reducedNodes.push(node);
    }
  });

  return reducedNodes;
}

function createAddressMap(inputData) {
  const addressMap = new Map();

  inputData.forEach((user, userIndex) => {
    if (user.addresses) {
      user.addresses.forEach((address, addressIndex) => {
        const addressKey = `address${userIndex + 1}_${addressIndex + 1}`;
        addressMap.set(address, {
          key: addressKey,
          user: user,
        });
      });
    }
  });

  return addressMap;
}

export { transformData, createAddressMap, calculatingScore };