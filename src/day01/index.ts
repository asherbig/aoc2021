import run from 'aocrunner';
import { parse } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  return parse(rawInput).nums;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let count = 0;
  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i-1]) {
      count++;
    }
  }
  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let increases = 0;
  const windowSize = 3;

  for (let right = windowSize; right < input.length; right++) {
    if (input[right] > input[right - windowSize]) { increases++; }
  }

  return increases;
};

run({
  part1: {
    tests: [
       { input: `199
200
208
210
200
207
240
269
260
263`, expected: 7 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
       { input: `199
200
208
210
200
207
240
269
260
263`, expected: 5 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
