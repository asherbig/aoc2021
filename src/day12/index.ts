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

function countPaths(n: Node<string>, part2: boolean, visited: Node<string>[] = []) {
  visited.push(n);
  if (n.id === 'end') return 1;

  let paths = 0;
  n.neighbors.forEach(neighbor => {
    if (visited.includes(neighbor) && neighbor.small) {
      if (part2) {
        // if the node is small, then it needs to only appear in the list once
        let canVisit = visited.every(n => !n.small || count(visited, n) === 1);
        if (canVisit && neighbor.id !== 'start') {
          paths += countPaths(neighbor, part2, [...visited]);
        }
      }
    } else {
      paths += countPaths(neighbor, part2, [...visited]);
    }
  });
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
