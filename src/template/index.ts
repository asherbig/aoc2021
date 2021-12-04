import run from "aocrunner";
import { parse } from "../utils/index.js";


const parseInput = (rawInput: string) => parse(rawInput);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

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
