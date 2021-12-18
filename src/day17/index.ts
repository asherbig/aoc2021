import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, charCountMap, countMap, permutations, stringChunks, hexToBinary } from "../utils/index.js";
import { solveQuadraticPositive } from "../utils/maths.js";
import { DefaultDict } from "../utils/objects.js";

interface Input {
  x: Bounds;
  y: Bounds;
}

interface Bounds {
  min: number;
  max: number;
}

const parseInput = (rawInput: string): Input => {
  let line = parse(rawInput).lines[0];
  let vals = line.match(/(-?\d+)/g).map(x=>+x);
  return {
    x: { min: vals[0], max: vals[1] },
    y: { min: vals[2], max: vals[3] }
  };
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const yMax = (input.y.min * -1) - 1;
  return yMax * (yMax + 1) / 2;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const xMin = Math.ceil(solveQuadraticPositive(1,1, -2 * input.x.min));
  const xMax = input.x.max; // any higher and we will overshoot
  const yMin = input.y.min; // any lower and we overshoot
  const yMax = (input.y.min * -1) - 1;

  let works = 0;
  for(let dx = xMin; dx <= xMax; dx++) {
    for (let dy = yMin; dy <= yMax; dy++) {
      if (shotStats(dx, dy, input)) works++;
    }
  }

  return works;
};

function shotStats(dx: number, dy: number, target: Input): boolean {
  let maxHeight = 0;
  let x = 0;
  let y = 0;
  let ddx = dx > 1 ? -1 : 1;
  let ddy = -1;
  // assumes a negative lower bound for y
  while (x <= target.x.max && y >= target.y.min) {
    if (x <= target.x.max && x >= target.x.min && y >= target.y.min && y <= target.y.max) {
      return true;
    }
    x += dx;
    y += dy;
    if (dx !== 0) dx += ddx;
    dy += ddy;
    maxHeight = Math.max(maxHeight, y);
  }
  return false;
}

// TESTS
const testInput = `
target area: x=20..30, y=-10..-5
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 45 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 112 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
