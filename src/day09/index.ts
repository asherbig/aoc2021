import run from "aocrunner";
import { Point } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return parse(rawInput).lines.map(l => [...l].map(x=>+x));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const p = new Point(i, j, input);
      if (p.plusNeighbors.every((n) => n.val > p.val)) {
        sum += p.val + 1;
      }
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const visited = shadowClone2d(input, 0);
  const basinSizes = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const p = new Point(i, j, input, visited);
      if (p.val !== 9 && !p.visited) {
        basinSizes.push(visitNeighbors(p));
      }
    }
  }

  return basinSizes.sort((a,b) => b-a).slice(0,3).reduce((product, val) => (product *= val), 1);
};

function visitNeighbors(p: Point<number>): number {
  p.visit();
  let num = 1; // visited 1 point in this call
  let neighbors = p.plusNeighbors.filter(p => p.val !== 9);
  neighbors.forEach(p => {
    if (!p.visited) {
      num += visitNeighbors(p); // plus any points visited later in the call stack
    }
  });
  return num;
}

// TESTS
const testInput = `
2199943210
3987894921
9856789892
8767896789
9899965678
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 15 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 1134 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
