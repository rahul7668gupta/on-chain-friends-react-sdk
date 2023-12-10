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
function formatFarcasterFollowersData(followers, existingUser) {
    var _a, _b, _c, _d;
    if (existingUser === void 0) { existingUser = []; }
    var recommendedUsers = __spreadArray([], existingUser, true);
    var _loop_1 = function (follower) {
        var existingUserIndex = recommendedUsers.findIndex(function (_a) {
            var _b;
            var recommendedUsersAddresses = _a.addresses;
            return (_b = recommendedUsersAddresses === null || recommendedUsersAddresses === void 0 ? void 0 : recommendedUsersAddresses.some) === null || _b === void 0 ? void 0 : _b.call(recommendedUsersAddresses, function (address) { var _a, _b; return (_b = (_a = follower.addresses) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, address); });
        });
        var following = Boolean((_b = (_a = follower === null || follower === void 0 ? void 0 : follower.mutualFollowing) === null || _a === void 0 ? void 0 : _a.Following) === null || _b === void 0 ? void 0 : _b.length);
        if (existingUserIndex !== -1) {
            var follows = (_d = (_c = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _c === void 0 ? void 0 : _c.follows) !== null && _d !== void 0 ? _d : {};
            follows.followedOnFarcaster = true;
            follows.followingOnFarcaster = follows.followingOnFarcaster || following;
            recommendedUsers[existingUserIndex] = __assign(__assign(__assign({}, follower), recommendedUsers[existingUserIndex]), { follows: follows });
        }
        else {
            recommendedUsers.push(__assign(__assign({}, follower), { follows: {
                    followingOnFarcaster: following,
                    followedOnFarcaster: true,
                } }));
        }
    };
    for (var _i = 0, followers_1 = followers; _i < followers_1.length; _i++) {
        var follower = followers_1[_i];
        _loop_1(follower);
    }
    return recommendedUsers;
}
exports.default = formatFarcasterFollowersData;
