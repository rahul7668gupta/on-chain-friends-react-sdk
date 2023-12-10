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
var formatTokenReceivedData_1 = require("../utils/formatTokenReceivedData");
var tokenReceivedQuery = "\n  query MyQuery($user: Identity!) {\n    Ethereum: TokenTransfers(\n      input: {filter: {to: {_eq: $user}}, blockchain: ethereum, limit: 200}\n    ) {\n      TokenTransfer {\n        account: to {\n          addresses\n          domains {\n            name\n            isPrimary\n          }\n          socials {\n            dappName\n            blockchain\n            profileName\n            profileImage\n            profileTokenId\n            profileTokenAddress\n          }\n          xmtp {\n            isXMTPEnabled\n          }\n        }\n      }\n    }\n    Polygon: TokenTransfers(\n      input: {filter: {to: {_eq: $user}}, blockchain: polygon, limit: 200}\n    ) {\n      TokenTransfer {\n        account: to {\n          addresses\n          domains {\n            name\n            isPrimary\n          }\n          socials {\n            dappName\n            blockchain\n            profileName\n            profileImage\n            profileTokenId\n            profileTokenAddress\n          }\n          xmtp {\n            isXMTPEnabled\n          }\n        }\n      }\n    }\n    Base: TokenTransfers(\n      input: {filter: {to: {_eq: $user}}, blockchain: base, limit: 200}\n    ) {\n      TokenTransfer {\n        account: to {\n          addresses\n          domains {\n            name\n            isPrimary\n          }\n          socials {\n            dappName\n            blockchain\n            profileName\n            profileImage\n            profileTokenId\n            profileTokenAddress\n          }\n          xmtp {\n            isXMTPEnabled\n          }\n        }\n      }\n    }\n  }\n";
var fetchTokenReceived = function (address, existingUsers, query) {
    if (existingUsers === void 0) { existingUsers = []; }
    if (query === void 0) { query = tokenReceivedQuery; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, recommendedUsers, _a, data, error, hasNextPage, getNextPage, ethData, polygonData, baseData, tokenTransfer;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    recommendedUsers = __spreadArray([], existingUsers, true);
                    _h.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 9];
                    if (!!res) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, airstack_react_1.fetchQueryWithPagination)(query, {
                            user: address,
                        })];
                case 2:
                    res = _h.sent();
                    _h.label = 3;
                case 3:
                    _a = res !== null && res !== void 0 ? res : {}, data = _a.data, error = _a.error, hasNextPage = _a.hasNextPage, getNextPage = _a.getNextPage;
                    if (!!error) return [3 /*break*/, 7];
                    ethData = ((_c = (_b = data === null || data === void 0 ? void 0 : data.Ethereum) === null || _b === void 0 ? void 0 : _b.TokenTransfer) !== null && _c !== void 0 ? _c : []).map(function (transfer) { return transfer.account; });
                    polygonData = ((_e = (_d = data === null || data === void 0 ? void 0 : data.Polygon) === null || _d === void 0 ? void 0 : _d.TokenTransfer) !== null && _e !== void 0 ? _e : []).map(function (transfer) { return transfer.account; });
                    baseData = ((_g = (_f = data === null || data === void 0 ? void 0 : data.Base) === null || _f === void 0 ? void 0 : _f.TokenTransfer) !== null && _g !== void 0 ? _g : []).map(function (transfer) { return transfer.account; });
                    tokenTransfer = __spreadArray(__spreadArray(__spreadArray([], ethData, true), polygonData, true), baseData, true);
                    recommendedUsers = __spreadArray([], (0, formatTokenReceivedData_1.default)(tokenTransfer, recommendedUsers), true);
                    if (!!hasNextPage) return [3 /*break*/, 4];
                    return [3 /*break*/, 9];
                case 4: return [4 /*yield*/, getNextPage()];
                case 5:
                    res = _h.sent();
                    _h.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    console.error("Error: ", error);
                    return [3 /*break*/, 9];
                case 8: return [3 /*break*/, 1];
                case 9: return [2 /*return*/, recommendedUsers];
            }
        });
    });
};
exports.default = fetchTokenReceived;
