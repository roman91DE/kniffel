var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// write a function randInt that returns a random integer between input variables low and high (inclusive)
function _randInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
function rollDice() {
    return _randInt(1, 6);
}
var Round = /** @class */ (function () {
    function Round() {
        this.counter = 0;
        this.dices = [];
        for (var i = 0; i < 5; i++) {
            this.dices.push({ value: rollDice(), fixed: false });
        }
    }
    Round.prototype.__printState__ = function () {
        console.log("Round: " + this.counter);
        for (var _i = 0, _a = this.dices; _i < _a.length; _i++) {
            var iterator = _a[_i];
            console.log("".concat(iterator.value, " - Fixed=").concat(iterator.fixed));
        }
    };
    Round.prototype.reroll = function (indices) {
        var _this = this;
        if (!this.canReroll()) {
            throw new Error("Can't reroll - Counter reached ".concat(this.counter));
        }
        this.counter++;
        indices.forEach(function (value, index) {
            if (value == true) {
                if (_this.dices[index].fixed == false) {
                    _this.dices[index].value = rollDice();
                }
                else {
                    throw new Error("Can't reroll dice at index ".concat(index, " - Fixed dice"));
                }
            }
            else {
                _this.dices[index].fixed = true;
            }
        });
    };
    Round.prototype.canReroll = function () {
        return this.counter < 2;
    };
    return Round;
}());
var partial = function (func) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        return func.apply(void 0, __spreadArray(__spreadArray([], args, false), rest, false));
    };
};
function countValOnly(val, dices) {
    return dices.filter(function (dice) { return dice.value == val; }).map(function (dice) { return dice.value; }).reduce(function (a, b) { return a + b; }, 0);
}
var ScoringBoard = {
    ones: partial(countValOnly, 1),
    twos: partial(countValOnly, 2),
    threes: partial(countValOnly, 3),
    fours: partial(countValOnly, 4),
    fives: partial(countValOnly, 5),
    sixes: partial(countValOnly, 6),
    threeOfAKind: 0,
    fourOfAKind: 0,
    fullHouse: 0,
    smallStraight: 0,
    largeStraight: 0,
    chance: 0,
    yahtzee: 0,
};
function test_round() {
    var round = new Round();
    round.__printState__();
    round.reroll([true, false, false, false, false]);
    round.__printState__();
    round.reroll([true, false, false, false, false]);
    round.__printState__();
    round.reroll([true, false, false, false, false]);
}
test_round();
