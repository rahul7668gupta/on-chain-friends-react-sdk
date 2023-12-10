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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPoapEventDetails = exports.fetchNftDetails = exports.fetchOnChainGraphData = void 0;
var fetchPoapEventDetails_1 = require("./airstack/functions/fetchPoapEventDetails");
exports.fetchPoapEventDetails = fetchPoapEventDetails_1.default;
var fetchNftDetails_1 = require("./airstack/functions/fetchNftDetails");
exports.fetchNftDetails = fetchNftDetails_1.default;
var fetchPoapsData_1 = require("./airstack/functions/fetchPoapsData");
var fetchFarcasterFollowings_1 = require("./airstack/functions/fetchFarcasterFollowings");
var fetchLensFollowings_1 = require("./airstack/functions/fetchLensFollowings");
var fetchFarcasterFollowers_1 = require("./airstack/functions/fetchFarcasterFollowers");
var fetchLensFollowers_1 = require("./airstack/functions/fetchLensFollowers");
var fetchTokenSent_1 = require("./airstack/functions/fetchTokenSent");
var fetchTokenReceived_1 = require("./airstack/functions/fetchTokenReceived");
var fetchEthNft_1 = require("./airstack/functions/fetchEthNft");
var fetchPolygonNft_1 = require("./airstack/functions/fetchPolygonNft");
var fetchBaseNft_1 = require("./airstack/functions/fetchBaseNft");
var fetchOnChainGraphData = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var recommendedUsers, fetchFunctions, _i, fetchFunctions_1, func;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                recommendedUsers = [];
                fetchFunctions = [
                    fetchPoapsData_1.default,
                    fetchFarcasterFollowings_1.default,
                    fetchFarcasterFollowers_1.default,
                    fetchLensFollowings_1.default,
                    fetchLensFollowers_1.default,
                    fetchTokenSent_1.default,
                    fetchTokenReceived_1.default,
                    fetchEthNft_1.default,
                    fetchPolygonNft_1.default,
                    fetchBaseNft_1.default,
                ];
                _i = 0, fetchFunctions_1 = fetchFunctions;
                _a.label = 1;
            case 1:
                if (!(_i < fetchFunctions_1.length)) return [3 /*break*/, 4];
                func = fetchFunctions_1[_i];
                return [4 /*yield*/, func(address, recommendedUsers)];
            case 2:
                recommendedUsers = _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, recommendedUsers];
        }
    });
}); };
exports.fetchOnChainGraphData = fetchOnChainGraphData;
