export class Point<T> {
  // description of self-coordinate
  i: number;
  j: number;

  // assuming graph is 2d array
  private graph: T[][];
  // using numbers instead of booleans makes this class a little more flexible
  // should be initialized with 0s as values
  private visitedArr: number[][];

  // by taking in the graph, that gives the point the ability to see its neighbors
  // and traverse. This class doesn't make any assumptions about what rules there
  // are about traversing the graph. Just gives some helpful functions to help
  // hide away some of the logic.
  constructor(i: number, j: number, graph: T[][], visitedArr?: number[][]) {
    this.i = i;
    this.j = j;
    this.graph = graph;
    this.visitedArr = visitedArr;
  }

  // this can be treated like a boolean
  get visited(): number {
    return this.visitedArr[this.i][this.j];
  }

  set visited(x: number) {
    this.visitedArr[this.i][this.j] = x;
  }

  visit() {
    this.visitedArr[this.i][this.j]++;
  }

  get exists(): boolean {
    // not quite accurate, but good enough.
    // fails if undefined is a valid value in the graph
    return this.val !== undefined;
  }

  get val(): T {
    return this.graph?.[this.i]?.[this.j]
  }

  set val(x: T) {
    this.graph[this.i][this.j] = x;
  }

  // ============ neighbors ============
  get up(): Point<T> {
    return this.pointFactory(this.i-1, this.j);
  }

  get down(): Point<T> {
    return this.pointFactory(this.i+1, this.j);
  }

  get left(): Point<T> {
    return this.pointFactory(this.i, this.j-1);
  }

  get right(): Point<T> {
    return this.pointFactory(this.i, this.j+1);
  }

  get upLeft(): Point<T> {
    return this.pointFactory(this.i-1, this.j-1);
  }

  get upRight(): Point<T> {
    return this.pointFactory(this.i-1, this.j+1);
  }

  get downLeft(): Point<T> {
    return this.pointFactory(this.i+1, this.j-1);
  }

  get downRight(): Point<T> {
    return this.pointFactory(this.i+1, this.j+1);
  }

  // filtering out invalid neighbors on these aggregate functions since this is
  // usually how we would want to traverse the graph
  get plusNeighbors(): Point<T>[] {
    return [this.up, this.right, this.down, this.left].filter(p => p);
  }

  get cornerNeighbors(): Point<T>[] {
    return [this.upRight, this.downRight, this.downLeft, this.upLeft].filter(p => p);
  }

  get allNeighbors(): Point<T>[] {
    return [...this.plusNeighbors, ...this.cornerNeighbors];
  }

  private pointFactory(i: number, j: number): Point<T> | null {
    const p = new Point(i, j, this.graph, this.visitedArr)
    return p.exists ? p : null;
  }
}