// inclusive
export function range(start: number, end: number) {
  let out = [];
  for (let i = start; i <= end; i++) {
    out.push(i);
  }
  return out;
}