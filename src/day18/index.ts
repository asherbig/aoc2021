import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, charCountMap, countMap, permutations, stringChunks, hexToBinary } from "../utils/index.js";
import { solveQuadraticPositive } from "../utils/maths.js";
import { DefaultDict } from "../utils/objects.js";

// don't use Pair to represent single numbers
// pairs together form a tree structure
class Pair {
  left: number | Pair;
  right: number | Pair;
  parent: Pair;
  id: number;


  constructor(payload: any[], parent: Pair) {
    this.parent = parent;
    this.parsePayload(payload);
  }

  get magnitude(): number {
    let left;
    let right;
    if (this.left instanceof Pair) {
      left = this.left.magnitude;
    } else {
      left = this.left;
    }
    if (this.right instanceof Pair) {
      right = this.right.magnitude;
    } else {
      right = this.right;
    }
    return left*3 + right*2;
  }

  get splittable(): boolean {
    return this.leftSplittable || this.rightSplittable;
  }

  get leftSplittable(): boolean {
    return !(this.left instanceof Pair) && this.left > 9;
  }

  get rightSplittable(): boolean {
    return !(this.right instanceof Pair) && this.right > 9;
  }

  get explodable(): boolean {
    return !(this.left instanceof Pair) && !(this.right instanceof Pair);
  }

  // assumes that even if both numbers are splittable, you want to split one at a time
  // also assumes that you want to split the left first if possible
  split(): boolean {
    if (!this.splittable) {
      // console.log('requirements for SPLITTING not met, returning early');
      return false;
    }
    if (this.leftSplittable) {
      // console.log('splitting (left)', this.print())
      const num = this.left as number;
      this.left = new Pair([Math.floor(num/2), Math.ceil(num/2)], this)
    } else if (this.rightSplittable) {
      // console.log('splitting (right)', this.print())
      const num = this.right as number;
      this.right = new Pair([Math.floor(num/2), Math.ceil(num/2)], this)
    }
    return true;
  }

  // explode should only be called on pairs where both left and right are numbers
  explode(): boolean {
    if (this.left instanceof Pair || this.right instanceof Pair) {
      // console.log('requirements for EXPLODING not met, returning early');
      return false;
    }
    // console.log('exploding', this.print())
    this.incrementLeft(this.left as number);
    this.incrementRight(this.right as number);
    // unpoint the parent from this Pair, replace it with 0
    if (this.parent.right === this) {
      this.parent.right = 0;
    } else {
      this.parent.left = 0;
    }
    return true;
  }

  print(): string {
    let left;
    let right;
    left = this.left instanceof Pair ? `<PAIR>` : this.left;
    right = this.right instanceof Pair ? `<PAIR>` : this.right;
    return `(left, right): (${left}, ${right})`;
  }

  private incrementLeft(num: number) {
    let prev: Pair = this;
    let cur: Pair = this.parent;
    // go up until we find a node where we're on the right side of the parent
    while (prev === cur?.left) {
      prev = cur;
      cur = cur.parent;
    }
    if (!cur) return;
    if (cur.left instanceof Pair) {
      // hop over to the left side of the tree
      cur = cur.left;
    } else {
      // there is no left side pair, but there is a regular number, so increment that
      cur.left += num;
      return; // done incrementing, exit
    }
    // the value we want is going to be the rightmost value in this tree
    while (cur.right instanceof Pair) {
      cur = cur.right;
    }
    cur.right += num;
  }

  private incrementRight(num: number) {
    let prev: Pair = this;
    let cur: Pair = this.parent;
    // go up until we find a node where we're on the left side of the parent
    while (prev === cur?.right) {
      prev = cur;
      cur = cur.parent;
    }
    if (!cur) return;
    if (cur.right instanceof Pair) {
      // hop over to the right side of the tree
      cur = cur.right;
    } else {
      // there is no right side pair, but there is a regular number, so increment that
      cur.right += num;
      return; // done incrementing, exit
    }
    // confirmed there is a tree to the right of our origin Pair, traverse it, following the left side
    while (cur.left instanceof Pair) {
      cur = cur.left;
    }
    cur.left += num;
  }

  private parsePayload(payload: any[]) {
    const left = payload[0];
    const right = payload[1];
    if (left instanceof Array) {
      this.left = new Pair(left, this);
    } else {
      this.left = left as number; // number
    }
    if (right instanceof Array) {
      this.right = new Pair(right, this);
    } else {
      this.right = right as number; // number
    }
  }
}

const parseInput = (rawInput: string) => {
  // hehehe
  return parse(rawInput).lines.map(l => eval(l));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  if (input.length > 10) return;
  // console.log('input:', input[0]);

  let head = new Pair(input[0], null);

  // console.log(printTree(head));
  // traverseTreeNums(head, (n => console.log(n)));

  let settled = false;
  while (!settled) {
    settled = !actionDoneOnTree(head);
  }

  for (let i = 1; i < input.length; i++) {
    let temp = new Pair([0, 0], null);
    let nextPair = new Pair(input[i], null);
    temp.left = head;
    head.parent = temp;
    temp.right = nextPair;
    nextPair.parent = temp;
    head = temp;

    // console.log('just added new head');
    // console.log(printTree(head));

    let settled = false;
    while (!settled) {
      settled = !explodeTree(head);
      if (!settled) continue;
      settled = !splitTree(head);
      // console.log(printTree(head));
    }
  }
  

  // traverseTreeNums(head, (n => console.log(n)));
  // traverseTreePairs(head, (p => console.log(p.print())))

  return head.magnitude;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // if (input.length > 10) return;
  // console.log('input:', input[0]);

  // console.log(printTree(head));
  // traverseTreeNums(head, (n => console.log(n)));
  let max = 0;

  let head = new Pair([0, 0], null);
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      let snail1Head = new Pair(input[i], head);
      let snail2Head = new Pair(input[j], head);

      head.left = snail1Head;
      head.right = snail2Head;

      let settled = false;
      while (!settled) {
        settled = !explodeTree(head);
        if (!settled) continue;
        settled = !splitTree(head);
      }

      max = Math.max(max, head.magnitude);
    }
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      let snail1Head = new Pair(input[i], head);
      let snail2Head = new Pair(input[j], head);

      head.right = snail1Head;
      head.left = snail2Head;

      let settled = false;
      while (!settled) {
        settled = !explodeTree(head);
        if (!settled) continue;
        settled = !splitTree(head);
      }

      max = Math.max(max, head.magnitude);
    }
  }

  return max;
};

