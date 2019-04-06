//  @ts-check


const ePawnImageSrc =
{
  Black: "piece-1.gif",
  White: "piece-2.gif",
  Empty: "piece-0.gif",
};

/*
const ePawnImageSrc = 
{
  BlackLight: "piece-1-light.gif",
  BlackDark: "piece-1-dark.gif",
  WhiteLight: "piece-2-light.gif",
  WhiteDark: "piece-2-dark.gif",
  Empty: "piece-0.gif"
}
*/

const ePawnType =
{
  Black: "Black",
  White: "White",
  Tie: "Tie",
  Empty: null,
};

/*
const eCellColors =
{
  Type1: 'deeppink',
  Type2: 'mediumtoturquoise',
};
*/

const k_SquareSize = 45;
let k_Size = 6;
let g_Board = null;
let g_PlayerTurnImg = ePawnImageSrc.White;
let g_PlayerTurnType = ePawnType.White;
let g_TrainerMode = false;
let g_Timer;
let g_Player1;
let g_Player2;
let g_gameActive = false;

let stats = {
  scorePlayer1: 2,
  scorePlayer2: 2,
  twoPawnsPlayer1: 1,
  twoPawnsPlayer2: 1,
  roundTimePlayer1: [],
  averagePlayer1: 0,
  roundTimePlayer2: [],
  averagePlayer2: 0,
  roundsNum: 0,
};

function changeTurn()
{
  let full;
  let winner;

  calcNextMove();
  updateAverageTime();
  updateRounds();
  full = updateScore();
  update2Pawns();
  updateGame();
  updateMove();
  winner = checkWinner(full);
  if (winner)
  {
    endGameAsWinner(winner);
  }
}

function checkWinner(full)
{
  let winner = null;

  if (full)
  {
    if (stats.scorePlayer1 > stats.scorePlayer2)
    {
      winner = ePawnType.White;
    }
    else if (stats.scorePlayer1 < stats.scorePlayer2)
    {
      winner = ePawnType.Black
    }
    else
    {
      winner = ePawnType.Tie;
    }
  }
  else
  {
    if (stats.scorePlayer1 === 0)
    {
      winner = ePawnType.Black;
    }
    else if (stats.scorePlayer2 === 0)
    {
      winner = ePawnType.White;
    }
  }

  return winner;
}

function calcNextMove()
{
  let time = new Date();

  if (g_PlayerTurnType == ePawnType.White)
  {
    let temp = time.getTime() - stats.roundTimePlayer1.pop();
    stats.roundTimePlayer1.push(temp / 1000);
    stats.roundTimePlayer2.push(time.getTime());
  }

  if (g_PlayerTurnType == ePawnType.Black)
  {
    let temp = time.getTime() - stats.roundTimePlayer2.pop();
    stats.roundTimePlayer2.push(temp / 1000);
    stats.roundTimePlayer1.push(time.getTime());
  }
}

function updateMove()
{
  let player1 = document.getElementById("stats1-container");
  let player2 = document.getElementById("stats2-container");

  if (g_PlayerTurnType === ePawnType.White)
  {
    g_PlayerTurnType = ePawnType.Black;
    g_PlayerTurnImg = ePawnImageSrc.Black;
    player2.className = "current-player";
    player1.className = "notcurrent-player";
  }
  else
  {
    g_PlayerTurnType = ePawnType.White;
    g_PlayerTurnImg = ePawnImageSrc.White;
    player1.className = "current-player";
    player2.className = "notcurrent-player";
  }
}

function updateRounds()
{
  stats.roundsNum++;
}

function updateGame()
{
  if (g_PlayerTurnType == ePawnType.White)
  {
    document.getElementById("average-player1").innerHTML = `${ stats.averagePlayer1.toFixed(2) }`;
  }

  if (g_PlayerTurnType == ePawnType.Black)
  {
    document.getElementById("average-player2").innerHTML = `${ stats.averagePlayer2.toFixed(2) }`;
  }

  document.getElementById("2pawns-player1").innerHTML = `${ stats.twoPawnsPlayer1 }`;
  document.getElementById("2pawns-player2").innerHTML = `${ stats.twoPawnsPlayer2 }`;
  document.getElementById("score-player1").innerHTML = `${ stats.scorePlayer1 }`;
  document.getElementById("score-player2").innerHTML = `${ stats.scorePlayer2 }`;
  document.getElementById("rounds").innerHTML = `${ stats.roundsNum }`;

}

