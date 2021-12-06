import run from "aocrunner";
import { parse, new2dArray, transpose, range, sum } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return parse(rawInput).lines[0].split(',').map(x => +x);
}

const part1 = (rawInput: string) => {
  return numAtDay(rawInput, 80);
};

const part2 = (rawInput: string) => {
  return numAtDay(rawInput, 256);
};

const numAtDay = (rawInput: string, days: number) => {
  const fish = parseInput(rawInput);

  const buckets = Array(9).fill(0);
  for (let i = 0; i < fish.length; i++) {
    buckets[fish[i]]++;
  }

  for (let day = 0; day < days; day++) {
    const dayZeroFish = buckets.shift();
    buckets[6] += dayZeroFish;
    buckets[8] = dayZeroFish;
  }

  return sum(buckets);
};

// TESTS
const testInput = `
3,4,3,1,2
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 5934 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 26984457539 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
