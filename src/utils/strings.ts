import { countMap } from "./index.js";

export function charCountMap(s: string): {[key: string]: number} {
  return countMap([...s]);
}

// moves a window length n across a string and returns substrings
export function stringChunks(s: string, n: number): string[] {
  const out = [];
  for (let i = 0; i < s.length - n + 1; i++) {
    out.push(s.slice(i, i+n));
  }
  return out;
}

// uses parseInt for hex to binary conversion. We can't use this for really large
// hex numbers like our input though
function smallHexToBinary(hex: string): string {
  // adding the 1 forces no leading 0s to be dropped from the original hex
  // then after we're done converting, strip the leading 1 away
  return parseInt('1' + hex, 16).toString(2).slice(1);
}

export function hexToBinary(hex: string): string {
  const map = {};
  [...'1234567890ABCDEF'].forEach(c => map[c] = smallHexToBinary(c));
  return [...hex].map(c => map[c]).join('');
}