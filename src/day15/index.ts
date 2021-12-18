import run from "aocrunner";
import { Point, Node, PointFactory } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, charCountMap, countMap, permutations, stringChunks } from "../utils/index.js";
import { DefaultDict } from "../utils/objects.js";

const parseInput = (rawInput: string) => {
  return parse(rawInput).lines.map(l => [...l].map(x=>+x));
}

const part1 = (rawInput: string) => {
  return;
  let input = parseInput(rawInput);
  if (input.length > 10) return;
  // console.log('input:', input);
  // input = [
  //   [1,1,1],
  //   [1,1,1],
  //   [1,1,1]
  // ]
  let minRisks: number[][] = shadowClone2d(input, -1);

  let pointFactory = new PointFactory<number>(minRisks);


  for (let d = (minRisks.length - 1) * 2; d >= 0; d--) {
    // d is distance
    // since i + j = d, then a lower limit for i can be derived from d
    // the highest value i or j can be is (arr.length - 1), let's say that arr.length is 3
    // that means that i or j will never be higher than 2.
    // do if d is 3, and we know j cannot be higher than 2, which means i could be 1, but not 0
    let iMin = Math.max(0, d - minRisks.length + 1);
    // since i + j = d, then d serves as an upper limit for what i can be.
    // ex: if d is 1, then i's max value is also 1 since j can't be negative
    let iMax = Math.min(minRisks.length - 1, d);
    for (let i = iMin; i <= iMax; i++) {
      let j = d - i;
      // say we've calculated the grid like
      // x x x
      // x x 2
      // x 3 1
      // to calculate the next diagonal, we say the min distance to
      // any point (i, j) is the min of any of its adjacent neighbors
      // plus the value of (i, j) itself
      // min(point.neighbors) + 
      let p = pointFactory.newPoint(i, j);
      let neighbors = p.plusNeighbors.filter(p => p && p.val != -1).map(p => p.val);
      if (neighbors.length === 0) {
        p.val = input[i][j];
      } else {
        p.val = Math.min(...neighbors) + input[i][j];
      }
      // if the val we just set is LOWER than the point to the RIGHT
      // or the point to the BOTTOM, then we may have "broken" the graph
      // now we need to reconsider it
      if (p.down) {
        let ii = p.down.i;
        let jj = p.down.j;
        let downCost = input[ii][jj];
        if (p.val + downCost < p.down.val) {
          // it's cheaper to traverse "backwards", oops.
          // recalculating...
          d += 2;
          break;
        }
      }
      if (p.right) {
        let ii = p.right.i;
        let jj = p.right.j;
        let rightCost = input[ii][jj];
        if (p.val + rightCost < p.right.val) {
          // it's cheaper to traverse "backwards", oops.
          // recalculating...
          d += 2;
          break;
        }
      }
    }
    console.log('distance', (minRisks.length - 1) * 2 - d, 'of', (minRisks.length - 1) * 2)
    // console.log(minRisks.map(l => l.join(',')).join('\n'));
  }

  // console.log(minRisks.map(l => l.join(',')).join('\n'));

  return minRisks[0][0] - input[0][0];
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);
  // if (input.length > 10) return;
  // console.log('input:', input);
  // input = [
  //   [2,2,2],
  //   [2,2,2],
  //   [2,2,2]
  // ]
  input = expandInput(input);
  let minRisks: number[][] = shadowClone2d(input, -1);

  let pointFactory = new PointFactory<number>(minRisks);

  let iteration = 0;
  for (let d = (minRisks.length - 1) * 2; d >= 0; d--) {
    // d is distance
    // since i + j = d, then a lower limit for i can be derived from d
    // the highest value i or j can be is (arr.length - 1), let's say that arr.length is 3
    // that means that i or j will never be higher than 2.
    // do if d is 3, and we know j cannot be higher than 2, which means i could be 1, but not 0
    let iMin = Math.max(0, d - minRisks.length + 1);
    // since i + j = d, then d serves as an upper limit for what i can be.
    // ex: if d is 1, then i's max value is also 1 since j can't be negative
    let iMax = Math.min(minRisks.length - 1, d);
    for (let i = iMin; i <= iMax; i++) {
      let j = d - i;
      // say we've calculated the grid like
      // x x x
      // x x 2
      // x 3 1
      // to calculate the next diagonal, we say the min distance to
      // any point (i, j) is the min of any of its adjacent neighbors
      // plus the value of (i, j) itself
      // min(point.neighbors) + 
      let p = pointFactory.newPoint(i, j);
      let neighbors = p.plusNeighbors.filter(p => p && p.val != -1).map(p => p.val);
      if (neighbors.length === 0) {
        p.val = input[i][j];
      } else {
        p.val = Math.min(...neighbors) + input[i][j];
      }
      // if the val we just set is LOWER than the point to the RIGHT
      // or the point to the BOTTOM, then we may have "broken" the graph
      // now we need to reconsider it
      if (p.down) {
        let ii = p.down.i;
        let jj = p.down.j;
        let downCost = input[ii][jj];
        if (p.val + downCost < p.down.val) {
          // it's cheaper to traverse "backwards", oops.
          // recalculating...
          d += 2;
          break;
        }
      }
      if (p.right) {
        let ii = p.right.i;
        let jj = p.right.j;
        let rightCost = input[ii][jj];
        if (p.val + rightCost < p.right.val) {
          // it's cheaper to traverse "backwards", oops.
          // recalculating...
          d += 2;
          break;
        }
      }
    }
    iteration++
    console.log('iteration', iteration, 'distance', (minRisks.length - 1) * 2 - d, 'of', (minRisks.length - 1) * 2)
    // console.log(minRisks.map(l => l.join(',')).join('\n'));
  }

  // console.log(minRisks.map(l => l.join(',')).join('\n'));

  return minRisks[0][0] - input[0][0];
}

function expandInput(arr: number[][]): number[][] {
  const workingArr: number[][][][] = new2dArray(5,5,null);
  for (let d = 0; d <= (workingArr.length - 1) * 2; d++) {
    console.log('distance', d);
    // d is distance
    // since i + j = d, then a lower limit for i can be derived from d
    // the highest value i or j can be is (arr.length - 1), let's say that arr.length is 3
    // that means that i or j will never be higher than 2.
    // do if d is 3, and we know j cannot be higher than 2, which means i could be 1, but not 0
    let iMin = Math.max(0, d - workingArr.length + 1);
    // since i + j = d, then d serves as an upper limit for what i can be.
    // ex: if d is 1, then i's max value is also 1 since j can't be negative
    let iMax = Math.min(workingArr.length - 1, d);
    for (let i = iMin; i <= iMax; i++) {
      let j = d - i;
      workingArr[i][j] = arr.map(numArr => numArr.map(n => (n+d)%10 + Math.floor((n+d)/10)))
    }
  }
  console.log('done calculating');
  const out: number[][] = [];
  for (let i = 0; i < workingArr.length; i++) {
    for (let j = 0; j < workingArr[0].length; j++) {
      let section: number[][] = workingArr[i][j];
      for (let k = 0; k < section.length; k++) {
        const numArr = section[k];
        const row = i*section.length + k;
        if (!out[row])
          out[row] = [];
        out[row].push(...section[k])
      }
    }
  }
  return out;
}

// TESTS
const testInput = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 40 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 315 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
