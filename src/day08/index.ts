import run from "aocrunner";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference } from "../utils/index.js";


const parseInput = (rawInput: string) => {
  return parse(rawInput).lines.map(line => line.split('|').map(half => half.trim().split(' ')));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // if (input.length > 10) { return; }
  // console.log(input);
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    let samples = line[0];
    let code = line[1];
    for (let j = 0; j < code.length; j++) {
      if([2,4,3,7].includes(code[j].length)) {
        sum++;
      }
      
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  if (input.length > 1) { return; }
  const wireMap: {[key: string]: string[]} = {};
  let wires = ['a', 'b', 'c','d','e','f','g']
  wires.forEach(wire => {
    wireMap[wire] = [...wires];
  });
  const wireLengths: {[key: number]: string[]} = {
    2: [...'cf'],
    3: [...'acf'],
    4: [...'bcdf'],
    5: [...'abcdefg'],
    6: [...'abcdefg'],
    7: [...'abcdefg'],
  }
  const numbersThatLightUpChar: {[key: string]: number[]} = {
    a: [0,2,3,5,6,7,8,9],
    b: [0,4,5,6,8,9],
    c: [0,1,2,3,4,7,8,9],
    d: [2,3,4,5,6,8,9],
    e: [0,2,6,8],
    f: [0,1,3,4,5,6,7,8,9],
    g: [0,2,3,5,6,8,9]
  }

  const wiresToDigitMap: {[key: string]: number} = {
    abcefg: 0,
    cf: 1,
    acdeg: 2,
    acdfg: 3,
    bcdf: 4,
    abdfg: 5,
    abdefg: 6,
    acf: 7,
    abcdefg: 8,
    abcdfg: 9
  }



  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    let debug = false
    if (i === 0){
      debug = true;
    }
    const line = input[i];
    // if(debug) console.log('line:', line)
    let encodes = line[0];
    let fourDigitCodes = line[1];
    for (let j = 0; j < encodes.length; j++) {
      const encoded = encodes[j];
      if (![2,4,3].includes(encoded.length)) continue;
      // if(debug) console.log('encoded', encoded);
      let possibleRealWires = wireLengths[encoded.length];
      // if (debug) console.log('possibleRealWires', possibleRealWires)
      for (let k = 0; k < Object.keys(wireMap).length; k++) {
        const char = Object.keys(wireMap)[k]; // char is the real wire we're trying to find a match for
        if (possibleRealWires.includes(char)) {
          if (debug) console.log('setting', char, 'to only have possibilities', encoded)
          wireMap[char] = intersect(wireMap[char], [...encoded])
        } else {
          // if(debug) console.log('removing', encoded, 'as possibility for', char)
          wireMap[char] = subtract(wireMap[char], [...encoded])
        }
      }
    }
    if(debug) console.log('-----wiremap after matches', wireMap)
    // now deal with the other lengths to narrow down what the smaller lengths can't
    // a should be solved for
    // B & D match
    // C & F match
    // E & G match
    // g is the only character present in all 5 and 6 stroke numbers
    let charsIn5 = encodes.filter(e => e.length === 5).map(s => [...s]).flat();
    let charsIn6 = encodes.filter(e => e.length === 6).map(s => [...s]).flat();
    let charsIn5And6 = union(charsIn5, charsIn6);
    let g = charsIn5And6.filter(c => charsIn5And6)
    let lengthSixes = encodes.filter(x => x.length === 6).map(x => [...x].sort().join(''));
    console.log(lengthSixes);
    let zero = lengthSixes.filter(target => lengthSixes.every(encode => {
      let diff = difference([...target], [...encode]);
      console.log('diff between target', target, 'encode', encode, diff.length)
      return diff.length <= 1;
    }));
    // zero has the true B but NOT D.
    console.log('zero', zero);
    console.log('wireDecoder before zero', wireMap);
    wireMap['d'] = subtract(wireMap['d'], [...zero]);
    wireMap['b'] = intersect(wireMap['b'], [...zero]);
    console.log('wireDecoder after zero', wireMap);

    // for (let j = 0; j < encodes.length; j++) {
    //   // chars sorted to make this easier on me
    //   const encoded = [...encodes[j]].sort().join(''); // note sort does not matter
    //   if (![5,6].includes(encoded.length)) continue;
    //   if (encoded.length === 6) {
    //     // 0 will only have 1 char difference between the other 6 char words
    //     let zero = 
    //   }
    //   // break the BD tie
    //   console.log('NUMBER THAT HAVE B BUT NOT D, but do have A', intersect(numbersThatLightUpChar['a'], subtract(numbersThatLightUpChar['b'], numbersThatLightUpChar['d'])));
    //   console.log('NUMBER THAT HAVE C BUT NOT F, but do have A', intersect(numbersThatLightUpChar['a'], subtract(numbersThatLightUpChar['c'], numbersThatLightUpChar['f'])));
    //   console.log('NUMBER THAT HAVE E BUT NOT G, but do have A', intersect(numbersThatLightUpChar['a'], subtract(numbersThatLightUpChar['e'], numbersThatLightUpChar['g'])));
    // }
    // if (debug) console.log('wireDecoder', wireMap);
    for (let j = 0; j < fourDigitCodes.length; j++) {
      let code = fourDigitCodes[j];
      let arr = [];
      for (let k = 0; k < code.length; k++) {
        arr.push(wireMap[code[k]]);
      }
      let trueWires = arr.sort().join('');
      let trueNumber = wiresToDigitMap[trueWires];
      sum += trueNumber;
    }
  }

  return;
};

// TESTS
const testInput = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 26 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 61229 },
      {input: 'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf', expected: 5353}
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
