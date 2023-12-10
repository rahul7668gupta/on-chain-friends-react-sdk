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
function formatLensFollowingsData(followings, existingUser) {
    var _a, _b, _c, _d;
    if (existingUser === void 0) { existingUser = []; }
    var recommendedUsers = __spreadArray([], existingUser, true);
    var _loop_1 = function (following) {
        var existingUserIndex = recommendedUsers.findIndex(function (_a) {
            var _b;
            var recommendedUsersAddresses = _a.addresses;
            return (_b = recommendedUsersAddresses === null || recommendedUsersAddresses === void 0 ? void 0 : recommendedUsersAddresses.some) === null || _b === void 0 ? void 0 : _b.call(recommendedUsersAddresses, function (address) { var _a, _b; return (_b = (_a = following.addresses) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, address); });
        });
        var followsBack = Boolean((_b = (_a = following === null || following === void 0 ? void 0 : following.mutualFollower) === null || _a === void 0 ? void 0 : _a.Follower) === null || _b === void 0 ? void 0 : _b[0]);
        if (existingUserIndex !== -1) {
            var follows = (_d = (_c = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _c === void 0 ? void 0 : _c.follows) !== null && _d !== void 0 ? _d : {};
            recommendedUsers[existingUserIndex] = __assign(__assign(__assign({}, following), recommendedUsers[existingUserIndex]), { follows: __assign(__assign({}, follows), { followingOnLens: true, followedOnLens: followsBack }) });
        }
        else {
            recommendedUsers.push(__assign(__assign({}, following), { follows: {
                    followingOnLens: true,
                    followedOnLens: followsBack,
                } }));
        }
    };
    for (var _i = 0, followings_1 = followings; _i < followings_1.length; _i++) {
        var following = followings_1[_i];
        _loop_1(following);
    }
    return recommendedUsers;
}
exports.default = formatLensFollowingsData;
