import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return parse(rawInput).lines.map(l=>l.split('-'));
}

const part1 = (rawInput: string) => {
  const edges = parseInput(rawInput);
  return countPaths(new Node('start', edges));
};

const part2 = (rawInput: string) => {
  const edges = parseInput(rawInput);
  return countPaths2(new Node('start', edges));
};

function countPaths(n: Node<string>, visited: Node<string>[] = []): number {
  visited.push(n);
  if (n.id === 'end') return 1;

  let paths = 0;
  n.neighbors.forEach(neighbor => {
    if (visited.includes(neighbor) && neighbor.small) {
      // can't visit again, this path is dead
    } else {
      // give each child call their own array of visited so they can branch with independent arrays
      paths += countPaths(neighbor, [...visited]);
    }
  });
  return paths;
}

function countPaths2(n: Node<string>, visited: Node<string>[] = []) {
  visited.push(n);
  if (n.id === 'end') return 1;

  let paths = 0;
  n.neighbors.forEach(neighbor => {
    if (visited.includes(neighbor) && neighbor.small) {
      // if the node is small, then it needs to only appear in the list once
      let canVisit = visited.every(n => !n.small || count(visited, n) === 1);
      if (canVisit && neighbor.id !== 'start') {
        paths += countPaths2(neighbor, [...visited]);
      }
    } else {
      paths += countPaths2(neighbor, [...visited]);
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
