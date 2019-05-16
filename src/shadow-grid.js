const ShadowGrid = function(config) {
  let that = this;

  this.numBufferCells = config.numBufferCells || 2;
  this.cellHeights = config.cellHeights;
  this.cellWidths = config.cellWidths;
  this.cells = config.cells;
  this.cellRenderer = config.cellRenderer;
  this.container = config.container;
  this.numRows = config.numRows;
  this.numCols = config.numCols;
  this.viewportWidth = config.viewportWidth;
  this.viewportHeight = config.viewportHeight;
  this.dirty = true;

  this.viewport = document.createElement('div');
  this.viewport.className = 'shadow-grid-viewport';
  this.viewport.style.display = 'inline-block';
  this.viewport.style.width = this.viewportWidth + 'px';
  this.viewport.style.height = this.viewportHeight + 'px';
  this.viewport.style.overflow = 'scroll';
  this.viewport.addEventListener('scroll', function() {
    that.dirty = true;
  });
  
  this.table = document.createElement('div');
  this.table.style.display = 'inline-block';
  this.table.style.position = 'relative';
  this.table.className = 'shadow-grid-table';

  this.setSizesAndAggregations();
  this.setViewportColsAndRows();
  this.buildPool();
  this.updateLoop();

  this.viewport.appendChild(this.table);
  this.container.appendChild(this.viewport);


};

ShadowGrid.prototype = {
  updateLoop: function() {
    let that = this;

    //if (this.dirty) {
      this.updatePool();
      this.dirty = false;
    //}

    requestAnimationFrame(function() {
      that.updateLoop();
    });
  },
  setViewportColsAndRows: function() {
    let avgCellWidth = Math.round(this.tableWidth / this.numCols);
    let avgCellHeight = Math.round(this.tableHeight / this.numRows);
    this.numColsInViewport = Math.round(this.viewportWidth / avgCellWidth) + this.numBufferCells * 2;
    this.numRowsInViewport = Math.round(this.viewportHeight / avgCellHeight) + this.numBufferCells * 2;
  },
  getRowIndexFromCellIndex: function(cellIndex) {
    return Math.floor(cellIndex / this.numCols);
  },

  getColIndexFromCellIndex: function(cellIndex) {
    return cellIndex % this.numCols;
  },

  getTopLeftCellIndexInViewport: function() {
    let viewport = this.viewport;    
    let xIndex = Math.round(this.numCols * viewport.scrollLeft / this.tableWidth);
    let yIndex = Math.round(this.numRows * viewport.scrollTop / this.tableHeight);

    return yIndex * this.numCols + xIndex - this.numBufferCells;
  },

  getCellsInViewport: function() {
    let topLeftCellIndex = this.getTopLeftCellIndexInViewport();
    let numColsInViewport = this.numColsInViewport;
    let numRowsInViewport = this.numRowsInViewport;
    let cellIndices = [];
    let cellIndex;

    for (let r = 0; r<numRowsInViewport; r++) {
      cellIndex = topLeftCellIndex + (this.numCols * r);
      for (let c = 0; c<numColsInViewport; c++) {
        cellIndices.push(cellIndex);
        cellIndex++;
      }
    }

    return cellIndices;
  },

  updatePool: function() {
    let cellWidths = this.cellWidths;
    let cellHeights = this.cellHeights;
    let cells = this.cells;
    let cellXs = this.cellXs;
    let cellYs = this.cellYs;
    let pool = this.pool;
    let cellIndices = this.getCellsInViewport();

    // for now, always update all pool cells.  Can optimize later to skip
    // the pool cells that don't need to be updated
    for (let n=0; n<cellIndices.length; n++) {
      let cellIndex = cellIndices[n];
      let poolIndex = n;
      let cell = cells[cellIndex];
      let poolCell = pool[poolIndex];
      let rowIndex = this.getRowIndexFromCellIndex(cellIndex);
      let colIndex = this.getColIndexFromCellIndex(cellIndex);

      if (cell) {
        poolCell.innerHTML = this.cellRenderer(cell);
        poolCell.style.width = cellWidths[colIndex] + 'px';
        poolCell.style.height = cellHeights[rowIndex] + 'px';
        poolCell.style.left = cellXs[colIndex] + 'px';
        poolCell.style.top = cellYs[rowIndex] + 'px';
        poolCell.style.display = 'inline-block';
      }
      else {
        poolCell.style.display = 'none';
      }
    }
  },
  buildPool: function() {
    let poolSize = this.numColsInViewport * this.numRowsInViewport;
    let frag = document.createDocumentFragment();
    this.pool = [];

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
  setSizesAndAggregations: function() {
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