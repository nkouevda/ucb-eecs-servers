// Nikita Kouevda
// 2013/04/09

// Sort by the first element of the given pairs
var sortPairsNumerical = function (a, b) {
  return a[0] - b[0];
};

// Sort the table of servers by the given column
var sortServerTable = function (column) {
  var table = document.getElementById('servers').tBodies[0];
  var online = [], offline = [];

  for (var i = 0, len = table.rows.length; i < len; ++i) {
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
  for (var i = 0, len = online.length; i < len; ++i) {
    table.appendChild(online[i][1]);
  }

  // Append the offline servers in order
  for (var i = 0, len = offline.length; i < len; ++i) {
    table.appendChild(offline[i][1]);
  }
};
