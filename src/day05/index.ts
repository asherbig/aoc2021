import run from "aocrunner";
import { parse, new2dArray, transpose } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  let lines = parse(rawInput).lines;
  let parsedLines = lines.map(line => line.replace('->', '').split('  ').map(coord => coord.split(',').map(x => +x)));
  return parsedLines;
}

const part1 = (rawInput: string) => {
  return getSolution(rawInput, false);
};

const part2 = (rawInput: string) => {
  return getSolution(rawInput, true);
};

const getSolution = (rawInput: string, diagonals: boolean): number => {
  const lines = parseInput(rawInput);
  const mapSize = Math.max(...lines.flat().flat()) + 1;
  const map = new2dArray(mapSize, mapSize, 0);
  // draw the lines on the map
  let numWhereAtLeast2Lines = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let [x1, y1] = line[0];
    let [x2, y2] = line[1];

    let dx = 0, dy = 0; // 0 the base case for when they're equal
    if (x1 < x2) { dx = 1 }
    else if (x1 > x2) { dx = -1 }

    if (y1 < y2) { dy = 1 }
    else if (y1 > y2) { dy = -1 }

    if (!diagonals && dx !== 0 && dy !== 0) {
      continue;
    }

    let length = Math.max(Math.abs(x1-x2), Math.abs(y1-y2)) + 1;

    let marked = 0;
    let x = x1;
    let y = y1;
    while (marked < length) {
      map[y][x]++;
      marked++;
      if (map[y][x] === 2) { numWhereAtLeast2Lines++; }
      x += dx;
      y += dy;
    }
  }
  return numWhereAtLeast2Lines;
}


// TESTS
const testInput = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 5 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 12 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
