function generateMazeHTML(mazeData) {
    const mazeContainer = document.getElementById('mazeContainer');
    const rows = mazeData.rows;
    const cols = mazeData.cols;
    const start = mazeData.start;
    const goal = mazeData.goal;
    const maze = mazeData.maze;

    mazeContainer.innerHTML = '';

    const mazeGrid = document.createElement('div');
    mazeGrid.classList.add('maze');

    mazeGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    mazeGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;

    for (let i = 0; i < rows; i++) {
        for (let ii = 0; ii < cols; ii++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const indexText = document.createElement('span');
            indexText.textContent = `${i},${ii}`;
            cell.appendChild(indexText);

            if (start.row === i && start.col === ii) {
                cell.textContent = 'S';
                cell.classList.add('start');
            } else if (goal.row === i && goal.col === ii) {
                cell.textContent = 'G';
                cell.classList.add('goal');
            } else {
                const cellData = maze[i][ii];
                if (!cellData.north) cell.classList.add('north');
                if (!cellData.east) cell.classList.add('east');
                if (!cellData.south) cell.classList.add('south');
                if (!cellData.west) cell.classList.add('west');
            }
            mazeGrid.appendChild(cell);
        }
    }

    mazeContainer.appendChild(mazeGrid);
}

function pathfinder(mazeData) {
    const output = document.getElementById('output')
    const rows = mazeData.rows;
    const cols = mazeData.cols;
    const start = mazeData.start;
    const goal = mazeData.goal;
    const maze = mazeData.maze;

    const visited = new Set();
    const path = [];

    function dfs(row, col) {
        visited.add(`${row}-${col}`);
        path.push({ row, col });

        if (row === goal.row && col === goal.col) {
            return true;
        }

        const neighbors = [
            { row: row - 1, col, direction: 'north' },
            { row, col: col + 1, direction: 'east' },
            { row: row + 1, col, direction: 'south' },
            { row, col: col - 1, direction: 'west' }
        ];

        for (const neighbor of neighbors) {
            const { row: nRow, col: nCol, direction } = neighbor;

            if (
                nRow >= 0 &&
                nRow < rows &&
                nCol >= 0 &&
                nCol < cols &&
                !visited.has(`${nRow}-${nCol}`) &&
                !maze[row][col][direction]
            ) {
                if (dfs(nRow, nCol)) {
                    return true;
                }
            }
        }
        path.pop();
        return false;
    }

    dfs(start.row, start.col);

    for (const { row, col } of path) {
        const cellIndex = row * cols + col;
        document.querySelectorAll('.cell')[cellIndex].classList.add('path');
    }

    const pathText = path.map(({ row, col }) => `(${row},${col})`).join(' -> ');
    console.log('Path: ', pathText);

    const pathTextExist = document.getElementById('pathText');
    if (pathTextExist) {
        output.removeChild(pathTextExist);
    }

    const printedPath = document.createElement("span")
    printedPath.id = 'pathText';
    printedPath.innerText = ('Path: ', pathText);
    output.appendChild(printedPath);
}

let solveBtn = document.getElementById('solveButton')
let displayBtn = document.getElementById('displayButton')
let clearBtn = document.getElementById('clearButton')
let mazeData;

displayBtn.addEventListener('click', function() {
    const jsonInput = document.getElementById('jsonInput').value;
    try {
        mazeData = JSON.parse(jsonInput);
        generateMazeHTML(mazeData);
    } catch (error) {
        alert('Invalid JSON input!');
        console.error(error);
    }
});

solveBtn.addEventListener('click', function (){
    console.log(mazeData)
    pathfinder(mazeData)
});

clearBtn.addEventListener('click', function (){
    const jsonInput = document.getElementById('jsonInput');
    jsonInput.value = '';
})