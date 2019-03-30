//@ts-check

var h = document.getElementById("myH2");
h.insertAdjacentHTML("afterbegin", "<span style='color:red'>My span</span>");

const size = 10;
let table = document.getElementById("myBoard");
let html = "";

for (let i = 0; i < size; i++) {
  html += "<tr>";

  for (let j = 0; j < size; j++) {
    // id is a string: [0][2] exc., representing the current i,j cell
    
    // adding image does NOT work well on board over 4x4 (like 6x6):
    //html += `<td><a id=\'${i}${j}\'><img src=${board[i][j]}-80.png display=${board[i][j] === ' ' ?  'none': 'block'}></a></td>`;
    html += `<td id=[${i}][${j}]><img src="empty.gif" border=0 width="47" height="47"></img></td>`
  } 

  html += "</tr>";
} 

table.insertAdjacentHTML("afterbegin", html);






