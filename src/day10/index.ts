import run from "aocrunner";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  return parse(rawInput).lines;
}

const closingChars = {
  ['(']: ')',
  ['[']: ']',
  ['{']: '}',
  ['<']: '>',
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const points = {
    [')']: 3,
    [']']: 57,
    ['}']: 1197,
    ['>']: 25137,
  }

  let sum = 0;
  for (const line of input) {
    const charStack = [];
    for (const c of line) {
      if ([...'([{<'].includes(c)) {
        charStack.push(c);
      } else {
        const expected = closingChars[charStack.pop()];
        if (c !== expected) {
          sum += points[c];
          break;
        }
      }
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);

  const points2 = {
    [')']: 1,
    [']']: 2,
    ['}']: 3,
    ['>']: 4,
  }

  let scores = [];
  for (const line of input) {
    let corrupt = false;
    const charStack = [];
    for (const c of line) {
      if ([...'([{<'].includes(c)) {
        charStack.push(c);
      } else {
        const expected = closingChars[charStack.pop()];
        if (c !== expected) {
          corrupt = true;
          break;
        }
      }
    }
    if (!corrupt) {
      let score = 0;
      while (charStack.length > 0) {
        const points = points2[closingChars[charStack.pop()]];
        score = score * 5 + points;
      }
      scores.push(score);
    }
  }

  return median(scores);
};

// TESTS
const testInput = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 26397 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 288957 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
