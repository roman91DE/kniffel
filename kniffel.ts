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

class Game {
    counter: number;
    dices: Dice[];

    constructor() {
        this.counter = 0;
        this.dices = [];
        for (let i = 0; i < 5; i++) {
            this.dices.push({ value: rollDice(), fixed: false });
        }
    }

    __printGame() {
        console.log("Round: " + this.counter);
        for (const iterator of this.dices) {
            console.log(`${iterator.value} - Fixed=${iterator.fixed}`);
        }
    }

    reroll(indices: boolean[]) {
        indices.forEach((value, index) => {
            if (value == true) {
                if (this.dices[index].fixed == false) {
                    this.dices[index].value = rollDice();
                } else {
                    throw new Error(`Can't reroll at index ${index} - Dice is fixed`);
                }
            }
            else {
                this.dices[index].fixed = true;
            }
            this.counter++;
        });
    }
    canReroll(): boolean {
        return this.counter < 2;
    }

}

function main() {
    let game = new Game();
    game.__printGame();
    game.reroll([true, false, false, false, false]);
    game.__printGame();
    game.reroll([false, true, false, false, false]);
    game.__printGame();
}
