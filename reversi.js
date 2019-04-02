//  @ts-check

const ePawnImageSrc =
{
  Black: "piece-1.gif",
  White: "piece-2.gif",
  Empty: "piece-0.gif",
};

const ePawnType =
{
  Black: 'B',
  White: 'W',
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
const k_Size = 10
let g_Board = null;
let g_PlayerTurnImg = ePawnImageSrc.White;
let g_PlayerTurnType = ePawnType.White;
let g_TrainerMode = false;


function changeTurn()
{
  if (g_PlayerTurnType === ePawnType.White)
  {
    g_PlayerTurnType = ePawnType.Black;
    g_PlayerTurnImg = ePawnImageSrc.Black;
  }
  else
  {
    g_PlayerTurnType = ePawnType.White;
    g_PlayerTurnImg = ePawnImageSrc.White;
  }
}

function executeTrainerMode()
{
  if(g_TrainerMode === false)
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
      html += `<td id=cell[${ j }][${ i }]><img id=img[${ j }][${ i }] src="piece-0.gif" border=0 width=${ k_SquareSize } height=${ k_SquareSize }></img></td>`;
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
      i_Cell.Img.src = ePawnImageSrc.Black;
      i_Cell.Pawn = ePawnType.Black;
      break;

    case (ePawnType.White):
      i_Cell.Img.src = ePawnImageSrc.White;
      i_Cell.Pawn = ePawnType.White;
      break;
  }
}

function initBoard()
{
  var mid = k_Size / 2;
  createGameTable();
  linkBoardToHTML();
  SetCellWithNewPawn(g_Board[mid - 1][mid - 1], ePawnType.Black);
  SetCellWithNewPawn(g_Board[mid][mid], ePawnType.Black);
  SetCellWithNewPawn(g_Board[mid - 1][mid], ePawnType.White);
  SetCellWithNewPawn(g_Board[mid][mid - 1], ePawnType.White);
}

function MouseEnter(i, j)
{
  let isValid = isValidMove(i, j);
  if (isValid && g_Board[i][j].Pawn === null)
  {
    g_Board[i][j].Img.src = g_PlayerTurnImg;
  }
  if(g_TrainerMode)
  {
    findCellsHover(i, j);
  }
  
}

function MouseLeave(i, j)
{
  for (let x = 0; x < k_Size; x++)
  {
    for (let y = 0; y< k_Size ; y++)
    {
      if(g_Board[x][y].Pawn === ePawnType.White)
      {
        g_Board[x][y].Img.src = ePawnImageSrc.White;
      }
      else if(g_Board[x][y].Pawn === ePawnType.Black)
      {
        g_Board[x][y].Img.src = ePawnImageSrc.Black;
      }
      else if(g_Board[x][y].Pawn === ePawnType.Empty)
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

function isValidMove(i, j)
{
  let x, y;
  let valid = false;

  for (x = -1; x < 2; x++)
  {
    for (y = -1; y < 2; y++)
    {
      if ((i + x > 0) && (j + y > 0))
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

let Ctr = (function () 
{
  initBoard();
})();

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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x < k_Size)
  {
    x++;
    y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    x--;
    y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    x--;
    y--;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x < k_Size)
  {
    x++;
    y--;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && y < k_Size)
  {
    //x++;
    y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    //x--;
    y--;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    x--;
    //y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x < k_Size)
  {
    x++;
    //y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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

  if (isValidMove(i, j))
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

function findCellsHover(i, j)
{
  //diagonal right down
  let x = i;
  let y = j;

  x++;
  y++;
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x < k_Size)
  {
    x++;
    y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    x--;
    y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    x--;
    y--;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x < k_Size)
  {
    x++;
    y--;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && y < k_Size)
  {
    //x++;
    y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    //x--;
    y--;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x >= 0)
  {
    x--;
    //y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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
  while (g_Board[x][y].Pawn !== g_PlayerTurnType && g_Board[x][y].Pawn !== ePawnType.Empty && x < k_Size)
  {
    x++;
    //y++;
  }

  if (g_Board[x][y].Pawn === g_PlayerTurnType)
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


