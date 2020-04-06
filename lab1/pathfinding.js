class Node {
  constructor(map, level, f, parent) {
    this.map = map;
    this.level = level;
    this.f = f;
    this.parent = parent;
  }

  getChildren() {
    const { x, y } = this.find(0);

    const neighbors = [
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x - 1, y: y },
      { x: x + 1, y: y },
    ];
    const validChildren = [];

    neighbors.forEach((neighbor) => {
      const childMap = this.shuffle({ x, y }, { x: neighbor.x, y: neighbor.y });
      if (childMap) {
        const childNode = new Node(childMap, this.level + 1, 0, this);
        validChildren.push(childNode);
      }
    });

    return validChildren;
  }

  find(x) {
    for (let i = 0; i < this.map.length; i++)
      for (let j = 0; j < this.map.length; j++)
        if (this.map[i][j] === x) {
          return { x: i, y: j };
        }
  }

  shuffle(pos1, pos2) {
    if (
      pos2.x >= 0 &&
      pos2.x < this.map.length &&
      pos2.y >= 0 &&
      pos2.y < this.map.length
    ) {
      let temp_map = [];

      temp_map = JSON.parse(JSON.stringify(this.map));
      let temp = temp_map[pos2.x][pos2.y];
      temp_map[pos2.x][pos2.y] = temp_map[pos1.x][pos1.y];
      temp_map[pos1.x][pos1.y] = temp;

      return temp_map;
    } else return null;
  }
}

class Puzzle {
  constructor(size) {
    this.open = [];
    this.closed = {};
    this.size = size;
  }

  calculate_f(start, goal) {
    return this.calculate_h2(start, goal) + start.level;
    // return this.calculate_h2(start.map, goal) + start.level;
  }

  calculate_h1(start, goal) {
    let temp = 0;
    for (let i = 0; i < this.size; i++)
      for (let j = 0; j < this.size; j++)
        if (start.map[i][j] !== goal.map[i][j] && start.map[i][j] !== 0)
          temp += 1;
    return temp;
  }

  calculate_h2(start, goal) {
    let temp = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const goalIndex = goal.find(start.map[x][y]);
        temp += Math.abs(x - goalIndex.x) + Math.abs(y - goalIndex.y);
      }
    }
    return temp;
  }

  getMapAsNumber(map) {
    let mapNumber = "";

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        mapNumber += map[i][j].toString();
      }
    }

    return parseInt(mapNumber);
  }

  solve() {
    const startNode = new Node(
      [
        [2, 5, 0],
        [1, 4, 8],
        [7, 3, 6],
      ],
      0,
      0,
      null
    );

    const goalNode = new Node(
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0],
      ],
      0,
      0,
      null
    );

    let solution = [];

    startNode.f = this.calculate_f(startNode, goalNode);

    this.open.push(startNode);

    let counter = 0;

    for (;;) {
      if (counter > 300000) break;
      counter++;

      const currentNode = this.open.shift();

      const h = this.calculate_h2(currentNode, goalNode);

      if (h === 0) {
        console.log(counter);
        console.log("GOAL");
        let node = currentNode;
        while (node) {
          solution.push(node);
          node = node.parent;
        }
        break;
      }

      currentNode.getChildren().forEach((childNode) => {
        childNode.f = this.calculate_f(childNode, goalNode);

        const foundClosedF = this.closed[this.getMapAsNumber(childNode.map)];
        if (foundClosedF && foundClosedF < childNode.f) {
          return;
        }

        const ind = binarySearch(this.open, childNode.f);
        this.open.splice(ind, 0, childNode);
      });

      this.closed[this.getMapAsNumber(currentNode.map)] = currentNode.f;
    }

    return solution.reverse();
  }
}

function binarySearch(array, value) {
  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (array[mid].f < value) low = mid + 1;
    else high = mid;
  }

  return low;
}