function updateScore()
{
  let counter1 = 0;
  let counter2 = 0;
  let full = true;

  for (let i = 0; i < k_Size; i++)
  {
    for (let j = 0; j < k_Size; j++)
    {
      if (g_Board[i][j].Pawn === ePawnType.Black)
      {
        counter2++;
      }
      if (g_Board[i][j].Pawn === ePawnType.White)
      {
        counter1++;
      }
      if (g_Board[i][j].Pawn === ePawnType.Empty)
      {
        full = false;
      }
    }
  }

  stats.scorePlayer1 = counter1;
  stats.scorePlayer2 = counter2;

  return full;
}

function update2Pawns()
{
  if (stats.scorePlayer1 === 2)
  {
    stats.twoPawnsPlayer1++;
  }
  if (stats.scorePlayer2 === 2)
  {
    stats.twoPawnsPlayer2++;
  }
}

function updateAverageTime()
{
  let sum = 0;

  if (g_PlayerTurnType === ePawnType.White)
  {
    stats.roundTimePlayer1.forEach((timeSlot) => { sum += timeSlot; });
    stats.averagePlayer1 = sum / stats.roundTimePlayer1.length;
  }
  if (g_PlayerTurnType === ePawnType.Black)
  {
    stats.roundTimePlayer2.forEach((timeSlot) => { sum += timeSlot; });
    stats.averagePlayer2 = sum / stats.roundTimePlayer2.length;
  }
}


function executeTrainerMode()
{
  if (g_TrainerMode === false)
  {
    g_TrainerMode = true;
  }
  else
  {
    g_TrainerMode = false;
  }
}

function createGameTable()
{
  let table = document.getElementById("myBoard");
  let html = "";

  for (let i = 0; i < k_Size; i++)
  {
    html += "<tr>";
    for (let j = 0; j < k_Size; j++)
    {
      if((i%2 === 0 && j%2 === 0)||(i%2=== 1 && j%2 ===1))
      {
        html += `<td id=cell[${ j }][${ i }]><img id=img[${ j }][${ i }] class="dark" src="piece-0.gif" border=0 width=${ k_SquareSize } height=${ k_SquareSize }></img></td>`;
      }

      else
      {
        html += `<td id=cell[${ j }][${ i }]><img id=img[${ j }][${ i }] class="light" src="piece-0.gif" border=0 width=${ k_SquareSize } height=${ k_SquareSize }></img></td>`;
      }
    }

    html += "</tr>";
  }

  table.insertAdjacentHTML("afterbegin", html);
}

function linkBoardToHTML()
{
  let logicGameBoard = new Array(k_Size);

  for (let i = 0; i < k_Size; i++)
  {
    logicGameBoard[i] = new Array(k_Size);
    for (let j = 0; j < k_Size; j++)
    {
      let GameCell =
      {
        Pawn: ePawnType.Empty,
        Cell: document.getElementById(`cell[${ i }][${ j }]`),
        Img: document.getElementById(`img[${ i }][${ j }]`),
        //CellColor: document.getElementById(`cell[${ i }][${ j }]`).style.backgroundColor
      }

      logicGameBoard[i][j] = GameCell;
      GameCell.Cell.addEventListener('mouseleave', function () { MouseLeave(i, j); });
      GameCell.Cell.addEventListener('mouseenter', function () { MouseEnter(i, j); });
      GameCell.Cell.addEventListener('click', function () { MouseClick(i, j); });

    }
  }

  g_Board = logicGameBoard;
}

function SetCellWithNewPawn(i_Cell, i_PawnType)
{
  switch (i_PawnType)
  {
    case (ePawnType.Black):
      i_Cell.Pawn = ePawnType.Black;
      if(i_Cell.Img.className === "dark")
      {
        i_Cell.Img.src = ePawnImageSrc.Black;
      }
      else
      {
        i_Cell.Img.src = ePawnImageSrc.Black;
      }
      break;

    case (ePawnType.White):
    i_Cell.Pawn = ePawnType.White;
    if(i_Cell.Img.className === "dark")
      {
        i_Cell.Img.src = ePawnImageSrc.White;
      }
      else
      {
        i_Cell.Img.src = ePawnImageSrc.White;
      }
      break;
  }
}

function initBoard()
{
  createGameTable();
  linkBoardToHTML();
  setBoard();
}

function setBoard()
{
  let mid = k_Size / 2;

  SetCellWithNewPawn(g_Board[mid - 1][mid - 1], ePawnType.Black);
  SetCellWithNewPawn(g_Board[mid][mid], ePawnType.Black);
  SetCellWithNewPawn(g_Board[mid - 1][mid], ePawnType.White);
  SetCellWithNewPawn(g_Board[mid][mid - 1], ePawnType.White);
}

