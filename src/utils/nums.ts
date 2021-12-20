// inclusive
export function range(start: number, end: number) {
  let out = [];
  for (let i = start; i <= end; i++) {
    out.push(i);
  }
  return out;
}

/**
 * Pulls the numbers out of a string and returns them as an array
 * @param s string that has some numbers in it
 * @returns array of numbers that were found in the string that match the regex
 */
export function extractNums(s: string): number[] {
  return s.match(/(-?\d+)/g).map(x=>+x);
}