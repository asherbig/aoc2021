import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, charCountMap, countMap, permutations, stringChunks, hexToBinary } from "../utils/index.js";
import { solveQuadraticPositive } from "../utils/maths.js";
import { DefaultDict } from "../utils/objects.js";

const parseInput = (rawInput: string) => {
  return parse(rawInput).lines;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  if (input.length > 10) return;
  console.log('input:', input);

  let out = 0;
  let arr = [];
  // let visited = shadowClone2d(input, 0);
  // for (let i = 0; i < input.length; i++) {
  //   for (let j = 0; j < input[0].length; j++) {
      // let el = input[i][j];
      // let p = new Point(i, j, input);
      // let p = new Point(i, j, input, visited);
      
  //   }
  // }

  return out;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  if (input.length > 10) return;

  let t = 0;

  return t;
};

// recursive util for points
function visitPoints(p: Point<any>): number {
  let out = 0;
  p.allNeighbors.forEach((neighbor) => {
    out += visitPoints(neighbor)
  });
  return out;
}

// recursive util for nodes
function visitNodes(n: Node<string>, visited: Node<string>[] = []): number {
  let out = 0;
  n.neighbors.forEach(neighbor => {
    out += visitNodes(neighbor, [...visited]);
  });
  return out;
}

// TESTS
const testInput = `

`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 1234 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 1234 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
