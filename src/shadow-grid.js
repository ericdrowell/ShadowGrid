const ShadowGrid = function(config) {
  this.rowHeights = config.rowHeights;
  this.colWidths = config.colWidths;
  this.rows = config.rows;
  this.cellRenderer = config.cellRenderer;
  this.container = config.container;
  this.viewportWidth = config.viewportWidth;
  this.viewportHeight = config.viewportHeight;

  this.viewport = document.createElement('div');
  this.viewport.className = 'shadow-grid-viewport';
  this.viewport.style.display = 'inline-block';
  this.viewport.style.width = this.viewportWidth + 'px';
  this.viewport.style.height = this.viewportHeight + 'px';
  
  this.table = document.createElement('div');
  this.table.style.display = 'inline-block';
  this.table.className = 'shadow-grid-table';

  this.setTableSize();
  
  this.viewport.appendChild(this.table);
  this.container.appendChild(this.viewport);
};

ShadowGrid.prototype = {
  setTableSize: function() {
    let tableWidth = 0;
    let tableHeight = 0;

    for (let height of this.rowHeights) {
      tableHeight += height;
    }
    for (let width of this.colWidths) {
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