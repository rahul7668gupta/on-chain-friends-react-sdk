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
var formatBaseNftData_1 = require("../utils/formatBaseNftData");
var nftAddressesQuery = "\n  query MyQuery($user: Identity!) {\n    TokenBalances(input: {filter: {tokenType: {_in: [ERC721]}, owner: {_eq: $user}}, blockchain: base, limit: 200}) {\n      TokenBalance {\n        tokenAddress\n      }\n    }\n  }\n";
var nftQuery = "\n  query MyQuery($tokenAddresses: [Address!]) {\n    TokenBalances(\n      input: {filter: {tokenAddress: {_in: $tokenAddresses}, tokenType: {_in: [ERC721]}}, blockchain: base, limit: 200}\n    ) {\n      TokenBalance {\n        token {\n          name\n          address\n          tokenNfts {\n            tokenId\n          }\n          blockchain\n          logo {\n            small\n          }\n        }\n        owner {\n          addresses\n          domains {\n            name\n            isPrimary\n          }\n          socials {\n            dappName\n            blockchain\n            profileName\n            profileImage\n            profileTokenId\n            profileTokenAddress\n          }\n          xmtp {\n            isXMTPEnabled\n          }\n        }\n      }\n    }\n  }\n";
var fetchBaseNft = function (address, existingUsers, query1, query2) {
    if (existingUsers === void 0) { existingUsers = []; }
    if (query1 === void 0) { query1 = nftAddressesQuery; }
    if (query2 === void 0) { query2 = nftQuery; }
    return __awaiter(void 0, void 0, void 0, function () {
        var baseNftDataResponse, recommendedUsers, _a, baseNftData, baseNftError, baseNftHasNextPage, baseNftGetNextPage, tokenAddresses, baseNftHoldersDataResponse, baseNftHoldersData, baseNftHoldersError, baseNftHoldersHasNextPage, baseNftHoldersGetNextPage;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    recommendedUsers = __spreadArray([], existingUsers, true);
                    _f.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 18];
                    if (!!baseNftDataResponse) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, airstack_react_1.fetchQueryWithPagination)(query1, {
                            user: address,
                        })];
                case 2:
                    // Pagination #1: Fetch Base NFTs
                    baseNftDataResponse = _f.sent();
                    _f.label = 3;
                case 3:
                    _a = baseNftDataResponse !== null && baseNftDataResponse !== void 0 ? baseNftDataResponse : {}, baseNftData = _a.data, baseNftError = _a.error, baseNftHasNextPage = _a.hasNextPage, baseNftGetNextPage = _a.getNextPage;
                    if (!!baseNftError) return [3 /*break*/, 16];
                    tokenAddresses = (_d = (_c = (_b = baseNftData === null || baseNftData === void 0 ? void 0 : baseNftData.TokenBalances) === null || _b === void 0 ? void 0 : _b.TokenBalance) === null || _c === void 0 ? void 0 : _c.map(function (bal) { return bal.token.address; })) !== null && _d !== void 0 ? _d : [];
                    baseNftHoldersDataResponse = void 0;
                    _f.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 12];
                    if (tokenAddresses.length === 0)
                        return [3 /*break*/, 12];
                    if (!!baseNftHoldersDataResponse) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, airstack_react_1.fetchQueryWithPagination)(query2, {
                            tokenAddresses: tokenAddresses,
                        })];
                case 5:
                    // Pagination #2: Fetch Base NFT Holders
                    baseNftHoldersDataResponse = _f.sent();
                    _f.label = 6;
                case 6:
                    baseNftHoldersData = baseNftHoldersDataResponse.data, baseNftHoldersError = baseNftHoldersDataResponse.error, baseNftHoldersHasNextPage = baseNftHoldersDataResponse.hasNextPage, baseNftHoldersGetNextPage = baseNftHoldersDataResponse.getNextPage;
                    if (!!baseNftHoldersError) return [3 /*break*/, 10];
                    recommendedUsers = __spreadArray([], (0, formatBaseNftData_1.default)((_e = baseNftHoldersData === null || baseNftHoldersData === void 0 ? void 0 : baseNftHoldersData.TokenBalances) === null || _e === void 0 ? void 0 : _e.TokenBalance, recommendedUsers), true);
                    if (!!baseNftHoldersHasNextPage) return [3 /*break*/, 7];
                    return [3 /*break*/, 12];
                case 7: return [4 /*yield*/, baseNftHoldersGetNextPage()];
                case 8:
                    baseNftHoldersDataResponse =
                        _f.sent();
                    _f.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    console.error("Error: ", baseNftHoldersError);
                    return [3 /*break*/, 12];
                case 11: return [3 /*break*/, 4];
                case 12:
                    if (!!baseNftHasNextPage) return [3 /*break*/, 13];
                    return [3 /*break*/, 18];
                case 13: return [4 /*yield*/, baseNftGetNextPage()];
                case 14:
                    baseNftDataResponse = _f.sent();
                    _f.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    console.error("Error: ", baseNftError);
                    return [3 /*break*/, 18];
                case 17: return [3 /*break*/, 1];
                case 18: return [2 /*return*/, recommendedUsers];
            }
        });
    });
};
exports.default = fetchBaseNft;
