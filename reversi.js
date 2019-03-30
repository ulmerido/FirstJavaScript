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
    html += `<td id=[${i}][${j}]><img src="piece-0.gif" border=0 width="47" height="47"></img></td>`;
  }

  html += "</tr>";
}

table.insertAdjacentHTML("afterbegin", html);

//linking logicGameBoard to HTMLgameBoard
let logicGameBoard = new Array(size);
for (let i = 0; i < size; i++) 
{
  logicGameBoard[i] = new Array(size);
  for(let j = 0 ; j < size ; j++)
  {
    logicGameBoard[i][j] = document.getElementById(`[${i}][${j}]`);
  }
}

//init board
logicGameBoard[(size/2)-1][(size/2)-1].firstChild.src = "piece-1.gif";
logicGameBoard[(size/2)-1][(size/2)].firstChild.setAttribute("src", "piece-2.gif");
logicGameBoard[(size/2)][(size/2)-1].firstChild.setAttribute("src", "piece-2.gif");
logicGameBoard[(size/2)][(size/2)].firstChild.setAttribute("src", "piece-1.gif");
