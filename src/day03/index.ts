import run from "aocrunner";
import { parse } from "../utils/index.js";

const parseInput = (rawInput: string) => parse(rawInput).lines;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // val < 0 means 0 was more common
  // val > 0 means 1 was more common
  const vals = input.reduce((columnValues, str) => {
    for (let i = 0; i < str.length; i++) {
      columnValues[i] += str[i] === '0' ? -1 : 1;
    }
    return columnValues;
  }, new Array(input[0].length).fill(0));

  const mostCommon = vals.map(v => v < 0 ? '0' : '1');
  const leastCommon = vals.map(v => v > 0 ? '0' : '1');

  const gamma = parseInt(mostCommon.join(''), 2);
  const epsilon = parseInt(leastCommon.join(''), 2);

  return gamma * epsilon;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const oxygen = parseInt(findMatchingBinary(input, 'max'), 2);
  const co2 = parseInt(findMatchingBinary(input, 'min'), 2);

  return oxygen * co2
};

const findMatchingBinary = (input: string[], minmax: 'min' | 'max') => {
  let indexes = [...Array(input.length).keys()];

  for (let i = 0; i < input[0].length; i++) {
    if (indexes.length === 1) { break; }

    // val < 0 means 0 was more common
    // val > 0 means 1 was more common
    const totalForIndex = indexes.reduce((value, j) => {
      const str = input[j];
      value += str[i] === '0' ? -1 : 1;
      return value;
    }, 0);
    // O2 prefers '1' in a tie
    let char = '';
    if (minmax === 'max') { // O2
      char = totalForIndex < 0 ? '0' : '1';
    } else { // CO2
      char = totalForIndex < 0 ? '1' : '0';
    }

    indexes = indexes.filter((j) => input[j][i] === char);
  }

  return input[indexes[0]];
}

run({
  part1: {
    tests: [
      {
        input: `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`, expected: 198
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`, expected: 230
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
