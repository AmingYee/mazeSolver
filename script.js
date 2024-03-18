document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("generateBtn").addEventListener("click", generateMaze);
    document.getElementById("copyBtn").addEventListener("click", copyMaze);
});

function generateMaze() {
    let rows = parseInt(document.getElementById("rows").value);
    let cols = parseInt(document.getElementById("cols").value);
    let maze = JSON.parse(generateMazeJSON(rows, cols));
    displayMaze(maze);
}

function generateMazeJSON(rows, cols) {
    let maze = [];

    for (let i = 0; i < rows; i++) {
        maze.push([]);
        for (let ii = 0; ii < cols; ii++) {
            maze[i].push({ row: i, col: ii, north: true, east: true, south: true, west: true });
        }
    }

    let startRow = Math.floor(Math.random() * rows);
    let startCol = Math.floor(Math.random() * cols);
    let head = [{ row: startRow, col: startCol }];

    maze[startRow][startCol].visited = true;

    while (head.length > 0) {
        let randomIndex = Math.floor(Math.random() * head.length);
        let current = head[randomIndex];
        let { row, col } = current;

        let neighbors = getUnvisitedNeighbors(row, col);
        if (neighbors.length > 0) {
            let { nRow, nCol } = neighbors[Math.floor(Math.random() * neighbors.length)];

            removeWall(row, col, nRow, nCol);

            maze[nRow][nCol].visited = true;

            head.push({ row: nRow, col: nCol });
        } else {
            head.splice(randomIndex, 1);
        }
    }

    function getUnvisitedNeighbors(row, col) {
        let neighbors = [];
        if (row > 0 && !maze[row - 1][col].visited) neighbors.push({ nRow: row - 1, nCol: col });
        if (row < rows - 1 && !maze[row + 1][col].visited) neighbors.push({ nRow: row + 1, nCol: col });
        if (col > 0 && !maze[row][col - 1].visited) neighbors.push({ nRow: row, nCol: col - 1 });
        if (col < cols - 1 && !maze[row][col + 1].visited) neighbors.push({ nRow: row, nCol: col + 1 });
        return neighbors;
    }

    function removeWall(row1, col1, row2, col2) {
        if (row1 === row2 && col1 < col2) {
            maze[row1][col1].east = false;
            maze[row2][col2].west = false;
        } else if (row1 === row2 && col1 > col2) {
            maze[row1][col1].west = false;
            maze[row2][col2].east = false;
        } else if (col1 === col2 && row1 < row2) {
            maze[row1][col1].south = false;
            maze[row2][col2].north = false;
        } else if (col1 === col2 && row1 > row2) {
            maze[row1][col1].north = false;
            maze[row2][col2].south = false;
        }
    }

    let jsonMaze = {
        rows: rows,
        cols: cols,
        start: { row: startRow, col: startCol },
        goal: { row: rows - 1, col: cols - 1 },
        maze: maze
    };

    return JSON.stringify(jsonMaze, null, 2);
}


function displayMaze(maze) {
    let mazeContainer = document.getElementById("maze-container");
    mazeContainer.innerText = formatMaze(maze);
}

function formatMaze(mazeJSON) {
    let formattedMaze = "";
    formattedMaze += "{\n";
    formattedMaze += `"rows": ${mazeJSON.rows},\n`;
    formattedMaze += `"cols": ${mazeJSON.cols},\n`;
    formattedMaze += `"start": ${JSON.stringify(mazeJSON.start)},\n`;
    formattedMaze += `"goal": ${JSON.stringify(mazeJSON.goal)},\n`;
    formattedMaze += `"maze": [\n`;
    for (let i = 0; i < mazeJSON.maze.length; i++) {
        formattedMaze += "  [";
        for (let j = 0; j < mazeJSON.maze[i].length; j++) {
            formattedMaze += JSON.stringify(mazeJSON.maze[i][j]);
            if (j < mazeJSON.maze[i].length - 1) {
                formattedMaze += ",";
            }
        }
        formattedMaze += "]";
        if (i < mazeJSON.maze.length - 1) {
            formattedMaze += ",";
        }
        formattedMaze += "\n";
    }
    formattedMaze += "]\n";
    formattedMaze += "}\n";
    return formattedMaze;
}

function copyMaze() {
    let mazeContainer = document.getElementById("maze-container");
    let mazeText = mazeContainer.innerText;

    let textarea = document.createElement("textarea");
    textarea.value = mazeText;
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, mazeText.length);

    navigator.clipboard.writeText(mazeText).then(function() {
        alert("Maze copied to clipboard!");
    }).catch(function(err) {
        console.error('Unable to copy text to clipboard: ', err);
    });

    document.body.removeChild(textarea);
}