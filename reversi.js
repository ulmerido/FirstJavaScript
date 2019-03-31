//  @ts-check

var h = document.getElementById("myH2");
h.insertAdjacentHTML("afterbegin", "<span style='color:red'>My span</span>");
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
  Empty: "",
};

const k_SquareSize = 45;
const k_Size = 10;
let   g_Board = null;
let   g_PlayerTurnImg = ePawnImageSrc.White;
let   g_PlayerTurnType = ePawnType.White;


function createGameTable()
{
  let table = document.getElementById("myBoard");
  let html = "";

  for (let i = 0; i < k_Size; i++)
  {
    html += "<tr>";
    for (let j = 0; j < k_Size; j++)
    {
      html += `<td id=cell[${ i }][${ j }]><img id=img[${ i }][${ j }] src="piece-0.gif" border=0 width=${k_SquareSize} height=${k_SquareSize}></img></td>`;
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
        Pawn: null,
        Cell: document.getElementById(`cell[${ i }][${ j }]`),
        Img:  document.getElementById(`img[${ i }][${ j }]`)
      }

      logicGameBoard[i][j] = GameCell;
      GameCell.Cell.addEventListener('mouseenter', function(){MouseEnter(i,j);})
    }
  }

  g_Board = logicGameBoard;
}

function SetCellWithNewPawn(i_Cell, i_PawnType)
{
  switch(i_PawnType)
  {
    case(ePawnType.Black):
      i_Cell.Img.src = ePawnImageSrc.Black;
      i_Cell.Pawn = ePawnType.Black;
      break;

    case(ePawnType.White):
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
  let isValid = isValidMove();
  if(isValid)
  {
    g_Board[i][j].Img.src = g_PlayerTurnImg;
  }
  else
  {

  }
}

function isValidMove(i,j)
{
  return true;
}

let Ctr = (function () 
{
  initBoard();
})();

