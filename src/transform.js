"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatingScore = exports.createAddressMap = exports.transformData = void 0;
var score_ts_1 = require("./airstack/score.ts");
Object.defineProperty(exports, "calculatingScore", { enumerable: true, get: function () { return score_ts_1.calculatingScore; } });
var utils_ts_1 = require("../utils/utils.ts");
function transformData(inputData, addressMap, limit, scoringMultiplier) {
    if (limit === void 0) { limit = 10; }
    if (scoringMultiplier === void 0) { scoringMultiplier = 1; }
    var nodes = [];
    var links = [];
    // sort input data by score
    inputData.sort(function (a, b) {
        return b._score - a._score;
    });
    // limit input data
    if (inputData.length > limit) {
        inputData = inputData.slice(0, limit);
    }
    inputData.forEach(function (user) {
        user.addresses.forEach(function (address) {
            var addressId = address;
            var userImage = (0, utils_ts_1.getPreferredProfileImage)(user.socials);
            var addressNode = {
                id: addressId,
                type: "address",
                name: address,
                value: user._score ? user._score * scoringMultiplier : 0,
                image: userImage,
                addressData: addressMap.get(address),
            };
            var shouldAddAddressNode = false;
            // Link address to NFTs
            if (user.nfts) {
                user.nfts.forEach(function (nft) {
                    var nftId = nft.address;
                    var nftNode = {
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
                    var linkToNft = {
                        source: addressId,
                        target: nftId,
                    };
                    links.push(linkToNft);
                    shouldAddAddressNode = true;
                });
            }
            // Link address to POAPs
            if (user.poaps) {
                user.poaps.forEach(function (poap) {
                    var poapId = poap.eventId;
                    var poapNode = {
                        id: poapId,
                        type: "poap",
                        name: poap.name,
                        value: user._score || 0,
                        image: poap.image,
                        blockchain: poap.blockchain,
                        eventId: poap.eventId,
                    };
                    nodes.push(poapNode);
                    var linkToPoap = {
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
    return { nodes: nodes, links: links };
}
exports.transformData = transformData;
function reduceDuplicateNodes(nodes) {
    var reducedNodes = [];
    var nodeMap = new Map();
    nodes.forEach(function (node) {
        if (!nodeMap.has(node.id)) {
            nodeMap.set(node.id, true);
            reducedNodes.push(node);
        }
    });
    return reducedNodes;
}
function createAddressMap(inputData) {
    if (!inputData) {
        return new Map();
    }
    var addressMap = new Map();
    inputData.forEach(function (user, userIndex) {
        if (user.addresses) {
            user.addresses.forEach(function (address) {
                addressMap.set(address, {
                    key: address,
                    user: user,
                });
            });
        }
    });
    return addressMap;
}
exports.createAddressMap = createAddressMap;