function explodeTree(p: Pair | number, depth: number = 0): boolean {
  let exploded = false;
  if (p instanceof Pair) {
    exploded = explodeTree(p.left, depth + 1);
  }
  if (exploded) return true;
  if (p instanceof Pair) {

    if (depth >= 4) {
      // console.log('trying to explode', p.print());
      exploded = p.explode();
    }
    if (exploded) return true;
  }
  
  if (p instanceof Pair) {
    exploded = explodeTree(p.right, depth + 1);
  }
  return exploded;
}

function splitTree(p: Pair | number): boolean {
  let split = false;
  if (p instanceof Pair) {
    split = splitTree(p.left);
  }
  if (split) return true;
  if (p instanceof Pair) {
    split = p.split();
    if (split) return true;
  }
  
  if (p instanceof Pair) {
    split = splitTree(p.right);
  }
  return split;
}

function actionDoneOnTree(p: Pair | number, depth: number = 0): boolean {
  let actionDone = false;
  if (p instanceof Pair) {
    actionDone = actionDoneOnTree(p.left, depth + 1);
  }
  if (actionDone) return true;
  if (p instanceof Pair) {

    if (depth >= 4) {
      // console.log('trying to explode', p.print());
      actionDone = p.explode();
    }
    if (actionDone) return true;

    actionDone = p.split();
    if (actionDone) return true;
  }
  
  if (p instanceof Pair) {
    actionDone = actionDoneOnTree(p.right, depth + 1);
  }
  return actionDone;
}

function traverseTreeNums(p: Pair | number, callback: (num: number) => void) {
  if (p instanceof Pair) {
    traverseTreeNums(p.left, callback)
  }
  if (!(p instanceof Pair)) {
    callback(p);
  }
  if (p instanceof Pair) {
    traverseTreeNums(p.right, callback)
  }
}

function traverseTreePairs(p: Pair | number, callback: (p: Pair) => void) {
  if (p instanceof Pair) {
    traverseTreePairs(p.left, callback)
  }
  if (p instanceof Pair) {
    callback(p);
  }
  if (p instanceof Pair) {
    traverseTreePairs(p.right, callback)
  }
}

function printTree(p: Pair | number, s: string = ''): string {
  let out = '';
  if (p instanceof Pair) {
    out += '['
  }
  if (p instanceof Pair) {
    out += printTree(p.left, out)
    out += ',';
  }
  if (!(p instanceof Pair)) {
    out += p;
  }
  if (p instanceof Pair) {
    out += printTree(p.right, out)
  }
  if (p instanceof Pair) {
    out += ']'
  }
  return out;
}

// TESTS

// [[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]
const testInput = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`;

// const testInput = `
// [1,1]
// [2,2]
// [3,3]
// [4,4]
// `;

const addTest = `
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`;

const addTest2 = `
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`

const a = `
[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]`;

const b = `
[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]`

const c = `
[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]`;

const d = `
[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]
[7,[5,[[3,8],[1,4]]]]`

const f = `
[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]
[2,9]`

// [[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]],[2,9]]

const smallAdd = `
[[[[4,3],4],4],[7,[[8,4],9]]]
[1,1]`

run({
  part1: {
    tests: [
      { input: testInput, expected: 4140 },
      // { input: addTest, expected: 4140 }, // [[[[3,0],[5,3]],[4,4]],[5,5]]
      // { input: addTest2, expected: 4140 }, // [[[[5,0],[7,4]],[5,5]],[6,6]]
      // { input: smallAdd, expected: 1384 }, // [[[[0,7],4],[[7,8],[6,0]]],[8,1]]
      // { input: a, expected: 4140 }, // [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
      // { input: b, expected: 4140 }, // [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]
      // { input: c, expected: 4140 }, // [[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]
      // { input: d, expected: 4140 }, // [[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]
      // { input: f, expected: 4140 }, // [[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]
      // { input: '[[[[[9,8],1],2],3],4]', expected: 143 }, // single explode becomes [[[[0,9],2],3],4]
      // { input: '[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', expected: 143 }, // double explode becomes [[3,[2,[8,0]]],[9,[5,[7,0]]]]
      // { input: '[[[[0,7],4],[15,[0,13]]],[1,1]]', expected: 143 }, // splittable input becomes [[[[0,7],4],[[7,8],[0,13]]],[1,1]]
      // { input: '[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]', expected: 1384 }, // explodes and splits, becomes [[[[0,7],4],[[7,8],[6,0]]],[8,1]]
      // { input: '[[1,2],[[3,4],5]]', expected: 143 },
      // { input: '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]', expected: 1384 },
      // { input: '[[[[1,1],[2,2]],[3,3]],[4,4]]', expected: 445 },
      // { input: '[[[[3,0],[5,3]],[4,4]],[5,5]]', expected: 791 },
      // { input: '[[[[5,0],[7,4]],[5,5]],[6,6]]', expected: 1137 },
      // { input: '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', expected: 3488 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 3993 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
