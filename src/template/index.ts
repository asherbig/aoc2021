import run from "aocrunner";
import { parse, new2dArray, transpose } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  return parse(rawInput);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // if (input.length > 10) { return; }

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // if (input.length > 10) { return; }

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
