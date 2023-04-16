// write a function randInt that returns a random integer between input variables low and high (inclusive)
function _randInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
function rollDice() {
    return _randInt(1, 6);
}
function countValOnly(val, dices) {
    return dices.filter(function (dice) { return dice.value == val; }).map(function (dice) { return dice.value; }).reduce(function (a, b) { return a + b; }, 0);
}
function countPairs(minNumMatches, dices) {
    // check if a dices.value is at least minMatch times inside the dices array
    var valid_choice = false;
    var _loop_1 = function (i) {
        if (dices.filter(function (dice) { return dice.value == i; }).length >= minNumMatches) {
            valid_choice = true;
            return "break";
        }
    };
    for (var i = 1; i <= 6; i++) {
        var state_1 = _loop_1(i);
        if (state_1 === "break")
            break;
    }
    if (!valid_choice) {
        return 0;
    }
    // special case for yahtzee!
    if (minNumMatches == 5) {
        return 50;
    }
    else {
        return dices.map(function (dice) { return dice.value; }).reduce(function (a, b) { return a + b; }, 0);
    }
}
function countAll(dices) {
    return dices.map(function (dice) { return dice.value; }).reduce(function (a, b) { return a + b; }, 0);
}
var ScoringBoard = {
    ones: {
        evaluationFunction: countValOnly,
        args: [1],
        available: true,
    },
    twos: {
        evaluationFunction: countValOnly,
        args: [2],
        available: true,
    },
    threes: {
        evaluationFunction: countValOnly,
        args: [3],
        available: true,
    },
    fours: {
        evaluationFunction: countValOnly,
        args: [4],
        available: true,
    },
    fives: {
        evaluationFunction: countValOnly,
        args: [5],
        available: true,
    },
    sixes: {
        evaluationFunction: countValOnly,
        args: [6],
        available: true,
    },
    threeOfAKind: {
        evaluationFunction: countPairs,
        args: [3],
        available: true,
    },
    fourOfAKind: {
        evaluationFunction: countPairs,
        args: [4],
        available: true,
    },
    // fullHouse: 0,
    // smallStraight: 0,
    // largeStraight: 0,
    chance: {
        evaluationFunction: countAll,
        args: [],
        available: true,
    },
    yahtzee: {
        evaluationFunction: countPairs,
        args: [5],
        available: true,
    },
};
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
    Round.prototype.getScore = function (choice) {
        if (ScoringBoard[choice]["available"] == false) {
            throw new Error("Can't get score for ".concat(choice, " - Already used"));
        }
        ScoringBoard[choice]["available"] = false;
        if (ScoringBoard[choice]["args"].length == 0) {
            // evaluation function has no arguments
            return ScoringBoard[choice]["evaluationFunction"](this.dices);
        }
        else {
            return ScoringBoard[choice]["evaluationFunction"](ScoringBoard[choice]["args"][0], this.dices);
        }
    };
    return Round;
}());
function test_round() {
    var target = "chance";
    var round = new Round();
    round.__printState__();
    console.log("Score for ".concat(target, ": ").concat(round.getScore(target)));
    //     round.reroll([true, true, true, true, true]);
    //     round.__printState__();
    //     console.log(`Score for ${target}: ${round.getScore(target)}`);
    //     round.reroll([true, true, true, true, true]);
    //     round.__printState__();
    //     console.log(`Score for ${target}: ${round.getScore(target)}`);
}
test_round();
