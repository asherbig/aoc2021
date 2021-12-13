// avoid being stuck for 30 minutes because you passed the reference to the same object reference
// to the top level array multiple times :tears:
// tldr: new Array(n).fill(new Array(n)) is bad
export function new2dArray<T>(height: number, width: number, initialValue: T): T[][] {
  return [...Array<T[]>(height)].map(_ => Array<T>(width).fill(initialValue));
}

export function transpose<T>(array: T[][]) {
  return array.map((col, i) => array.map(row => row[i]));
}

export function sum(array: number[], condition: (el: number, i?: number) => boolean = (_, __) => true) {
  return array.reduce(((sum, e, i) => sum += condition(e, i) ? e : 0), 0);
}

export function countIf(array: number[], condition: (el: number, i?: number) => boolean = (_, __) => true) {
  return array.reduce(((sum, e, i) => sum += condition(e, i) ? 1 : 0), 0);
}

export function subtract<T>(arr1: T[], arr2: T[]) {
  return arr1.filter(n => !arr2.includes(n))
}

export function union<T>(arr1: T[], arr2: T[]) {
  return [...new Set([...arr1, ...arr2])];
}

export function intersect<T>(arr1: T[], arr2: T[]) {
  return arr1.filter(value => arr2.includes(value));
}

export function difference<T>(arr1: T[], arr2: T[]) {
  return union(subtract(arr1, arr2), subtract(arr2, arr1))
}

export function shadowClone2d<T>(arr1: any[][], initialValue: T): T[][] {
  return new2dArray(arr1.length, arr1[0].length, initialValue);
}

export function count<T>(arr: T[], val: T): number {
  return arr.filter((el: T) => el === val).length;
}

export function median(arr: number[]) {
  arr = [...arr]; // don't affect the original array by sorting
  if (arr.length === 0) throw new Error("Arrays of length 0 have no median");
  arr.sort((a,b) => a-b);
  const half = Math.floor(arr.length / 2);
  if (arr.length % 2) return arr[half];
  return (arr[half - 1] + arr[half]) / 2.0;
}

export function traverse2d<T>(arr: T[][], callback: (el: T, i?: number, j?: number) => {}) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      callback(arr[i][j], i, j);
    }
  }
}