function MouseEnter(i, j)
{
  if (g_gameActive)
  {
    let isValid = isValidMove(i, j);
    if (isValid && g_Board[i][j].Pawn === null)
    {
      g_Board[i][j].Img.src = g_PlayerTurnImg;
    }
    if (g_TrainerMode)
    {
      findCellsHover(i, j);
    }
  }
}

function MouseLeave(i, j)
{
  if (g_gameActive)
  { 
    for (let x = 0; x < k_Size; x++)
    {
      for (let y = 0; y < k_Size; y++)
      {
        if (g_Board[x][y].Pawn === ePawnType.White)
        {
          g_Board[x][y].Img.src = ePawnImageSrc.White;
        }
        else if (g_Board[x][y].Pawn === ePawnType.Black)
        {
          g_Board[x][y].Img.src = ePawnImageSrc.Black;
        }
        else if (g_Board[x][y].Pawn === ePawnType.Empty)
        {
          g_Board[x][y].Img.src = ePawnImageSrc.Empty;
        }/*
      else if(g_Board[x][y].CellColor === eCellColors.Type1)
      {
        g_Board[x][y].Cell.style.backgroundcolor = eCellColors.Type1;
      }
      else if(g_Board[x][y].CellColor === eCellColors.Type2)
      {
        g_Board[x][y].Cell.style.backgroundcolor = eCellColors.Type2;
      }*/
      }
    }
    /*
    if (isValidMove(i, j) && g_Board[i][j].Pawn === null)
    {
      g_Board[i][j].Img.src = ePawnImageSrc.Empty;
    }
    */
  }
}

function isValidMove(i, j)
{
  let x, y;
  let valid = false;

  for (x = -1; x < 2; x++)
  {
    for (y = -1; y < 2; y++)
    {
      if (((i + x >= 0) && (j + y >= 0)) && (i + x < k_Size) && (j + y < k_Size))
      {
        if (g_Board[i + x][j + y].Pawn !== null && (x !== 0 || y !== 0))
        {
          valid = true;
          break;
        }
      }
    }
  }
  return valid;
}

(function ()
{
  initBoard();
  updateGame();
})();


function erasePrevBoard()
{
  let table = document.getElementById("myBoard");
  table.removeChild(table.childNodes[0]);
}

function startGame() 
{
  if (k_Size !== 6)
  {
    erasePrevBoard();
    initBoard();
  }

  let table = document.getElementById("myBoard");
  table.className = "game-on";
  let player1 = document.getElementById("stats1-container");
  let player2 = document.getElementById("stats2-container");

  if(g_PlayerTurnType === ePawnType.White)
  {
    player1.className = "current-player";
    player2.className = "notcurrent-player";
  }
  else if(g_PlayerTurnType === ePawnType.Black)
  {
    player2.className = "current-player";
    player1.className = "notcurrent-player";
  }

  g_gameActive = true;
  startTimer();
  setBoardForANewGame();
  initStats();
  updateGame();
  document.getElementById("average-player1").innerHTML = `${ stats.averagePlayer1.toFixed(2) }`;
  document.getElementById("average-player2").innerHTML = `${ stats.averagePlayer2.toFixed(2) }`;
  // @ts-ignore
  document.getElementById("stop").disabled = false;


  let temp = new Date();
  if (g_PlayerTurnType === ePawnType.White)
  {
    stats.roundTimePlayer1.push(temp.getTime());
  }
  else
  {
    stats.roundTimePlayer2.push(temp.getTime());
  }

};


