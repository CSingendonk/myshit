class SliderPuzzleSolver {
    constructor(stateObj) {
        this.size = stateObj.size || Math.sqrt(stateObj.tilePositions.length);
        this.goal = this.createGoalState(this.size);
        this.startState = stateObj.tilePositions;
        this.currentState = stateObj.
        this.minMoves = 0;
    }

  
  
    createGoalState(size) {
        const goalState = Array(size * size).fill(0).map((_, index) => index);
        return goalState;
    }

    // Min-heap utility functions for priority queue
    enqueue(queue, element) {
        queue.push(element);
        let current = queue.length - 1;
        while (current > 0) {
            const parent = Math.floor((current - 1) / 2);
            if (queue[current].priority >= queue[parent].priority) break;
            [queue[current], queue[parent]] = [queue[parent], queue[current]];
            current = parent;
        }
    }

    dequeue(queue) {
        if (queue.length === 1) return queue.pop();
        const top = queue[0];
        queue[0] = queue.pop();
        let current = 0;
        while (true) {
            const left = 2 * current + 1;
            const right = 2 * current + 2;
            let smallest = current;

            if (left < queue.length && queue[left].priority < queue[smallest].priority) {
                smallest = left;
            }
            if (right < queue.length && queue[right].priority < queue[smallest].priority) {
                smallest = right;
            }
            if (smallest === current) break;
            [queue[current], queue[smallest]] = [queue[smallest], queue[current]];
            current = smallest;
        }
        return top;
    }

    // Calculate the number of inversions to determine solvability
    getInversions(array) {
        let inversions = 0;
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] && array[j] && array[i] > array[j]) {
                    inversions++;
                }
            }
        }
        return inversions;
    }

    // Check if puzzle is solvable
    isSolvable() {
        const inversions = this.getInversions(this.startState);
        const blankRow = this.size - Math.floor(this.startState.indexOf(0) / this.size);

        if (this.size % 2 !== 0) {
            return inversions % 2 === 0;
        } else {
            return (blankRow % 2 === 0) === (inversions % 2 !== 0);
        }
    }

    // Manhattan distance heuristic based on linear array
    manhattanHeuristic(array) {
        let distance = 0;
        for (let i = 0; i < array.length; i++) {
            const value = array[i];
            if (value !== 0) {
                const targetX = Math.floor((value - 1) / this.size);
                const targetY = (value - 1) % this.size;
                const currentX = Math.floor(i / this.size);
                const currentY = i % this.size;
                distance += Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
            }
        }
        return distance;
    }

    // A* Search to find the least number of moves
    aStarSolve() {
        if (!this.isSolvable()) return -1; // Puzzle is unsolvable

        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1] // Down, Up, Right, Left
        ];

        const queue = [];
        this.enqueue(queue, {
            state: this.startState,
            moves: 0,
            priority: this.manhattanHeuristic(this.startState)
        });
        const visited = new Set([this.startState.toString()]);

        while (queue.length) {
            const { state, moves } = this.dequeue(queue);

            if (state.toString() === this.goal.toString()) return moves;

            const blankIndex = state.indexOf(0);
            const blankX = Math.floor(blankIndex / this.size);
            const blankY = blankIndex % this.size;

            for (const [dx, dy] of directions) {
                const [newX, newY] = [blankX + dx, blankY + dy];
                if (newX >= 0 && newX < this.size && newY >= 0 && newY < this.size) {
                    const newIndex = newX * this.size + newY;
                    const newState = [...state];
                    [newState[blankIndex], newState[newIndex]] = [newState[newIndex], newState[blankIndex]];

                    if (!visited.has(newState.toString())) {
                        visited.add(newState.toString());
                        this.enqueue(queue, {
                            state: newState,
                            moves: moves + 1,
                            priority: moves + 1 + this.manhattanHeuristic(newState)
                        });
                    }
                }
            }
        }
        return -1; // No solution found
    }
});
