//  @ts-check


import { ePawnImageSrc } from "./Enums/ePawnImageSrc.js";
import { ePawnType } from "./Enums/ePawnType.js";
import * as GameLogic from "./GameLogic/GameMaster.js";
import * as GameAI from "./GameLogic/AI.js";


const k_SquareSize = 35;
let m_Size = 8;
let m_TrainerMode = false;
let m_Timer;
let m_GameActive = false;
let m_Game    ;
let m_AI = new GameAI.AI(m_Game);
const m_AIColor = ePawnType.Black;
let m_Modal = document.getElementById('myModal');
let m_ModalText = document.getElementById('myModalText');
let m_Span = document.getElementsByClassName("close")[0];
let m_AnimateButton = function (e) 
{
  e.preventDefault;
  e.target.classList.remove('animate');
  e.target.classList.add('animate');
  setTimeout(function ()
  {
    e.target.classList.remove('animate');
  }, 700);
};

function _nextTurn()
{
  let gameEnd;
  let winner;
  gameEnd = m_Game.nextTurn();
  _updateUIStats();
  winner = m_Game.getWinner(gameEnd);
  _printBoard();
  if (gameEnd)
  {
    _endGameAsWinner(winner);
  }
  else if(m_AIColor === m_Game.PlayerTurnType)
  {
    m_AI.makeAIMove();
    _updateUIStats();
    _printBoard();
    if(m_Game.boardFull())
    {
      let win = m_Game.getWinner(m_Game.boardFull());
      _endGameAsWinner(win);
    }
  }

}

function _updateUIStats()
{
  let player1 = document.getElementById("stats1-container");
  let player2 = document.getElementById("stats2-container");


  document.getElementById("average-player1").innerHTML = `${ m_Game.m_Stats.Player1.average.toFixed(2) }`;
  document.getElementById("average-player2").innerHTML = `${ m_Game.m_Stats.Player2.average.toFixed(2) }`;

  document.getElementById("2pawns-player1").innerHTML = `${ m_Game.m_Stats.Player1.twoPawns }`;
  document.getElementById("2pawns-player2").innerHTML = `${ m_Game.m_Stats.Player2.twoPawns }`;
  document.getElementById("score-player1").innerHTML = `${ m_Game.m_Stats.Player1.score }`;
  document.getElementById("score-player2").innerHTML = `${ m_Game.m_Stats.Player2.score }`;
  document.getElementById("rounds").innerHTML = `${ m_Game.m_Stats.roundsNum }`;
  if (m_Game.PlayerTurnType === ePawnType.Black)
  {
    player2.className = "current-player";
    player1.className = "notcurrent-player";
  }
  else
  {
    player1.className = "current-player";
    player2.className = "notcurrent-player";
  }

}

function onChange_TrainMode()
{
  if (m_TrainerMode === false)
  {
    m_TrainerMode = true;
  }
  else
  {
    m_TrainerMode = false;
  }
}