/*
function getExpectedNewPawns(i, j)
{
  let x, y;
  let matrix = Array(k_Size);
  for (x = 0; x < k_Size; x++)
  {
    matrix[x] = Array(k_Size);
    for (y = 0; y < k_Size; y++)
    {
      matrix[x][y] = null;
    }
  }

  for (x = -1; x < 2; x++)
  {
    for (y = -1; y < 2; y++)
    {
      if ((i + x > 0) && (j + y > 0))
      {
        if (x !== 0 || y !== 0)
        {
          addPoss(x, y, i, j, matrix);
        }
      }
    }
  }
  return matrix;
}


function addPoss(colAdd, rowAdd, i, j, matrix)
{
  let x = i;
  let y = j;
  let foundPawn = false;
  y += colAdd;
  x += rowAdd;
  while (x >= 0 && y >= 0 && x < k_Size && y < k_Size)
  {
    if (g_Board[x][y].Pawn === g_PlayerTurnType)
    {
      foundPawn = true;
      break;
    }
    y += colAdd;
    x += rowAdd;
  }

  if (foundPawn)
  {
    x = i;
    y = j;
    while (x >= 0 && y >= 0 && x < k_Size && y < k_Size)
    {
      y += colAdd;
      x += rowAdd;
      if (g_Board[x][j].Pawn === g_PlayerTurnType)
      {
        break;
      }
      else
      {
        matrix[x][y] = g_PlayerTurnType;
      }
    }
  }
}
*/
function findCells(i, j)
{
  //diagonal right down
  let x = i;
  let y = j;

  x++;
  y++;
  while (x < k_Size && y < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x++;
    y++;
  }

  if (x < k_Size && y < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t < x; t++)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      s++;
    }
  }

  //diagonal left down
  x = i;
  y = j;

  x--;
  y++;
  while (x > 0 && y < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x--;
    y++;
  }

  if (x > 0 && y < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t > x; t--)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      s++;
    }
  }

  //diagonal left up
  x = i;
  y = j;

  x--;
  y--;
  while (x > 0 && y > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x--;
    y--;
  }

  if (x > 0 && y > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t > x; t--)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      s--;
    }
  }

  //diagonal right up
  x = i;
  y = j;

  x++;
  y--;
  while (x < k_Size && y > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x++;
    y--;
  }

  if (x < k_Size && y > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t < x; t++)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      s--;
    }
  }

  //down
  x = i;
  y = j;

  y++;
  while (y < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    //x++;
    y++;
  }

  if (y < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (s = j; s < y; s++)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //s++;
    }
  }

  //up
  x = i;
  y = j;

  y--;
  while (y > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    //x--;
    y--;
  }

  if (y > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (s = j; s > y; s--)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //s++;
    }
  }

  //left
  x = i;
  y = j;

  x--;
  while (x > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x--;
    //y++;
  }

  if (x > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t > x; t--)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //s++;
    }
  }

  //right
  x = i;
  y = j;

  x++;
  while (x < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x++;
    //y++;
  }

  if (x < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t < x; t++)
    {
      g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //s++;
    }
  }
}

function MouseClick(i, j)
{
  if (g_gameActive)
  {
    if (isValidMove(i, j) && g_Board[i][j].Pawn === null)
    {
      findCells(i, j);
      SetCellWithNewPawn(g_Board[i][j], g_PlayerTurnType);
      changeTurn();
      /*
      let x, y;
      let possMatrix = getExpectedNewPawns(i, j);
      for (x = 0; x < k_Size; x++)
      {
        for (y = 0; y < k_Size; y++)
        {
          if (possMatrix[x][y] !== null)
          {
            SetCellWithNewPawn(g_Board[x][y], g_PlayerTurnType);
          }
        }
      }
      */


      //g_PlayerTurnImg = ePawnImageSrc.Black;
      //g_PlayerTurnType = ePawnType.Black;
    }
  }
}

function findCellsHover(i, j)
{
  //diagonal right down
  let x = i;
  let y = j;

  x++;
  y++;
  while (x < k_Size && y < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x++;
    y++;
  }

  if (x < k_Size && y < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t < x; t++)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      // g_Board[t][s].Cell.style.backgroundColor = "green";
      s++;
    }
  }

  //diagonal left down
  x = i;
  y = j;

  x--;
  y++;
  while (x > 0 && y < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x--;
    y++;
  }

  if (x > 0 && y < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t > x; t--)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //g_Board[t][s].Cell.style.backgroundColor = "green";
      s++;
    }
  }

  //diagonal left up
  x = i;
  y = j;

  x--;
  y--;
  while (x > 0 && y > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x--;
    y--;
  }

  if (x > 0 && y > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t > x; t--)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //g_Board[t][s].Cell.style.backgroundColor = "green";
      s--;
    }
  }

  //diagonal right up
  x = i;
  y = j;

  x++;
  y--;
  while (x < k_Size && y > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x++;
    y--;
  }

  if (x < k_Size && y > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t < x; t++)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //g_Board[t][s].Cell.style.backgroundColor = "green";
      s--;
    }
  }

  //down
  x = i;
  y = j;

  y++;
  while (y < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    //x++;
    y++;
  }

  if (y < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (s = j; s < y; s++)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //g_Board[t][s].Cell.style.backgroundColor = "green";
      //s++;
    }
  }

  //up
  x = i;
  y = j;

  y--;
  while (y > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    //x--;
    y--;
  }

  if (y > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (s = j; s > y; s--)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //g_Board[t][s].Cell.style.backgroundColor = "green";
      //s++;
    }
  }

  //left
  x = i;
  y = j;

  x--;
  while (x > 0 && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x--;
    //y++;
  }

  if (x > 0 && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t > x; t--)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //g_Board[t][s].Cell.style.backgroundColor = "green";
      //s++;
    }
  }

  //right
  x = i;
  y = j;

  x++;
  while (x < k_Size && g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty)
  {
    x++;
    //y++;
  }

  if (x < k_Size && g_Board[x][y].Pawn === g_PlayerTurnType)
  {
    let t = i;
    let s = j;

    for (t = i; t < x; t++)
    {
      //g_Board[t][s].Pawn = g_PlayerTurnType;
      g_Board[t][s].Img.src = g_PlayerTurnImg;
      //g_Board[t][s].Cell.style.backgroundColor = "green";
      //s++;
    }
  }
}


