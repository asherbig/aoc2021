import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, countIf } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  const chunks = parse(rawInput).paragraphs;

  const coords = chunks[0].split('\n').map(line => line.split(',').map(x=>+x));
  const folds = chunks[1].split('\n').map(line => [line[11], line.slice(13)]);

  return {coords, folds};
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const xMax = Math.max(...input.coords.map(c => c[1]));
  const yMax = Math.max(...input.coords.map(c => c[0]));
  let paper = new2dArray(xMax + 1, yMax + 1, '.');
  input.coords.forEach(c => paper[c[1]][c[0]] = '#');

  let ans1 = 0;  
  input.folds.forEach((fold, i) => {
    let newPaper;
    if (fold[0] === 'x') { // vertical fold
      let foldX = +fold[1];
      newPaper = new2dArray(paper.length, foldX, '.');
      for (let y = 0; y < paper.length; y++) {
        for (let x = foldX + 1; x < paper[0].length; x++) {
          let xu = foldX*2-x;
          if (paper[y][xu] === '#' || paper[y][x] === '#') {
            newPaper[y][xu] = '#';
          }
        }
      }

    } else { // horizontal fold
      let foldY = +fold[1];
      newPaper = new2dArray(foldY, paper[0].length, '.');
      for (let y = foldY + 1; y < paper.length; y++) {
        for (let x = 0; x < paper[0].length; x++) {
          let yu = foldY*2-y;
          if (paper[yu][x] === '#' || paper[y][x] === '#') {
            newPaper[yu][x] = '#';
          }
        }
      }
    }
    paper = newPaper;
    if (i === 0) { ans1 = count(paper.flat(),'#'); }
  });

  dbg(paper);

  return ans1;
};

function dbg(paper: string[][]) {
  console.log(paper.map(r => r.map(c => c === '.' ? ' ' : '@').join('')).join('\n'));
}

// TESTS
const testInput = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 17 },
    ],
    solution: part1,
  },
  trimTestInputs: true,
});
