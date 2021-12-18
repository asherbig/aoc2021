export function solveQuadratic(a: number, b: number, c: number): number[] {
  let root1, root2;
  let discriminant = b * b - 4 * a * c;
  // condition for real and different roots
  if (discriminant > 0) {
    root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  }
  // condition for real and equal roots
  else if (discriminant == 0) {
    root1 = root2 = -b / (2 * a);
  } else {
    // imaginary roots
  }
  return [root1, root2]
}

export function solveQuadraticPositive(a: number, b: number, c: number): number {
  return solveQuadratic(a,b,c).filter(x => x > 0)[0];
}

export function solveQuadraticNegative(a: number, b: number, c: number): number {
  return solveQuadratic(a,b,c).filter(x => x < 0)[0];
}