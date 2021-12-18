import run from "aocrunner";
import { Point, Node } from "../utils/graph.js";
import { parse, new2dArray, transpose, range, sum, subtract, union, intersect, difference, shadowClone2d, median, count, charCountMap, countMap, permutations, stringChunks, hexToBinary } from "../utils/index.js";
import { DefaultDict } from "../utils/objects.js";

interface Packet {
  version: number;
  type: number;
  val: number | Packet[]; // number is type 4, packet array is all other types
  length: number;
}

const parseInput = (rawInput: string) => {
  return hexToBinary(parse(rawInput).lines[0]);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let topPacket = parsePacket(input);
  let sum = 0;
  forEachPacket(topPacket, (p) => sum += p.version);
  
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let topPacket = parsePacket(input);

  return packetValue(topPacket);
};

function parsePacket(s: string): Packet {
  let version = parseInt(s.slice(0,3), 2);
  let type = parseInt(s.slice(3, 6), 2);
  let {val, payloadLength} = parsePayload(s.slice(6), type);
  return {
    version,
    type,
    val,
    length: payloadLength + 6
  }
}

function parsePayload(s: string, type: number): {val: Packet[] | number, payloadLength: number} {
  // console.log('parsing payload for packet type', type, s);
  if (type === 4) {
    // console.log('TYPE 4 ===================')
    let binary = '';
    let i = 0;
    let j = 1;
    for (; i < s.length; i+= 5) {
      j = i+5;
      const group = s.slice(i, j);
      binary += group.slice(1);
      if (group[0] === '0') break; // group starting with 0 is the last group
    }
    return { val: parseInt(binary, 2), payloadLength: j};
  } else {
    // operator packet
    const lengthType = s[0];
    const packetArr = [];
    if (lengthType === '0') {
      let bitsTotal = parseInt(s.slice(1, 16),2);
      let bitsUsed = 0;
      while (bitsTotal > bitsUsed) {
        let packet = parsePacket(s.slice(16 + bitsUsed));
        bitsUsed += packet.length;
        packetArr.push(packet);
      }
      let i = 16 + bitsUsed;
      return { val: packetArr, payloadLength: i };
    } else {
      let numSubPackets = parseInt(s.slice(1, 12), 2);
      let bitsUsed = 0;
      while (packetArr.length < numSubPackets) {
        let packet = parsePacket(s.slice(12 + bitsUsed));
        bitsUsed += packet.length;
        packetArr.push(packet);
      }
      let i = 12 + bitsUsed;
      return { val: packetArr, payloadLength: i };
    }
  }
}

function packetValue(p: Packet): number {
//   Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
  if (p.type !== 4) {
    const childValues = (p.val as Array<Packet>).map(p => packetValue(p));
    switch(p.type) {
      case 0: {
        return sum(childValues);
      }
      case 1: {
        return childValues.reduce((prod, v) => { return prod *= v; }, 1);
      }
      case 2: {
        return Math.min(...childValues)
      }
      case 3: {
        return Math.max(...childValues)
      }
      case 5: {
        return childValues[0] > childValues[1] ? 1 : 0
      }
      case 6: {
        return childValues[0] < childValues[1] ? 1 : 0
      }
      case 7: {
        return childValues[0] === childValues[1] ? 1 : 0
      }
    }
  } else {
    return p.val as number;
  }
}

function forEachPacket(packet: Packet, callback: (p: Packet) => {}) {
  callback(packet);
  if (packet.type !== 4) {
    (packet.val as Array<Packet>).forEach(p => forEachPacket(p, callback));
  }
}

// TESTS
run({
  part1: {
    tests: [
      { input: '38006F45291200', expected: 9 }, // length type 0
      { input: 'EE00D40C823060', expected: 14 }, // length type 1
      { input: '8A004A801A8002F478', expected: 16 },
      { input: '620080001611562C8802118E34', expected: 12 },
      { input: 'C0015000016115A2E0802F182340', expected: 23 },
      { input: 'A0016C880162017C3686B18A3D4780', expected: 31 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: 'C200B40A82', expected: 3 },
      { input: '04005AC33890', expected: 54 },
      { input: '880086C3E88112', expected: 7 },
      { input: 'CE00C43D881120', expected: 9 },
      { input: 'D8005AC2A8F0', expected: 1 },
      { input: 'F600BC2D8F', expected: 0 },
      { input: '9C005AC2F8F0', expected: 0 },
      { input: '9C0141080250320F1802104A08', expected: 1 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
