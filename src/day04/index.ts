import run from "aocrunner";
import { parse } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const input = parse(rawInput).paragraphs;
  const nums = input[0].split(',').map(x => +x);
  const boards = input.slice(1).map(unparsed => new Board(unparsed.split('\n').map(row => row.trim().split(/ +/).map(x => +x))));
  return { nums, boards };
}

class Board {
  grid: number[][];
  // for every bingo number this card has, there is a coordinate stored in this array.
  // this makes the time to check and mark a hit O(1)
  // at the cost of adding O(N) more memory for each card
  coords: {[key: number]: number[]} = {};
  won: boolean = false;
  size: number;
  remainingSum: number;
  private numsHit = 0;

  constructor(nums: number[][]) {
    this.grid = nums;
    this.size = nums.length;
    this.createCoords();
    this.remainingSum = this.totalGrid();
  };

  createCoords() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        this.coords[this.grid[i][j]] = [i, j];
      }
    }
  }

  callNumber(num: number) {
    const coords = this.coords[num];
    
    if (coords) {
      const [i, j] = coords;
      // use the original grid to "store" hits as -1
      this.grid[i][j] = -1;
      this.numsHit++;
      this.remainingSum -= num;
      if (this.numsHit >= this.grid.length) {
        // only check for a win after at least 5 hits
        this.checkForWin();
      }
    }
  }

  private totalGrid() {
    return this.grid.reduce((rowSum, row) => rowSum += row.reduce((sum, x) => sum += (x === -1 ? 0 : x), 0), 0);
  }

  private checkForWin() {
    for (let i = 0; i < this.grid.length && !this.won; i++) {
      this.won = this.row(i).every(x => x === -1) || this.col(i).every(x => x === -1);
    }
  }

  private row(idx: number): number[] {
    return this.grid[idx];
  }

  private col(idx: number): number[] {
    return this.grid.map((row) => row[idx]);
  }
}


const part1 = (rawInput: string) => {
  let { nums, boards } = parseInput(rawInput);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let k = 0; k < boards.length; k++) {
      const board = boards[k];
      board.callNumber(num);
      if (board.won) {
        return board.remainingSum * num;
      }
    }
  }
};

const part2 = (rawInput: string) => {
  let { nums, boards } = parseInput(rawInput);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let k = 0; k < boards.length; k++) {
      const board = boards[k];
      board.callNumber(num);
    }
    if (boards.length === 1 && boards[0].won) {
      return boards[0].remainingSum * num;
    }
    boards = boards.filter((board) => !board.won);
  }
};

// TESTS
const testInput = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 4512 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 1924 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
