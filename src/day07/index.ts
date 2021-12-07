import run from "aocrunner";
import { parse, new2dArray, transpose, range, sum } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  return parse(rawInput).lines[0].split(',').map(x=>+x);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const maxPos = Math.max(...input);

  let minFuel = maxPos * input.length;
  for (let i = 0; i <= maxPos; i++) {
    let sum = 0;
    for (let j = 0; j < input.length; j++) {
      sum += Math.abs(input[j] - i);
    }
    minFuel = Math.min(minFuel, sum);
  }
  return minFuel;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const maxPos = Math.max(...input);
  const fuelCost: {[key: number]: number} = {};
  let curCost = 0;
  for (let i = 0; i <= maxPos; i++) {
    curCost += i;
    fuelCost[i] = curCost;
  }

  let minFuel = maxPos * fuelCost[maxPos];
  for (let i = 0; i <= maxPos; i++) {
    let sum = 0;
    for (let j = 0; j < input.length; j++) {
      sum += fuelCost[Math.abs(input[j] - i)];
    }
    minFuel = Math.min(minFuel, sum);
  }
  return minFuel;
};

// TESTS
const testInput = `
16,1,2,0,4,2,7,1,2,14
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 37 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 168 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
