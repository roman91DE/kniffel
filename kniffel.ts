// write a function randInt that returns a random integer between input variables low and high (inclusive)
function _randInt(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function rollDice(): number {
    return _randInt(1, 6);
}

type Dice = {
    value: number;
    fixed: boolean;
}

class Round {
    counter: number;
    dices: Dice[];

    constructor() {
        this.counter = 0;
        this.dices = [];
        for (let i = 0; i < 5; i++) {
            this.dices.push({ value: rollDice(), fixed: false });
        }
    }

    __printState__() {
        console.log("Round: " + this.counter);
        for (const iterator of this.dices) {
            console.log(`${iterator.value} - Fixed=${iterator.fixed}`);
        }
    }

    reroll(indices: boolean[]) {
        if (!this.canReroll()) {
            throw new Error(`Can't reroll - Counter reached ${this.counter}`);
        }
        this.counter++;
        indices.forEach((value, index) => {
            if (value == true) {
                if (this.dices[index].fixed == false) {
                    this.dices[index].value = rollDice();
                } else {
                    throw new Error(`Can't reroll dice at index ${index} - Fixed dice`);
                }
            }
            else {
                this.dices[index].fixed = true;
            }
        });
    }
    canReroll(): boolean {
        return this.counter < 2;
    }
}

const partial = (func, ...args) => (...rest) => func(...args, ...rest);


function countValOnly(val: number, dices: Dice[]) : number  {
    return dices.filter((dice) => dice.value == val).map((dice) => dice.value).reduce((a, b) => a + b, 0);
}


const ScoringBoard = {
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
}

function test_round() {
    let round = new Round();
    round.__printState__();
    round.reroll([true, false, false, false, false]);
    round.__printState__();
    round.reroll([true, false, false, false, false]);
    round.__printState__();
    round.reroll([true, false, false, false, false]);
}

test_round();