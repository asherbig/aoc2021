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

/**
 * This class is set up to be pretty much point-and-go. Put in the first node `id`
 * and then traverse the graph from there. Traversing using the `neighbors` property.
 *
 * `edges` should be the edges of the graph in the format
 *
 * `[[id1, id2], [id2, id4], [id3, id5] ...]`
 * 
 * NOTE: the edges array is assumed to be bi-directional
 */
export class Node<T> {
  neighbors: Node<T>[] = [];
  id: T;

  private edges: T[][];
  private nodes: Map<T, Node<T>>;

  // this implementation of Node assumes that id is a unique
  // could potentially also pass in a separate value, but ID works as a value
  // assuming the values are all unique
  constructor(id: T, edges: T[][], nodes: Map<T, Node<T>> = new Map()) {
    this.id = id;
    this.edges = edges;
    nodes.set(this.id, this);
    this.nodes = nodes;
    this.setNeighbors();
  }

  // for day 12, hacking the generic typing a little bit
  get small(): boolean {
    return String(this.id).toLowerCase() === String(this.id);
  }

  get graphSize(): number {
    return this.nodes.size;
  }

  get graphNodes(): Node<T>[] {
    return [...this.nodes.values()];
  }

  private setNeighbors() {
    this.edges.forEach(([v1, v2]) => {
      if (v1 === this.id) {
        this.neighbors.push(this.nodeFactory(v2))
      }
      if (v2 === this.id) {
        this.neighbors.push(this.nodeFactory(v1))
      }
    });
  }

  // keep track of nodes that we already know about to avoid an infinite loop of creating nodes
  private nodeFactory(id: T) {
    return this.nodes.get(id) || new Node(id, this.edges, this.nodes)
  }
}
