// avoid being stuck for 30 minutes because you passed the reference to the same object reference
// to the top level array multiple times :tears:
// tldr: new Array(n).fill(new Array(n)) is bad
export function new2dArray<T>(height: number, width: number, initialValue: T): T[][] {
  return [...Array<T[]>(height)].map(_ => Array<T>(width).fill(initialValue));
}

export function transpose<T>(array: T[][]) {
  return array.map((col, i) => array.map(row => row[i]));
}