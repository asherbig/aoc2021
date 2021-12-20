import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, charCountMap, countMap, permutations, stringChunks, hexToBinary } from "../utils/index.js";
import { solveQuadraticPositive } from "../utils/maths.js";
import { DefaultDict } from "../utils/objects.js";

interface Input {
  algorithm: string;
  image: string[][];
}

class Image {
  image: string[][];
  private voidValue: string = '.';

  constructor(image: string[][]) {
    this.image = image;
  }

  getIndexFor(i: number, j: number) {
    let iMin = i - 1;
    let iMax = i + 1;
    let jMin = j - 1;
    let jMax = j + 1;
    let index = 0;
    for (let i = iMin; i <= iMax; i++) {
      for (let j = jMin; j <= jMax; j++) {
        let s = this.image[i]?.[j];
        index = index << 1;
        s = s === undefined ? this.voidValue : s;
        index += s === '#' ? 1 : 0;
      }
    }
    return index;
  }

  toggleVoidValue() {
    this.voidValue = this.voidValue === '.' ? '#' : '.';
  }

  setImage(image: string[][]) {
    this.image = image;
  }

  get height(): number {
    return this.image.length;
  }

  get width(): number {
    return this.image[0].length;
  }

  print() {
    console.log(this.image.map(l => l.join('')).join('\n'));
  }
}

const parseInput = (rawInput: string): Input => {
  let temp = parse(rawInput).paragraphs;
  let image = temp[1].split('\n').map(l => [...l]);
  return {
    algorithm: temp[0],
    image
  };
}

const part1 = (rawInput: string) => {
  return solve(rawInput, 2);
};

const part2 = (rawInput: string) => {
  return solve(rawInput, 50);
};

function solve(rawInput: string, steps: number): number {
  const input = parseInput(rawInput);
  let image = new Image(input.image);

  // make new image
  for (let step = 0; step < steps; step++) {
    const newImage = new2dArray(image.height + 2, image.width + 2, '.');
    for (let i = -1; i < image.height + 1; i++) {
      for (let j = -1; j < image.width + 1; j++) {
        const idx = image.getIndexFor(i, j);
        newImage[i + 1][j + 1] = input.algorithm[idx];
      }
    }
    if (input.algorithm[0] === '#') {
      image.toggleVoidValue();
    }
    image.setImage(newImage);
  }

  return count(image.image.flat(), '#');
}

// TESTS
const testInput = `
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 35 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 3351 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
