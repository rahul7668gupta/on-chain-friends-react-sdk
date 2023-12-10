"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatingScore = void 0;
var defaultWeightsMap = {
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
var identityMap = function (identities) {
    return identities.reduce(function (acc, identity) {
        var _a, _b;
        acc[(_b = (_a = identity.addresses) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : ""] = true;
        return acc;
    }, {});
};
var isBurnedAddress = function (address) {
    if (!address) {
        return false;
    }
    address = address.toLowerCase();
    return (address === "0x0000000000000000000000000000000000000000" ||
        address === "0x000000000000000000000000000000000000dead");
};
var calculatingScore = function (user, scoreMap) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (scoreMap === void 0) { scoreMap = defaultWeightsMap; }
    var identities = [user];
    if (((_a = user.addresses) === null || _a === void 0 ? void 0 : _a.some(function (address) { return identityMap(identities)[address]; })) ||
        (
        // user.domains?.some(({ name }) => identityMap(identities)[name]) ||
        (_b = user.addresses) === null || _b === void 0 ? void 0 : _b.some(function (address) { return isBurnedAddress(address); }))) {
        return __assign(__assign({}, user), { _score: 0 });
    }
    var score = 0;
    if ((_c = user.follows) === null || _c === void 0 ? void 0 : _c.followingOnLens) {
        score += scoreMap.followingOnLens;
    }
    if ((_d = user.follows) === null || _d === void 0 ? void 0 : _d.followedOnLens) {
        score += scoreMap.followedByOnLens;
    }
    if ((_e = user.follows) === null || _e === void 0 ? void 0 : _e.followingOnFarcaster) {
        score += scoreMap.followingOnFarcaster;
    }
    if ((_f = user.follows) === null || _f === void 0 ? void 0 : _f.followedOnFarcaster) {
        score += scoreMap.followedByOnFarcaster;
    }
    if ((_g = user.tokenTransfers) === null || _g === void 0 ? void 0 : _g.sent) {
        score += scoreMap.tokenSent;
    }
    if ((_h = user.tokenTransfers) === null || _h === void 0 ? void 0 : _h.received) {
        score += scoreMap.tokenReceived;
    }
    var uniqueNfts = [];
    if (user.nfts) {
        var existingNFT_1 = {};
        uniqueNfts = user.nfts.filter(function (nft) {
            var _a, _b;
            var key = "".concat(nft.address, "-").concat((_b = (_a = nft.tokenNfts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.tokenId);
            if (existingNFT_1[key] || isBurnedAddress(nft.address)) {
                return false;
            }
            existingNFT_1[key] = true;
            return true;
        });
        var ethNftCount = uniqueNfts.filter(function (nft) { return nft.blockchain === "ethereum"; }).length;
        var polygonNftCount = uniqueNfts.filter(function (nft) { return nft.blockchain === "polygon"; }).length;
        var baseNftCount = uniqueNfts.filter(function (nft) { return nft.blockchain === "base"; }).length;
        score +=
            scoreMap.commonEthNfts * ethNftCount +
                scoreMap.commonPolygonNfts * polygonNftCount +
                scoreMap.commonBaseNfts * baseNftCount;
    }
    if (user.poaps) {
        score += scoreMap.commonPoaps * user.poaps.length;
    }
    return __assign(__assign({}, user), { _score: score });
};
exports.calculatingScore = calculatingScore;