function startTimer()
{
  // @ts-ignore
  document.getElementById("start").disabled = true;
  let minutesLabel = document.getElementById("minutes");
  let secondsLabel = document.getElementById("seconds");
  let totalSeconds = 0;
  let timer = setInterval(setTime, 1000);
  g_Timer = timer;

  function setTime()
  {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    // @ts-ignore
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }
};

function pad(val)
{
  let valString = val + "";
  if (valString.length < 2)
  {
    return "0" + valString;
  } else
  {
    return valString;
  }
}

function endGameAsWinner(winner)
{
  showWinner(winner);

  if (winner === ePawnType.Black)
  {
    g_PlayerTurnType = ePawnType.Black;
    g_PlayerTurnImg = ePawnImageSrc.Black;
  }
  else
  {
    g_PlayerTurnType = ePawnType.White;
    g_PlayerTurnImg = ePawnImageSrc.White;
  }

  endGame();
  // @ts-ignore
  document.getElementById("stop").disabled = true;
  let table = document.getElementById("myBoard");
  table.className = "game-off";
  g_gameActive = false;

}

function initStats()
{
  stats.averagePlayer1 = 0;
  stats.averagePlayer2 = 0;
  stats.roundsNum = 0;
  stats.scorePlayer1 = 2;
  stats.scorePlayer2 = 2;
  stats.twoPawnsPlayer1 = 1;
  stats.twoPawnsPlayer2 = 1;
  stats.roundTimePlayer1 = [];
  stats.roundTimePlayer2 = [];
  document.getElementById("minutes").innerHTML = "00";
  document.getElementById("seconds").innerHTML = "00";
}

function setBoardForANewGame()
{
  for (let i = 0; i < k_Size; i++)
  {
    for (let j = 0; j < k_Size; j++)
    {
      g_Board[i][j].Pawn = ePawnType.Empty;
      g_Board[i][j].Img.src = ePawnImageSrc.Empty;
    }
  }

  setBoard();
}

function endGame()
{
  // @ts-ignore
  document.getElementById("start").disabled = false;
  clearInterval(g_Timer);

}

function modifyBoardSize(size)
{
  k_Size = size;
}

function technicalVictory()
{
  if (g_PlayerTurnType === ePawnType.White)
  {
    endGameAsWinner(ePawnType.Black);
  }
  else if (g_PlayerTurnType === ePawnType.Black)
  {
    endGameAsWinner(ePawnType.White);
  }
}

/**************/
/*Winner Alert*/
/**************/

var modal = document.getElementById('myModal');
var modalText = document.getElementById('myModalText');
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
function showWinner(winner)
{
  modal.style.display = "block";
  if (winner === ePawnType.Tie)
  {
    modalText.innerHTML = "There is a Tie";
  }
  else
  {
    modalText.innerHTML = `The Winner is: The ${winner} Player`;
  }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/*****************/
/******Buttons****/
/******************/

var animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');
  
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}
/*
let winnermsg = document.getElementsByClassName("modal-content");
winnermsg.addEventListener('mouseup', animateButton);
*/
/***********************/
/*****List Button****/
/**********************/
var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  b.setAttribute("id", "size-options");
  

  for (j = 0; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.id = selElmnt.options[j].value;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        modifyBoardSize(this.id);
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
/*
addEventToOptions();
*/
/*
function addEventToOptions()
{
  making the select options work
  let options = document.getElementById("size-options").childNodes;
  for(let child in options)
  {
    options[child].addEventListener('click', function () 
    { 
      modifyBoardSize(options[child].id);
    });
  }
}
*/

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);


