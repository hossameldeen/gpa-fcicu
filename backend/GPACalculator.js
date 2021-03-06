// Assumes it's correct
function calculateGPAFromResult(result) {
  var points = {'A+': 4.0, 'A': 3.7, 'B+': 3.3, 'B': 3.0, 'C+': 2.7, 'C': 2.4,
                'D+': 2.2, 'D': 2.0, 'F': 0.0};
  var grades = {}; // You could fail a course, then take it again.
  for (var key in result.gradeTables) {
    var arr = result.gradeTables[key];
    for (var i = 0; i < 3; ++i) {
      if (typeof arr[i] === 'undefined')
        continue;
      var rows = arr[i].children[0].children;
      for (var j = 2; j < rows.length; ++j) {
        var grade = points[rows[j].children[6].textContent.slice(0, -1)];
        if (typeof grade === 'undefined') // Not finished yet.
          continue;
        var courseID = rows[j].children[0].textContent;
        if (typeof grades[courseID] === 'undefined')
          grades[courseID] = grade;
        else
          grades[courseID] = Math.max(grade, grades[courseID]);
      }
    }
  }
  var sum = 0.0, cnt = 0;
  for (var courseID in grades) {
    ++cnt;
    sum += grades[courseID];
    if (courseID.slice(2) === '498') {  // GP
      ++cnt;
      sum += grades[courseID];
    }
  }
  if (cnt === 0)
    return 0;
  return sum / cnt;
}
