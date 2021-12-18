import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, charCountMap, countMap, permutations, stringChunks } from "../utils/index.js";
import { DefaultDict } from "../utils/objects.js";

interface PairMeta {
  [key: string]: {
    newChar: string;
    count: number;
    newPairs: string[];
  }
}

const parseInput = (rawInput: string) => {
  const parts = parse(rawInput).paragraphs;
  const s = parts[0].trim();
  const rawPairs = parts[1].split('\n').map(l => l.split(' -> '));
  return {s, rawPairs};
}

const part1 = (rawInput: string) => {
  // const input = parseInput(rawInput);
  // let {s, pairs} = input;

  // const insertionMap = {};
  // insertions.forEach(([pair, c]) => insertionMap[pair] = c);

  // // console.log(insertionMap)
  // for (let step = 0; step < 10; step++) {
  //   s = doStepOnString(s, insertionMap);
  // }

  // const countMap: {[key: string]: number} = {};

  // [...s].forEach(c => {
  //   if (!countMap[c]) countMap[c] = 0;
  //   countMap[c]++;
  // });

  // let minCount = Math.min(...Object.values(countMap))
  // let maxCount = Math.max(...Object.values(countMap))

  // return maxCount - minCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // if (input.insertions.length > 20) return;
  // console.log('input:', input);
  let {s, rawPairs} = input;


  const pairMeta: PairMeta = {};
  rawPairs.forEach(([pair, c]) => {
    pairMeta[pair] = {
      newChar: c,
      count: 0,
      newPairs: [pair[0] + c, c + pair[1]]
    }
  });

  const charCounts = charCountMap(s);
  // get the initial counts for each pair
  stringChunks(s, 2).forEach((pair) => pairMeta[pair].count++);

  for (let step = 0; step < 40; step++) {
    doStep(pairMeta, charCounts);
  }

  let minCount = Math.min(...Object.values(charCounts))
  let maxCount = Math.max(...Object.values(charCounts))

  return maxCount - minCount;
};

function doStepOnString(s: string, insertionMap): string {
  let newString = '';
  for (let j = s.length - 1; j > 0; j--) {
    const pair = s[j-1] + s[j];
      if (insertionMap[pair]) {
        newString = insertionMap[pair] + s[j] + newString;
      } else {
        newString = s[j] + newString;
      }
      if (j === 1) {
        newString = s[j-1] + newString;
      }
  }
  return newString;
}

function doStep(pairMeta: PairMeta, charCounts: {[key: string]: number}) {
  const bucketsSnapshot = Object.entries(pairMeta).map()
  for (const [pair, count] of Object.entries(buckets)) {
    const newChar = insertionMap[pair];
    // add the new char to the map
    if (!charCounts[newChar])
      charCounts[newChar] = 0;
    charCounts[newChar] += count;
    // add the new pairs to the buckets
    const newPairs = pairOutputs[pair];
    newPairs.forEach(pair => {
      if (!newBuckets[pair])
        newBuckets[pair] = 0;
      newBuckets[pair] += count;
    });
  }
}

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
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 1588 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 2188189693529 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
