import run from "aocrunner";
import { Point } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  return parse(rawInput).lines;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  if (input.length > 10) { return; }

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  if (input.length > 10) { return; }

  return;
};

// TESTS
const testInput = `

`;

run({
  part1: {
    tests: [
      { input: testInput, expected: '' },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: '' },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
