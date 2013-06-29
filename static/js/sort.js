// Nikita Kouevda
// 2013/06/28

// Sort by the first element of the given pairs
var sortPairsNumerical = function (a, b) {
  return a[0] - b[0];
};

// Sort the table of servers by the given column
var sortServerTable = function (column) {
  var table = document.getElementById('servers').tBodies[0];
  var online = [], offline = [];
  var i, length;

  for (i = 0, length = table.rows.length; i < length; ++i) {
    var row = table.rows[i];
    var content = row.cells[column].textContent || row.cells[column].innerText;

    // Interpret the values as floats unless sorting by name
    if (column !== 0) {
      content = parseFloat(content);
    }

    // Add this row to the corresponding array
    if (row.className == 'server-online') {
      online.push([content, row]);
    } else {
      offline.push([content, row]);
    }
  }

  // Sort names lexicographically and numbers numerically
  if (column === 0) {
    online.sort();
    offline.sort();
  } else{
    online.sort(sortPairsNumerical).reverse();
    offline.sort(sortPairsNumerical).reverse();
  }

  // Append the online servers in order
  for (i = 0, length = online.length; i < length; ++i) {
    table.appendChild(online[i][1]);
  }

  // Append the offline servers in order
  for (i = 0, length = offline.length; i < length; ++i) {
    table.appendChild(offline[i][1]);
  }
};
