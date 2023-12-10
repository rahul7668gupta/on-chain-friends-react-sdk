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
var formatPoapsData_1 = require("../utils/formatPoapsData");
var userPoapsEventIdsQuery = "\n  query MyQuery($user: Identity) {\n    Poaps(input: {filter: {owner: {_eq: $user}}, blockchain: ALL}) {\n      Poap {\n        eventId\n        poapEvent {\n          isVirtualEvent\n        }\n      }\n    }\n  }\n";
var poapsByEventIdsQuery = "\n  query MyQuery($eventIds: [String!]) {\n    Poaps(input: {filter: {eventId: {_in: $eventIds}}, blockchain: ALL}) {\n      Poap {\n        eventId\n        poapEvent {\n          blockchain\n          eventName\n          contentValue {\n            image {\n              extraSmall\n            }\n          }\n        }\n        attendee {\n          owner {\n            addresses\n            domains {\n              name\n              isPrimary\n            }\n            socials {\n              dappName\n              blockchain\n              profileName\n              profileImage\n              profileTokenId\n              profileTokenAddress\n            }\n            xmtp {\n              isXMTPEnabled\n            }\n          }\n        }\n      }\n    }\n  }\n";
var fetchPoapsData = function (address, existingUsers, query1, query2) {
    if (existingUsers === void 0) { existingUsers = []; }
    if (query1 === void 0) { query1 = userPoapsEventIdsQuery; }
    if (query2 === void 0) { query2 = poapsByEventIdsQuery; }
    return __awaiter(void 0, void 0, void 0, function () {
        var poapsDataResponse, recommendedUsers, _a, poapsData, poapsError, poapsHasNextPage, poapsGetNextPage, eventIds, poapHoldersDataResponse, poapHoldersData, poapHoldersError, poapHoldersHasNextPage, poapHoldersGetNextPage;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    recommendedUsers = __spreadArray([], existingUsers, true);
                    _e.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 18];
                    if (!!poapsDataResponse) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, airstack_react_1.fetchQueryWithPagination)(query1, {
                            user: address,
                        })];
                case 2:
                    // Pagination #1: Fetch All POAPs
                    poapsDataResponse = _e.sent();
                    _e.label = 3;
                case 3:
                    _a = poapsDataResponse !== null && poapsDataResponse !== void 0 ? poapsDataResponse : {}, poapsData = _a.data, poapsError = _a.error, poapsHasNextPage = _a.hasNextPage, poapsGetNextPage = _a.getNextPage;
                    if (!!poapsError) return [3 /*break*/, 16];
                    eventIds = (_c = (_b = poapsData === null || poapsData === void 0 ? void 0 : poapsData.Poaps.Poap) === null || _b === void 0 ? void 0 : _b.filter(function (poap) { var _a; return !((_a = poap === null || poap === void 0 ? void 0 : poap.poapEvent) === null || _a === void 0 ? void 0 : _a.isVirtualEvent); }).map(function (poap) { return poap === null || poap === void 0 ? void 0 : poap.eventId; })) !== null && _c !== void 0 ? _c : [];
                    poapHoldersDataResponse = void 0;
                    _e.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 12];
                    if (eventIds.length === 0)
                        return [3 /*break*/, 12];
                    if (!!poapHoldersDataResponse) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, airstack_react_1.fetchQueryWithPagination)(query2, {
                            eventIds: eventIds,
                        })];
                case 5:
                    // Pagination #2: Fetch All POAP holders
                    poapHoldersDataResponse = _e.sent();
                    _e.label = 6;
                case 6:
                    poapHoldersData = poapHoldersDataResponse.data, poapHoldersError = poapHoldersDataResponse.error, poapHoldersHasNextPage = poapHoldersDataResponse.hasNextPage, poapHoldersGetNextPage = poapHoldersDataResponse.getNextPage;
                    if (!!poapHoldersError) return [3 /*break*/, 10];
                    recommendedUsers = __spreadArray([], (0, formatPoapsData_1.default)((_d = poapHoldersData === null || poapHoldersData === void 0 ? void 0 : poapHoldersData.Poaps) === null || _d === void 0 ? void 0 : _d.Poap, recommendedUsers), true);
                    if (!!poapHoldersHasNextPage) return [3 /*break*/, 7];
                    return [3 /*break*/, 12];
                case 7: return [4 /*yield*/, poapHoldersGetNextPage()];
                case 8:
                    poapHoldersDataResponse = _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    console.error("Error: ", poapHoldersError);
                    return [3 /*break*/, 12];
                case 11: return [3 /*break*/, 4];
                case 12:
                    if (!!poapsHasNextPage) return [3 /*break*/, 13];
                    return [3 /*break*/, 18];
                case 13: return [4 /*yield*/, poapsGetNextPage()];
                case 14:
                    poapsDataResponse = _e.sent();
                    _e.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    console.error("Error: ", poapsError);
                    return [3 /*break*/, 18];
                case 17: return [3 /*break*/, 1];
                case 18: return [2 /*return*/, recommendedUsers];
            }
        });
    });
};
exports.default = fetchPoapsData;
