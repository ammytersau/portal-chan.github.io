var cellSize = 25;
var gridWidth = 20;
var gridHeight = 20;
var aliveCellColor = 'yellow';
var deadCellColor = 'lightgray';
var getPixelString = function (px) { return px + 'px'; };
var getRows = function () { return document.getElementById('grid-container').getElementsByClassName('row'); };
var getRowAt = function (rows, y) { return rows[y].getElementsByClassName('cell'); };
var Grid = (function () {
    function Grid(width, height) {
        this.width = width;
        this.height = height;
        this.generateHTMLGrid();
    }
    Grid.prototype.generateHTMLGrid = function () {
        var _this = this;
        for (var y = 0; y < gridHeight; ++y) {
            var row = document.createElement('div');
            row.className = 'row';
            row.style.width = getPixelString(cellSize * this.width);
            row.style.height = getPixelString(cellSize);
            var _loop_1 = function(x) {
                var cell = document.createElement('div');
                cell.className = 'cell';
                cell.onclick = function () { return _this.toggleCell(cell); };
                row.appendChild(cell);
            };
            for (var x = 0; x < this.width; ++x) {
                _loop_1(x);
            }
            document.getElementById('grid-container').appendChild(row);
        }
    };
    Grid.prototype.step = function () {
        var newCellStates = [];
        var rows = getRows();
        for (var y = 0; y < rows.length; ++y) {
            newCellStates[y] = [];
            var cells = getRowAt(rows, y);
            for (var x = 0; x < cells.length; ++x) {
                var neighbors = this.getNumberOfNeighbors(rows, x, y);
                if (this.isAlive(cells[x])) {
                    if (neighbors == 2 || neighbors == 3)
                        newCellStates[y][x] = 0;
                    else
                        newCellStates[y][x] = 1;
                }
                else if (neighbors == 3)
                    newCellStates[y][x] = 0;
            }
        }
        this.drawNewCellStates(newCellStates);
    };
    Grid.prototype.drawNewCellStates = function (states) {
        var rows = getRows();
        for (var y = 0; y < rows.length; ++y) {
            var cells = getRowAt(rows, y);
            for (var x = 0; x < cells.length; ++x) {
                if (states[y][x] == 0)
                    cells[x].style.backgroundColor = aliveCellColor;
                else
                    cells[x].style.backgroundColor = deadCellColor;
            }
        }
    };
    Grid.prototype.clear = function () {
        var rows = getRows();
        for (var y = 0; y < rows.length; ++y) {
            var cells = getRowAt(rows, y);
            for (var x = 0; x < cells.length; ++x) {
                cells[x].style.backgroundColor = deadCellColor;
            }
        }
    };
    Grid.prototype.getNumberOfNeighbors = function (rows, x, y) {
        var _this = this;
        var neighboursOfTopOrBottomRow = function (row) {
            var neighbors = 0;
            if (x > 0 && _this.isAlive(row[x - 1]))
                neighbors++;
            if (_this.isAlive(row[x]))
                neighbors++;
            if (x < _this.width - 1 && _this.isAlive(row[x + 1]))
                neighbors++;
            return neighbors;
        };
        var neighbors = 0;
        if (y > 0) {
            var row = getRowAt(rows, y - 1);
            neighbors += neighboursOfTopOrBottomRow(row);
        }
        if (y < this.height - 1) {
            var row = getRowAt(rows, y + 1);
            neighbors += neighboursOfTopOrBottomRow(row);
        }
        var cells = getRowAt(rows, y);
        if (x > 0 && this.isAlive(cells[x - 1]))
            neighbors++;
        if (x < this.width - 1 && this.isAlive(cells[x + 1]))
            neighbors++;
        return neighbors;
    };
    Grid.prototype.isAlive = function (cell) {
        return cell.style.backgroundColor == aliveCellColor;
    };
    Grid.prototype.toggleCell = function (cell) {
        cell.style.backgroundColor = (cell.style.backgroundColor == aliveCellColor ? deadCellColor : aliveCellColor);
    };
    return Grid;
}());
window.onload = function () {
    var grid = new Grid(gridWidth, gridHeight);
    document.getElementById('step-button').onclick = function () { return grid.step(); };
    document.getElementById('clear-button').onclick = function () { return grid.clear(); };
};
