import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return parse(rawInput).lines.map(l=>l.split('-'));
}

const part1 = (rawInput: string) => {
  const edges = parseInput(rawInput);
  return countPaths(new Node('start', edges), false);
};

const part2 = (rawInput: string) => {
  const edges = parseInput(rawInput);
  return countPaths(new Node('start', edges), true);
};

function countPaths(n: Node<string>, part2: boolean, smallRevisited = false, visited: Node<string>[] = []) {
  if (n.id === 'end') return 1;
  visited.push(n);

  let paths = 0;
  n.neighbors.forEach(neighbor => {
    if (visited.includes(neighbor) && neighbor.small) {
      if (part2 && !smallRevisited && neighbor.id !== 'start') {
        paths += countPaths(neighbor, part2, true, visited);
      }
    } else {
      paths += countPaths(neighbor, part2, smallRevisited, visited);
    }
  });
  visited.pop();
  return paths;
}

// TESTS
const testInput = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 10 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 36 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
