// avoid being stuck for 30 minutes because you passed the reference to the same object reference
// to the top level array multiple times :tears:
// tldr: new Array(n).fill(new Array(n)) is bad
export function new2dArray<T>(height: number, width: number, initialValue: T): T[][] {
  return [...Array<T[]>(height)].map(_ => Array<T>(width).fill(initialValue));
}

export function transpose<T>(array: T[][]) {
  return array.map((col, i) => array.map(row => row[i]));
}

export function sum(array: number[], condition: (el: number, i: number) => boolean = (_, __) => true) {
  return array.reduce(((sum, e, i) => sum += condition(e, i) ? e : 0), 0);
}

export function countIf(array: number[], condition: (el: number, i: number) => boolean = (_, __) => true) {
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
