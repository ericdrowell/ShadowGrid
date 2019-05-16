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
  this.table.className = 'shadow-grid-table';

  this.setTableSize();
  this.buildPool();
  this.updatePool();

  this.viewport.appendChild(this.table);
  this.container.appendChild(this.viewport);
};

ShadowGrid.prototype = {
  updatePool: function() {
    //let numRows = this.numRows;
    //let numCols = this.numCols;

    let cellWidths = this.cellWidths;
    let cellHeights = this.cellHeights;
    let cells = this.cells;

    let cellIndices = [];

    for (let n=0; n<this.poolSize; n++) {
      cellIndices.push(n);
    }
    
    let pool = this.pool;
    
    for (let cellIndex of cellIndices) {
      let poolIndex = cellIndex;
      let cell = cells[cellIndex];
      let poolCell = pool[poolIndex];

      let rowIndex = 0;
      let colIndex = 0;

      poolCell.innerHTML = cell.val;
      poolCell.style.width = cellWidths[colIndex] + 'px';
      poolCell.style.height = cellHeights[rowIndex] + 'px';
    }
  },
  buildPool: function() {
    let poolSize = 20;

    this.poolSize = poolSize;
    this.pool = [];

    let frag = document.createDocumentFragment();

    for (let n =0; n<poolSize; n++) {
      let cell = document.createElement('div');
      cell.className = 'shadow-grid-cell';
      cell.style.display = 'inline-block';

      this.pool.push(cell);
      frag.appendChild(cell);
    }

    this.table.appendChild(frag);
  },
  setTableSize: function() {
    let tableWidth = 0;
    let tableHeight = 0;

    for (let height of this.cellHeights) {
      tableHeight += height;
    }
    for (let width of this.cellWidths) {
      tableWidth += width;
    }

    this.tableWidth = tableWidth;
    this.tableHeight = tableHeight;

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