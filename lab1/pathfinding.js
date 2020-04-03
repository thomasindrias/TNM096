class Node {
    constructor(map, level, f) {
        this.map = map;
        this.level = level;
        this.f = f;
    }

    getChildren() {
        const {x, y} = this.find(0);

        const neighbors = [{x: x, y: y-1}, {x: x, y: y+1}, {x: x-1, y: y}, {x: x+1, y: y}];
        const validChildren = [];
        
        neighbors.forEach(neighbor => {
            const childMap = this.shuffle({x, y}, {x: neighbor.x, y: neighbor.y});
            if (childMap) {
                const childNode = new Node(childMap, this.level+1, 0);
                validChildren.push(childNode);
            }
        });

        return validChildren;
    }

    find(x) {
        for (let i = 0; i < this.map.length; i++)
            for (let j = 0; j < this.map.length; j++)
                if (this.map[i][j] === x) {
                    return {x: i, y: j};
                }
    }

    shuffle(pos1, pos2) {
        if (pos2.x >= 0 && pos2.x < this.map.length && pos2.y >= 0 && pos2.y < this.map.length) {
            let temp_map = [];
        
            temp_map = JSON.parse(JSON.stringify(this.map));
            let temp = temp_map[pos2.x][pos2.y];
            temp_map[pos2.x][pos2.y] = temp_map[pos1.x][pos1.y];
            temp_map[pos1.x][pos1.y] = temp;

            return temp_map;
        }
        else return null;
    }
}

class Puzzle {
    constructor(size) {
        this.open = [];
        this.closed = [];
        this.size = size;
    }

    calculate_f(start, goal) {
        return this.calculate_h1(start.map, goal) + start.level;
        // return this.calculate_h2(start.map, goal) + start.level;
    }
    
    calculate_h1(start, goal) {
        let temp = 0;
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (start[i][j] !== goal[i][j] && start[i][j] !== 0)
                    temp += 1;
        return temp;
    }

    isInClosed(node) {
        for (let k =0; k<this.closed.length; k++) {
            let counter = 0;
            for (let i=0; i<this.size; i++) {
                for (let j=0; j<this.size; j++) {
                    if (this.closed[k].map[i][j] === node.map[i][j]) counter++;
                  }
            }
            if (counter === 9) return true;
        }
            
        return false;
    }

    solve() {
        const startNode = new Node([
            [2, 5, 0],
            [1, 4, 8],
            [7, 3, 6]
        ], 0, 0);

        const goalMap = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 0]
        ];

        startNode.f = this.calculate_f(startNode, goalMap);

        this.open.push(startNode);

        //let counter = 0;

        for(;;) {
            //if (counter > 10000) break;
            //counter++;

            const currentNode = this.open.shift();
            //console.log("Current Node: ", currentNode)

            const h = this.calculate_h1(currentNode.map, goalMap);

            if (h === 0) {
                console.log("GOAL");
                break;
            }

            if (this.isInClosed(currentNode)) {
                continue;
            }

            currentNode.getChildren().forEach(childNode => {
                childNode.f = this.calculate_f(childNode, goalMap);
                this.open.push(childNode);
                //console.log("Child Node: ", childNode);
            });

            this.closed.push(currentNode);

            this.open = this.open.sort((a, b) => {
                return a.f > b.f;
            });

            //console.log("Open list", JSON.parse(JSON.stringify(this.open)));
            //console.log("Closed list", JSON.parse(JSON.stringify(this.closed)));
        }
    }
}

const puzzle = new Puzzle(3);
puzzle.solve();