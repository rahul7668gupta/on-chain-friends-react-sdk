import { calculatingScore } from "./airstack/score.ts";
import { getPreferredProfileImage } from "../utils/utils.ts";

export interface Node {
  id: string;
  type: string;
  name: string;
  value: number;
  image: string;
  tokenAddress?: string;
  tokenId?: string;
  blockchain?: string;
  eventId?: string;
  addressData?: { key: string; user: any };
}

export interface Link {
  source: string;
  target: string;
}

function transformData(
  inputData: any[],
  addressMap: Map<string, { key: string; user: any }>,
  limit: number = 10,
  scoringMultiplier: number = 1
): { nodes: Node[]; links: Link[] } {
  let nodes: Node[] = [];
  let links: Link[] = [];

  // sort input data by score
  inputData.sort((a, b) => {
    return b._score - a._score;
  });

  // limit input data
  if (inputData.length > limit) {
    inputData = inputData.slice(0, limit);
  }

  inputData.forEach((user) => {
    user.addresses.forEach((address: string) => {
      const addressId: string = address;
      const userImage: string = getPreferredProfileImage(user.socials);
      const addressNode: Node = {
        id: addressId,
        type: "address",
        name: address,
        value: user._score ? user._score * scoringMultiplier : 0,
        image: userImage,
        addressData: addressMap.get(address),
      };

      let shouldAddAddressNode: boolean = false;

      // Link address to NFTs
      if (user.nfts) {
        user.nfts.forEach((nft: any) => {
          const nftId: string = nft.address;
          const nftNode: Node = {
            id: nftId,
            type: "nft",
            name: nft.name,
            value: user._score || 0,
            image: nft.image,
            tokenAddress: nft.address,
            tokenId: nft.tokenId,
            blockchain: nft.blockchain,
          };

          nodes.push(nftNode);

          const linkToNft: Link = {
            source: addressId,
            target: nftId,
          };

          links.push(linkToNft);
          shouldAddAddressNode = true;
        });
      }

      // Link address to POAPs
      if (user.poaps) {
        user.poaps.forEach((poap: any) => {
          const poapId: string = poap.eventId;
          const poapNode: Node = {
            id: poapId,
            type: "poap",
            name: poap.name,
            value: user._score || 0,
            image: poap.image,
            blockchain: poap.blockchain,
            eventId: poap.eventId,
          };

          nodes.push(poapNode);

          const linkToPoap: Link = {
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

function reduceDuplicateNodes(nodes: Node[]): Node[] {
  const reducedNodes: Node[] = [];
  const nodeMap: Map<string, boolean> = new Map();

  nodes.forEach((node) => {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, true);
      reducedNodes.push(node);
    }
  });

  return reducedNodes;
}

function createAddressMap(inputData: any[]): Map<string, { key: string; user: any }> {
  if (!inputData) {
    return new Map();
  }
  const addressMap: Map<string, { key: string; user: any }> = new Map();

  inputData.forEach((user, userIndex) => {
    if (user.addresses) {
      user.addresses.forEach((address: string) => {
        addressMap.set(address, {
          key: address,
          user: user,
        });
      });
    }
  });

  return addressMap;
}

export { transformData, createAddressMap, calculatingScore };