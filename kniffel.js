// write a function randInt that returns a random integer between input variables low and high (inclusive)
function _randInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
function rollDice() {
    return _randInt(1, 6);
}
var Game = /** @class */ (function () {
    function Game() {
        this.counter = 0;
        this.dices = [];
        for (var i = 0; i < 5; i++) {
            this.dices.push({ value: rollDice(), fixed: false });
        }
    }
    Game.prototype.__printGame = function () {
        console.log("Round: " + this.counter);
        for (var _i = 0, _a = this.dices; _i < _a.length; _i++) {
            var iterator = _a[_i];
            console.log("".concat(iterator.value, " - Fixed=").concat(iterator.fixed));
        }
    };
    Game.prototype.reroll = function (indices) {
        var _this = this;
        indices.forEach(function (value, index) {
            if (value == true) {
                if (_this.dices[index].fixed == false) {
                    _this.dices[index].value = rollDice();
                }
                else {
                    throw new Error("Can't reroll at index ".concat(index, " - Dice is fixed"));
                }
            }
            else {
                _this.dices[index].fixed = true;
            }
            _this.counter++;
        });
    };
    return Game;
}());
var game = new Game();
game.__printGame();
game.reroll([true, false, false, false, false]);
game.__printGame();
game.reroll([false, true, false, false, false]);
game.__printGame();
