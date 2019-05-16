const ShadowGrid = function(config) {
  this.cellHeights = config.cellHeights;
  this.cellWidths = config.cellWidths;
  this.cells = config.cells;
  this.cellRenderer = config.cellRenderer;
  this.container = config.container;
  this.numRows = config.numRows;
  this.numCols = config.numCols;
  this.viewportWidth = config.viewportWidth;
  this.viewportHeight = config.viewportHeight;

  this.viewport = document.createElement('div');
  this.viewport.className = 'shadow-grid-viewport';
  this.viewport.style.display = 'inline-block';
  this.viewport.style.width = this.viewportWidth + 'px';
  this.viewport.style.height = this.viewportHeight + 'px';
  this.viewport.style.overflow = 'scroll';
  
  this.table = document.createElement('div');
  this.table.style.display = 'inline-block';
  this.table.style.position = 'relative';
  this.table.className = 'shadow-grid-table';

  this.setTableSize();
  this.buildPool();
  this.updatePool();

  this.viewport.appendChild(this.table);
  this.container.appendChild(this.viewport);
};

ShadowGrid.prototype = {
  getRowIndexFromCellIndex: function(cellIndex) {
    return Math.floor(cellIndex / this.numCols);
  },

  getColIndexFromCellIndex: function(cellIndex) {
    return cellIndex % this.numCols;
  },

  updatePool: function() {
    //let numRows = this.numRows;
    //let numCols = this.numCols;

    let cellWidths = this.cellWidths;
    let cellHeights = this.cellHeights;
    let cells = this.cells;
    let cellXs = this.cellXs;
    let cellYs = this.cellYs;

    let cellIndices = [];

    for (let n=0; n<this.pool.length; n++) {
      cellIndices.push(n);
    }
    
    let pool = this.pool;
    
    for (let cellIndex of cellIndices) {
      let poolIndex = cellIndex;
      let cell = cells[cellIndex];
      let poolCell = pool[poolIndex];
      let rowIndex = this.getRowIndexFromCellIndex(cellIndex);
      let colIndex = this.getColIndexFromCellIndex(cellIndex);

      poolCell.innerHTML = cell.val;
      poolCell.style.width = cellWidths[colIndex] + 'px';
      poolCell.style.height = cellHeights[rowIndex] + 'px';
      poolCell.style.left = cellXs[colIndex] + 'px';
      poolCell.style.top = cellYs[rowIndex] + 'px';
    }
  },
  buildPool: function() {
    let poolSize = 16;
    this.pool = [];

    let frag = document.createDocumentFragment();

    for (let n =0; n<poolSize; n++) {
      let cell = document.createElement('div');
      cell.className = 'shadow-grid-cell';
      cell.style.display = 'inline-block';
      cell.style.position = 'absolute';

      this.pool.push(cell);
      frag.appendChild(cell);
    }

    this.table.appendChild(frag);
  },
  setTableSize: function() {
    let tableWidth = 0;
    let tableHeight = 0;
    let cellXs = [];
    let cellYs = [];

    for (let h=0; h<this.cellHeights.length; h++) {
      let height = this.cellHeights[h];
      cellYs[h] = tableHeight;
      tableHeight += height;
    }
    for (let w=0; w<this.cellWidths.length; w++) {
      let width = this.cellWidths[w];
      cellXs[w] = tableWidth;
      tableWidth += width;
    }

    this.tableWidth = tableWidth;
    this.tableHeight = tableHeight;
    this.cellXs = cellXs;
    this.cellYs = cellYs;

    this.table.style.width = tableWidth + 'px';
    this.table.style.height = tableHeight + 'px';
  }
};

// export
(function (global) {
  'use strict';

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function () { return ShadowGrid; });
  // CommonJS and Node.js module support.
  } else if (typeof exports !== 'undefined') {
    // Support Node.js specific `module.exports` (which can be a function)
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = ShadowGrid;
    }
    // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
    exports.ShadowGrid = ShadowGrid;
  } else {
    global.ShadowGrid = ShadowGrid;
  }
})(this);