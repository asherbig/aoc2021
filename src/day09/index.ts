import run from "aocrunner";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return parse(rawInput).lines.map(l => [...l].map(x=>+x));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const val = input?.[i]?.[j];
      const neighbors = getNeighbors(i,j, input);
      if (neighbors.every(([a,b]) => input[a][b] > val)) {
        sum += val + 1;
      }
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const visited: {[key: string]: boolean} = {};
  let lastVisitedCount = 0;
  const basinSizes = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const val = input[i][j];
      if (val !== 9 && !visited[String([i,j])]) {
        visitNeighbors(i, j, input, visited);
      }
      basinSizes.push(Object.values(visited).length - lastVisitedCount);
      lastVisitedCount = Object.values(visited).length;
    }
  }

  return basinSizes.sort((a,b) => b-a).slice(0,3).reduce((product, val) => (product *= val), 1);
};

// returns valid neighbors for a pair of coords
function getNeighbors(i, j, input) {
  let neighbors: number[][] = [
    [i-1, j],
    [i+1, j],
    [i, j-1],
    [i, j+1]
  ]
  return neighbors.filter(([i, j]) => input?.[i]?.[j] !== undefined);
}

function visitNeighbors(i: number, j: number, input: number[][], visited) {
  visited[String([i,j])] = true;
  let neighbors = getNeighbors(i, j, input);
  neighbors = neighbors.filter(([i, j]) => input[i][j] !== 9 && !visited[String([i,j])]);
  neighbors.forEach(([i,j]) => visitNeighbors(i, j, input, visited));
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