function _createGameTable()
{
  let table = document.getElementById("myBoard");
  let html = "";

  for (let i = 0; i < m_Size; i++)
  {
    html += "<tr>";
    for (let j = 0; j < m_Size; j++)
    {
      if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1))
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

function _printBoard()
{
  for (let x = 0; x < m_Size; x++)
  {
    for (let y = 0; y < m_Size; y++)
    {
      _updateCellImage(x, y);
    }
  }
}

function _updateCellImage(i, j)
{
  switch (m_Game.Board[i][j].Pawn)
  {
    case ePawnType.White:
      m_Game.Board[i][j].Img.src = ePawnImageSrc.White;
      break;

    case ePawnType.Black:
      m_Game.Board[i][j].Img.src = ePawnImageSrc.Black;
      break;

    case ePawnType.Empty:
      m_Game.Board[i][j].Img.src = ePawnImageSrc.Empty;
      break;

  }

}

function onMouseClick_Cell(i, j)
{
  if (m_GameActive)
  {
    if (m_Game.isValidMove(i, j))
    {
      m_Game.updateMatrixOfPossibilities(i, j);
      m_Game.makeAMove();
      _printBoard();
      _nextTurn();
    }
  }
}

function onMouseLeave_Cell()
{
  if (m_GameActive)
  {
    _printBoard();
  }
}

function _linkBoardToHTML()
{
  for (let i = 0; i < m_Size; i++)
  {
    for (let j = 0; j < m_Size; j++)
    {
      m_Game.Board[i][j].Cell = document.getElementById(`cell[${ i }][${ j }]`);
      m_Game.Board[i][j].Img = document.getElementById(`img[${ i }][${ j }]`);
      m_Game.Board[i][j].Cell.addEventListener('mouseleave', function () { onMouseLeave_Cell(); });
      m_Game.Board[i][j].Cell.addEventListener('mouseenter', function () { onMouseEnter_Cell(i, j); });
      m_Game.Board[i][j].Cell.addEventListener('click', function () { onMouseClick_Cell(i, j); });
    }
  }
}

function _initBoard()
{
  _createGameTable();
  m_Game = new GameLogic.GameMaster(m_Size);
  m_AI = new GameAI.AI(m_Game);
  _linkBoardToHTML();
  _printBoard();
}

function onMouseEnter_Cell(i, j)
{
  if (m_GameActive)
  {
    if (m_Game.isValidMove(i, j))
    {

      m_Game.Board[i][j].Img.src = _getPlayerTurnImage();
      if (m_TrainerMode)
      {
        m_Game.updateMatrixOfPossibilities(i, j);
        for (let x = 0; x < m_Size; x++)
        {
          for (let y = 0; y < m_Size; y++)
          {
            if (m_Game.matrixPossibilities[x][y] !== ePawnType.Empty)
            {
              switch (m_Game.matrixPossibilities[x][y])
              {
                case ePawnType.White:
                  m_Game.Board[x][y].Img.src = ePawnImageSrc.White;
                  break;

                case ePawnType.Black:
                  m_Game.Board[x][y].Img.src = ePawnImageSrc.Black;
                  break;

                case ePawnType.Empty:
                  m_Game.Board[x][y].Img.src = ePawnImageSrc.Empty;
                  break;

              }
            }
          }
        }

      }
    }
  }
}

function _getPlayerTurnImage()
{
  let res = null;
  switch (m_Game.PlayerTurnType)
  {
    case ePawnType.Black:
      res = ePawnImageSrc.Black;
      break;
    case ePawnType.White:
      res = ePawnImageSrc.White;
      break;
  }
  return res;
}

function _erasePrevBoard()
{
  let table = document.getElementById("myBoard");
  table.removeChild(table.childNodes[0]);
}

function onClick_Start()
{
  _startGame();
}

function _startGame() 
{
  _erasePrevBoard();
  _initBoard();
  m_GameActive = true;
  _updateUIStats();
  _startTimer();
  document.getElementById("average-player1").innerHTML = `${ m_Game.m_Stats.Player1.average.toFixed(2) }`;
  document.getElementById("average-player2").innerHTML = `${ m_Game.m_Stats.Player2.average.toFixed(2) }`;
  document.getElementById("stop").disabled = false;

  let temp = new Date();
  if (m_Game.PlayerTurnType === ePawnType.White)
  {
    m_Game.m_Stats.Player1.roundTimePlayer.push(temp.getTime());
  }
  else
  {
    m_Game.m_Stats.Player2.roundTimePlayer.push(temp.getTime());
  }

};

function _startTimer()
{
  // @ts-ignore
  document.getElementById("start").disabled = true;
  let minutesLabel = document.getElementById("minutes");
  let secondsLabel = document.getElementById("seconds");
  let totalSeconds = 0;
  let timer = setInterval(setTime, 1000);
  m_Timer = timer;

  function setTime()
  {
    ++totalSeconds;
    secondsLabel.innerHTML = _pad(totalSeconds % 60);
    // @ts-ignore
    minutesLabel.innerHTML = _pad(parseInt(totalSeconds / 60));
  }
};

function _pad(val)
{
  let valString = val + "";
  let res = "";
  if (valString.length < 2)
  {
    res = "0" + valString;
  }
  else
  {
    res = valString;
  }

  return res;
}

function _endGameAsWinner(winner)
{
  _showWinner(winner);
  _endGame();
  // @ts-ignore
  document.getElementById("stop").disabled = true;
  let table = document.getElementById("myBoard");
  table.className = "game-off";
  m_GameActive = false;

}

function _endGame()
{
  // @ts-ignore
  document.getElementById("start").disabled = false;
  clearInterval(m_Timer);
}

function _modifyBoardSize(size)
{
  m_Size = size;
}

function onClick_Stop()
{
  if (m_Game.PlayerTurnType === ePawnType.White)
  {
    _endGameAsWinner(ePawnType.Black);
  }
  else if (m_Game.PlayerTurnType === ePawnType.Black)
  {
    _endGameAsWinner(ePawnType.White);
  }
}

function _showWinner(winner)
{
  m_Modal.style.display = "block";
  if (winner === ePawnType.Tie)
  {
    m_ModalText.innerHTML = "There is a Tie";
  }
  else
  {
    m_ModalText.innerHTML = `The Winner is: The ${ winner } Player`;
  }
}

function _initBubblyButtons()
{
  let bubblyButtons = document.getElementsByClassName("bubbly-button");

  for (let i = 0; i < bubblyButtons.length; i++) 
  {
    bubblyButtons[i].addEventListener('click', m_AnimateButton, false);
  }
}

function _initListButtons()
{
  let x, i, j, selElement, a, b, c;
  x = document.getElementsByClassName("custom-select");
  for (i = 0; i < x.length; i++) 
  {
    selElement = x[i].getElementsByTagName("select")[0];
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElement.options[selElement.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    b.setAttribute("id", "size-options");


    for (j = 0; j < selElement.length; j++) 
    {
      /*for each option in the original select element,
      create a new DIV that will act as an option item:*/
      c = document.createElement("DIV");
      c.innerHTML = selElement.options[j].innerHTML;
      c.id = selElement.options[j].value;
      c.addEventListener("click", function (e) 
      {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        let y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        _modifyBoardSize(this.id);
        for (i = 0; i < s.length; i++) 
        {
          if (s.options[i].innerHTML == this.innerHTML) 
          {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++)
            {
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
    a.addEventListener("click", function (e) 
    {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      _closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }

}

function onClick_Document(i_Element)
{
  _closeAllSelect(i_Element);
}

function _closeAllSelect(i_Element) 
{
  let x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++)
  {
    if (i_Element == y[i])
    {
      arrNo.push(i)
    }
    else 
    {
      y[i].classList.remove("select-arrow-active");
    }
  }

  for (i = 0; i < x.length; i++) 
  {
    if (arrNo.indexOf(i)) 
    {
      x[i].classList.add("select-hide");
    }
  }
}

function Run()
{
  _initBoard();
  document.getElementById('trainer').onchange = function () { onChange_TrainMode(); };
  document.getElementById('start').onclick = function () { onClick_Start(); };
  document.getElementById('stop').onclick = function () { onClick_Stop(); };
  m_Span.onclick = function () { m_Modal.style.display = "none"; };
  window.onclick = function (event) { if (event.target == m_Modal) { m_Modal.style.display = "none"; } };
  _initBubblyButtons();
  _initListButtons();
  document.addEventListener("click", onClick_Document);
}

Run();