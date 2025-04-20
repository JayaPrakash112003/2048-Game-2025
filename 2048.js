var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
    // Add restart button listener after DOM is loaded
    document.getElementById("restart-button").addEventListener("click", restartGame);
}

function setGame() {
    console.log("Setting up new game");
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Clear existing tiles
    document.getElementById("board").innerHTML = "";
    score = 0;
    document.getElementById("score").innerText = score;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    
    setTwo();
    setTwo();
    document.getElementById("game-over").classList.add("hidden");
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (document.getElementById("game-over").classList.contains("hidden")) {
        let moved = false;
        if (e.code == "ArrowLeft") {
            moved = slideLeft();
            if (moved) setTwo();
        }
        else if (e.code == "ArrowRight") {
            moved = slideRight();
            if (moved) setTwo();
        }
        else if (e.code == "ArrowUp") {
            moved = slideUp();
            if (moved) setTwo();
        }
        else if (e.code == "ArrowDown") {
            moved = slideDown();
            if (moved) setTwo();
        }
        document.getElementById("score").innerText = score;
        if (moved && isGameOver()) {
            showGameOver();
        }
    }
});

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let newRow = slide(row);
        if (row.toString() !== newRow.toString()) moved = true;
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        let newRow = slide(row);
        newRow.reverse();
        if (row.toString() !== newRow.toString()) moved = true;
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newRow = slide(row);
        if (row.toString() !== newRow.toString()) moved = true;
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        let newRow = slide(row);
        newRow.reverse();
        if (row.toString() !== newRow.toString()) moved = true;
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function isGameOver() {
    if (hasEmptyTile()) {
        return false;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) {
                return false; // Horizontal merge possible
            }
            if (r < rows - 1 && board[r][c] == board[r + 1][c]) {
                return false; // Vertical merge possible
            }
        }
    }
    return true;
}

function showGameOver() {
    document.getElementById("final-score").innerText = score;
    document.getElementById("game-over").classList.remove("hidden");
}

function restartGame() {
    console.log("Restarting game");
    setGame();
}