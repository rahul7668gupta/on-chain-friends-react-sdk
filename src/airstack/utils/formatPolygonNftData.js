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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var formatPolygonNftDataUtil = function (data, _recommendedUsers) {
    var _a, _b, _c;
    if (data === void 0) { data = []; }
    if (_recommendedUsers === void 0) { _recommendedUsers = []; }
    var recommendedUsers = __spreadArray([], _recommendedUsers, true);
    var _loop_1 = function (nft) {
        var _d = nft !== null && nft !== void 0 ? nft : {}, owner = _d.owner, token = _d.token;
        var _e = token !== null && token !== void 0 ? token : {}, name_1 = _e.name, logo = _e.logo, address = _e.address, _f = _e.tokenNfts, tokenNfts = _f === void 0 ? [] : _f;
        var addresses = (owner !== null && owner !== void 0 ? owner : {}).addresses;
        var tokenNft = tokenNfts === null || tokenNfts === void 0 ? void 0 : tokenNfts[0];
        var existingUserIndex = recommendedUsers.findIndex(function (_a) {
            var _b;
            var recommendedUsersAddresses = _a.addresses;
            return (_b = recommendedUsersAddresses === null || recommendedUsersAddresses === void 0 ? void 0 : recommendedUsersAddresses.some) === null || _b === void 0 ? void 0 : _b.call(recommendedUsersAddresses, function (address) { var _a; return (_a = addresses === null || addresses === void 0 ? void 0 : addresses.includes) === null || _a === void 0 ? void 0 : _a.call(addresses, address); });
        });
        if (existingUserIndex !== -1) {
            var _addresses = ((_a = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _a === void 0 ? void 0 : _a.addresses) || [];
            recommendedUsers[existingUserIndex].addresses = (_b = __spreadArray(__spreadArray([], (_addresses || []), true), (addresses || []), true)) === null || _b === void 0 ? void 0 : _b.filter(function (address, index, array) { return array.indexOf(address) === index; });
            var _nfts = ((_c = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _c === void 0 ? void 0 : _c.nfts) || [];
            var nftExists = _nfts.some(function (nft) { return nft.address === address; });
            if (!nftExists) {
                _nfts === null || _nfts === void 0 ? void 0 : _nfts.push({
                    name: name_1,
                    image: logo === null || logo === void 0 ? void 0 : logo.small,
                    blockchain: "polygon",
                    address: address,
                    tokenId: tokenNft === null || tokenNft === void 0 ? void 0 : tokenNft.tokenId,
                });
            }
            recommendedUsers[existingUserIndex].nfts = __spreadArray([], _nfts, true);
        }
        else {
            recommendedUsers.push(__assign(__assign({}, owner), { nfts: [
                    {
                        name: name_1,
                        image: logo === null || logo === void 0 ? void 0 : logo.small,
                        blockchain: "polygon",
                        address: address,
                        tokenId: tokenNft === null || tokenNft === void 0 ? void 0 : tokenNft.tokenId,
                    },
                ] }));
        }
    };
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var nft = data_1[_i];
        _loop_1(nft);
    }
    return recommendedUsers;
};
exports.default = formatPolygonNftDataUtil;
