import run from "aocrunner";
import { parse } from "../utils/index.js";

interface Command {
  direction: string;
  units: number;
}

const parseInput = (rawInput: string): Command[] => parse(rawInput).lines.map(l => {
  let [direction, units] = l.split(' ');
  return { direction, units: +units };
});

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let y = 0;
  let x = 0;
  for (let i = 0; i < input.length; i++) {
    const units = input[i].units;
    switch(input[i].direction) {
      case 'up': {
        y -= units; break;
      }
      case 'down': {
        y += units; break;
      }
      case 'forward': {
        x += units; break;
      }
    }
  }
  return y * x;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let aim = 0;
  let x = 0;
  let y = 0;
  for (let i = 0; i < input.length; i++) {
    const units = input[i].units;
    switch(input[i].direction) {
      case 'up': {
        aim -= units; break;
      }
      case 'down': {
        aim += units; break;
      }
      case 'forward': {
        x += units;
        y += units * aim; break;
      }
    }
  }
  return y * x;
};

run({
  part1: {
    tests: [
      { input: `
forward 5
down 5
forward 8
up 3
down 8
forward 2`, expected: 150 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `
forward 5
down 5
forward 8
up 3
down 8
forward 2`, expected: 900 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
