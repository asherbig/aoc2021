import run from "aocrunner";
import { Point } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  return parse(rawInput).lines.map(l => [...l].map(x=>+x));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let flashes = 0;
  for(let step = 0; step < 100; step++) {
    let toFlash: Point<number>[] = [];
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[0].length; j++) {
        let p = new Point(i,j,input);
        p.val++
        if (p.val === 10) {
          toFlash.push(p);
        }
      }
    }
    toFlash.forEach((p) => flashes += visitNeighbors(p));
  }
  
  return flashes;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let flashes = 0;
  let step = 0;
  while (flashes < input.flat().length) {
    flashes = 0;
    let flashed: Point<number>[] = [];
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[0].length; j++) {
        let p = new Point(i,j,input);
        p.val++;
        if (p.val === 10) {
          flashed.push(p);
        }
      }
    }
    flashed.forEach(p => flashes += visitNeighbors(p));
    step++;
  }
  
  return step;
};

// called only when a point is going to flash
function visitNeighbors(p: Point<number>): number {
  let flashes = 1;
  p.val = 0;
  let neighbors = p.allNeighbors;
  neighbors.forEach((p) => {
    if (p.val !== 0) {
      p.val++;
      if (p.val === 10) {
        flashes += visitNeighbors(p);
      }
    }
  });
  return flashes;
}

// TESTS
const testInput = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 1656 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 195 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
