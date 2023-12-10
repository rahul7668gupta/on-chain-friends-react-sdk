"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var airstack_react_1 = require("@airstack/airstack-react");
var formatPolygonNftData_1 = require("../utils/formatPolygonNftData");
var nftAddressesQuery = "\n  query MyQuery($user: Identity!) {\n    TokenBalances(input: {filter: {tokenType: {_in: [ERC721]}, owner: {_eq: $user}}, blockchain: polygon, limit: 200}) {\n      TokenBalance {\n        tokenAddress\n      }\n    }\n  }\n";
var nftQuery = "\n  query MyQuery($tokenAddresses: [Address!]) {\n    TokenBalances(\n      input: {filter: {tokenAddress: {_in: $tokenAddresses}, tokenType: {_in: [ERC721]}}, blockchain: polygon, limit: 200}\n    ) {\n      TokenBalance {\n        token {\n          name\n          address\n          tokenNfts {\n            tokenId\n          }\n          blockchain\n          logo {\n            small\n          }\n        }\n        owner {\n          addresses\n          domains {\n            name\n            isPrimary\n          }\n          socials {\n            dappName\n            blockchain\n            profileName\n            profileImage\n            profileTokenId\n            profileTokenAddress\n          }\n          xmtp {\n            isXMTPEnabled\n          }\n        }\n      }\n    }\n  }\n";
var formatPolygonNftData = function (address, existingUsers, query1, query2) {
    if (existingUsers === void 0) { existingUsers = []; }
    if (query1 === void 0) { query1 = nftAddressesQuery; }
    if (query2 === void 0) { query2 = nftQuery; }
    return __awaiter(void 0, void 0, void 0, function () {
        var polygonNftDataResponse, recommendedUsers, _a, polygonNftData, polygonNftError, polygonNftHasNextPage, polygonNftGetNextPage, tokenAddresses, polygonNftHoldersDataResponse, polygonNftHoldersData, polygonNftHoldersError, polygonNftHoldersHasNextPage, polygonNftHoldersGetNextPage;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    recommendedUsers = __spreadArray([], existingUsers, true);
                    _f.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 13];
                    if (!!polygonNftDataResponse) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, airstack_react_1.fetchQueryWithPagination)(query1, {
                            user: address,
                        })];
                case 2:
                    // Pagination #1: Fetch Polygon NFTs
                    polygonNftDataResponse = _f.sent();
                    _f.label = 3;
                case 3:
                    _a = polygonNftDataResponse !== null && polygonNftDataResponse !== void 0 ? polygonNftDataResponse : {}, polygonNftData = _a.data, polygonNftError = _a.error, polygonNftHasNextPage = _a.hasNextPage, polygonNftGetNextPage = _a.getNextPage;
                    if (!!polygonNftError) return [3 /*break*/, 11];
                    tokenAddresses = (_d = (_c = (_b = polygonNftData === null || polygonNftData === void 0 ? void 0 : polygonNftData.TokenBalances) === null || _b === void 0 ? void 0 : _b.TokenBalance) === null || _c === void 0 ? void 0 : _c.map(function (bal) { return bal.token.address; })) !== null && _d !== void 0 ? _d : [];
                    polygonNftHoldersDataResponse = void 0;
                    _f.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 7];
                    if (tokenAddresses.length === 0)
                        return [3 /*break*/, 7];
                    if (!!polygonNftHoldersDataResponse) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, airstack_react_1.fetchQueryWithPagination)(query2, {
                            tokenAddresses: tokenAddresses,
                        })];
                case 5:
                    // Pagination #2: Fetch Polygon NFT Holders
                    polygonNftHoldersDataResponse = _f.sent();
                    _f.label = 6;
                case 6:
                    polygonNftHoldersData = polygonNftHoldersDataResponse.data, polygonNftHoldersError = polygonNftHoldersDataResponse.error, polygonNftHoldersHasNextPage = polygonNftHoldersDataResponse.hasNextPage, polygonNftHoldersGetNextPage = polygonNftHoldersDataResponse.getNextPage;
                    if (!polygonNftHoldersError) {
                        recommendedUsers = __spreadArray([], (0, formatPolygonNftData_1.default)((_e = polygonNftHoldersData === null || polygonNftHoldersData === void 0 ? void 0 : polygonNftHoldersData.TokenBalances) === null || _e === void 0 ? void 0 : _e.TokenBalance, recommendedUsers), true);
                        // if (!polygonNftHoldersHasNextPage) {
                        return [3 /*break*/, 7];
                        // } else {
                        //   polygonNftHoldersDataResponse =
                        //     await polygonNftHoldersGetNextPage();
                        // }
                    }
                    else {
                        console.error("Error: ", polygonNftHoldersError);
                        return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 4];
                case 7:
                    if (!!polygonNftHasNextPage) return [3 /*break*/, 8];
                    return [3 /*break*/, 13];
                case 8: return [4 /*yield*/, polygonNftGetNextPage()];
                case 9:
                    polygonNftDataResponse = _f.sent();
                    _f.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    console.error("Error: ", polygonNftError);
                    return [3 /*break*/, 13];
                case 12: return [3 /*break*/, 1];
                case 13: return [2 /*return*/, recommendedUsers];
            }
        });
    });
};
exports.default = formatPolygonNftData;
