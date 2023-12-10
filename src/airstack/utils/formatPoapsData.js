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
function formatPoapsData(poaps, existingUser) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (existingUser === void 0) { existingUser = []; }
    var recommendedUsers = __spreadArray([], existingUser, true);
    var _loop_1 = function (poap) {
        var _k = poap !== null && poap !== void 0 ? poap : {}, attendee = _k.attendee, poapEvent = _k.poapEvent, eventId = _k.eventId;
        var _l = poapEvent !== null && poapEvent !== void 0 ? poapEvent : {}, name_1 = _l.eventName, contentValue = _l.contentValue, blockchain = _l.blockchain;
        var addresses = ((_a = attendee === null || attendee === void 0 ? void 0 : attendee.owner) !== null && _a !== void 0 ? _a : {}).addresses;
        var existingUserIndex = recommendedUsers.findIndex(function (_a) {
            var _b;
            var recommendedUsersAddresses = _a.addresses;
            return (_b = recommendedUsersAddresses === null || recommendedUsersAddresses === void 0 ? void 0 : recommendedUsersAddresses.some) === null || _b === void 0 ? void 0 : _b.call(recommendedUsersAddresses, function (address) { var _a; return (_a = addresses === null || addresses === void 0 ? void 0 : addresses.includes) === null || _a === void 0 ? void 0 : _a.call(addresses, address); });
        });
        if (existingUserIndex !== -1) {
            recommendedUsers[existingUserIndex].addresses = (_d = __spreadArray(__spreadArray([], ((_c = (_b = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _b === void 0 ? void 0 : _b.addresses) !== null && _c !== void 0 ? _c : []), true), (addresses !== null && addresses !== void 0 ? addresses : []), true)) === null || _d === void 0 ? void 0 : _d.filter(function (address, index, array) { return array.indexOf(address) === index; });
            var _poaps = ((_e = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _e === void 0 ? void 0 : _e.poaps) || [];
            var poapExists = _poaps.some(function (poap) { return poap.eventId === eventId; });
            if (!poapExists) {
                _poaps === null || _poaps === void 0 ? void 0 : _poaps.push({ name: name_1, image: (_f = contentValue === null || contentValue === void 0 ? void 0 : contentValue.image) === null || _f === void 0 ? void 0 : _f.extraSmall, eventId: eventId, blockchain: blockchain });
                recommendedUsers[existingUserIndex].poaps = __spreadArray([], _poaps, true);
            }
        }
        else {
            recommendedUsers.push(__assign(__assign({}, ((_g = attendee === null || attendee === void 0 ? void 0 : attendee.owner) !== null && _g !== void 0 ? _g : {})), { poaps: [{ name: name_1, image: (_h = contentValue === null || contentValue === void 0 ? void 0 : contentValue.image) === null || _h === void 0 ? void 0 : _h.extraSmall, eventId: eventId, blockchain: blockchain }] }));
        }
    };
    for (var _i = 0, _j = poaps !== null && poaps !== void 0 ? poaps : []; _i < _j.length; _i++) {
        var poap = _j[_i];
        _loop_1(poap);
    }
    return recommendedUsers;
}
exports.default = formatPoapsData;
