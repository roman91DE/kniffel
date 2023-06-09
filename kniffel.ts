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

function countValOnly(val: number, dices: Dice[]): number {
    return dices.filter((dice) => dice.value == val).map((dice) => dice.value).reduce((a, b) => a + b, 0);
}

function countPairs(minNumMatches: number, dices: Dice[]): number {
    // check if a dices.value is at least minMatch times inside the dices array
    let valid_choice = false;
    for (let i = 1; i <= 6; i++) {
        if (dices.filter((dice) => dice.value == i).length >= minNumMatches) {
            valid_choice = true;
            break;
        }
    }
    if (!valid_choice) {
        return 0;
    }
    // special case for yahtzee!
    if (minNumMatches == 5) {
        return 50;
    } else {
        return dices.map((dice) => dice.value).reduce((a, b) => a + b, 0);
    }
}

function countAll(dices: Dice[]): number {
    return dices.map((dice) => dice.value).reduce((a, b) => a + b, 0);
}

function makeScoringBoard(): Object {
    return {
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
    }
}

class Game {
    counter: number;
    dices: Dice[];
    scoringBoard: Object;

    constructor() {
        this.counter = 0;
        this.dices = [];
        for (let i = 0; i < 5; i++) {
            this.dices.push({ value: rollDice(), fixed: false });
        }
        this.scoringBoard = makeScoringBoard();
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
        return this.counter < 3;
    }
    getScore(choice: string): number {
        if (this.scoringBoard[choice]["available"] == false) {
            throw new Error(`Can't get score for ${choice} - Already used`);
        }
        this.scoringBoard[choice]["available"] = false;
        if (this.scoringBoard[choice]["args"].length == 0) {
            // evaluation function has no arguments
            return this.scoringBoard[choice]["evaluationFunction"](this.dices);
        } else {
            return this.scoringBoard[choice]["evaluationFunction"](this.scoringBoard[choice]["args"][0], this.dices);
        }
    }
    displayDices() {
        console.log("displayDices() called")
        const outputTagIDS = ["dice1", "dice2", "dice3", "dice4", "dice5"];
        for (let i = 0; i < 5; i++) {
            const tag = <HTMLInputElement | null>document.getElementById(outputTagIDS[i])
            if (tag == null) {
                console.log("Did not find tag with id " + outputTagIDS[i])
                throw new Error(`Can't find tag with id ${outputTagIDS[i]}`);
            }
            tag.innerHTML = this.dices[i].value.toString();
        }
    }
    getDiceIndices(): boolean[] {
        const indices = [false, false, false, false, false];
        for (let i = 0; i < 5; i++) {
            const tag = <HTMLInputElement | null>document.getElementById(`checkbox${i+1}`)
            if (tag == null) {
                console.log("Did not find tag with id " + `checkbox${i+1}`);
                throw new Error(`Can't find tag with id ${`checkbox${i+1}`}`);
            } else {
                if (tag.checked) {
                    indices[i] = true;
                }
            }
        }
        return indices;

    }

    setDiceCheckboxState() {
        const checkboxTagIDS = ["checkbox1", "checkbox2", "checkbox3", "checkbox4", "checkbox5"];
        for (let i = 0; i < 5; i++) {
            const tag = <HTMLInputElement | null>document.getElementById(checkboxTagIDS[i])
            if (tag == null) {
                console.log("Did not find tag with id " + checkboxTagIDS[i])
                throw new Error(`Can't find tag with id ${checkboxTagIDS[i]}`);
            }
            if (this.dices[i].fixed) {
                tag.disabled = true;
            } else {
                tag.disabled = false;
            }
        }
    }

    clickedRollButton() {
        if (this.counter == 0) {
            this.displayDices();
            this.counter++;
        } else {
            if (this.canReroll()) {
                this.reroll(this.getDiceIndices());
                this.displayDices();
            }
        }
        this.setDiceCheckboxState();
    }
}


// instantiate the main object
const game = new Game();

