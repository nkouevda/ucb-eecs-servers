// Sort by the first element of the given pairs
var sortPairsNumerical = function (a, b) {
  return b[0] - a[0];
};

// Sort the servers table by the given column (one of js-sort-{name,users,load})
var sortServerTable = function (column) {
  var columnIndex = {
    'js-sort-name': 0,
    'js-sort-users': 1,
    'js-sort-load': 2
  }[column];

  // This should never happen
  if (typeof columnIndex === 'undefined') {
    return false;
  }

  var arrowDiv = document.querySelector('#' + column + ' > div');
  var oldClassName = arrowDiv.className;
  var tBodies = document.getElementById('js-servers').tBodies, tBodiesLength, i;
  var tBody, rows, rowsLength, j, row, content, pairs, pairsLength;

  // Sort each table body separately
  for (i = 0, tBodiesLength = tBodies.length; i < tBodiesLength; ++i) {
    tBody = tBodies[i];
    rows = tBody.rows;
    pairs = [];

    for (j = 0, rowsLength = rows.length; j < rowsLength; ++j) {
      row = rows[j], content = row.cells[columnIndex].textContent;

      // Interpret each value as a float unless sorting by name
      if (column !== 'js-sort-name') {
        content = parseFloat(content);
      }

      pairs.push([content, row]);
    }

    // Only use the default lexicographic sort for names
    if (column === 'js-sort-name') {
      pairs.sort().reverse();
    } else {
      pairs.sort(sortPairsNumerical);
    }

    // Reverse sort if this column was previously sorted
    if (oldClassName === 'arrow-up') {
      pairs.reverse();
    }

    // Append the sorted rows in order
    for (j = 0, pairsLength = pairs.length; j < pairsLength; ++j) {
      tBody.appendChild(pairs[j][1]);
    }
  }

  // Flip all sorting arrows down
  document.querySelector('#js-sort-name > div').className = 'arrow-down';
  document.querySelector('#js-sort-users > div').className = 'arrow-down';
  document.querySelector('#js-sort-load > div').className = 'arrow-down';

  // Flip this column's arrow up if it was previously down
  if (oldClassName === 'arrow-down') {
    arrowDiv.className = 'arrow-up';
  }
};
