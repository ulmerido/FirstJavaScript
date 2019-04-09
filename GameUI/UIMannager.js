//  @ts-check

const ePawnImageSrc =
{
    Black: "piece-1.gif",
    White: "piece-2.gif",
    Empty: "piece-0.gif",
};

import { ePawnType } from "../Enums/ePawnType.js";
import * as GameStats from "../GameLogic/GameMaster.js";
export class UIMannager
{
    constructor()
    {
        this.k_SquareSize = 35;
        this.m_Size = 8;
        this.m_TrainerMode = false;
        this.m_Timer = null;
        this.m_GameActive = false;
        this.m_Game = new GameStats.Game(this.m_Size);
        this.modal = document.getElementById('myModal');
        this.modalText = document.getElementById('myModalText');
        this.span = document.getElementsByClassName("close")[0];
        this.animateButton = function (e) 
        {
            e.preventDefault;
            e.target.classList.remove('animate');
            e.target.classList.add('animate');
            setTimeout(function ()
            {
                e.target.classList.remove('animate');
            }, 700);
        };
    }

    _nextTurn()
    {
        let gameEnd;
        let winner;
        gameEnd = this.m_Game.nextTurn();
        this._updateUIStats();
        winner = this.m_Game.getWinner(gameEnd);
        if (winner)
        {
            this.endGameAsWinner(winner);
        }
    }

    _updateUIStats()
    {
        let player1 = document.getElementById("stats1-container");
        let player2 = document.getElementById("stats2-container");

        document.getElementById("average-player1").innerHTML = `${ this.m_Game.m_Stats.Player1.average.toFixed(2) }`;
        document.getElementById("average-player2").innerHTML = `${ this.m_Game.m_Stats.Player2.average.toFixed(2) }`;

        document.getElementById("2pawns-player1").innerHTML = `${ this.m_Game.m_Stats.Player1.twoPawns }`;
        document.getElementById("2pawns-player2").innerHTML = `${ this.m_Game.m_Stats.Player2.twoPawns }`;
        document.getElementById("score-player1").innerHTML = `${ this.m_Game.m_Stats.Player1.score }`;
        document.getElementById("score-player2").innerHTML = `${ this.m_Game.m_Stats.Player2.score }`;
        document.getElementById("rounds").innerHTML = `${ this.m_Game.m_Stats.roundsNum }`;
        if (this.m_Game.PlayerTurnType === ePawnType.Black)
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

    onChange_Train()
    {
        if (this.m_TrainerMode === false)
        {
            this.m_TrainerMode = true;
        }
        else
        {
            this.m_TrainerMode = false;
        }
    }

    _createGameTable()
    {
        let table = document.getElementById("myBoard");
        let html = "";

        for (let i = 0; i < this.m_Size; i++)
        {
            html += "<tr>";
            for (let j = 0; j < this.m_Size; j++)
            {
                if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1))
                {
                    html += `<td id=cell[${ j }][${ i }]><img id=img[${ j }][${ i }] class="dark" src="piece-0.gif" border=0 width=${this.k_SquareSize  } height=${ this.k_SquareSize }></img></td>`;
                }

                else
                {
                    html += `<td id=cell[${ j }][${ i }]><img id=img[${ j }][${ i }] class="light" src="piece-0.gif" border=0 width=${ this.k_SquareSize } height=${ this.k_SquareSize }></img></td>`;
                }
            }

            html += "</tr>";
        }

        table.insertAdjacentHTML("afterbegin", html);
    }

    _printBoard()
    {
        for (let x = 0; x < this.m_Size; x++)
        {
            for (let y = 0; y < this.m_Size; y++)
            {
                this._updateCellImage(x, y);
            }
        }
    }

    _updateCellImage(i, j)
    {
        switch (this.m_Game.Board[i][j].Pawn)
        {
            case ePawnType.White:
            this.m_Game.Board[i][j].Img.src = ePawnImageSrc.White;
                break;

            case ePawnType.Black:
            this.m_Game.Board[i][j].Img.src = ePawnImageSrc.Black;
                break;

            case ePawnType.Empty:
            this.m_Game.Board[i][j].Img.src = ePawnImageSrc.Empty;
                break;

        }

    }

    onMouseClick_Cell(i, j)
    {
        if (this.m_GameActive)
        {
            if (this.m_Game.isValidMove(i, j))
            {
                console.log(">> validMove");
                //findCells(i, j);
                this.m_Game.updateMatrixOfPossibilities(i, j);
                this.m_Game.makeAMove();
                this._printBoard();
                this._nextTurn();
                console.log("<< validMove");
            }
        }
    }

    onMouseLeave_Cell()
    {
        if (this.m_GameActive)
        {
            this._printBoard();
        }
    }

    _linkBoardToHTML()
    {
        for (let i = 0; i < this.m_Size; i++)
        {
            for (let j = 0; j < this.m_Size; j++)
            {
                this.m_Game.Board[i][j].Cell = document.getElementById(`cell[${ i }][${ j }]`);
                this.m_Game.Board[i][j].Img = document.getElementById(`img[${ i }][${ j }]`);
                this.m_Game.Board[i][j].Cell.addEventListener('mouseleave', function () { this.onMouseLeave_Cell(); });
                this.m_Game.Board[i][j].Cell.addEventListener('mouseenter', function () { this.onMouseEnter_Cell(i, j); });
                this.m_Game.Board[i][j].Cell.addEventListener('click', function () { this.onMouseClick_Cell(i, j); });
            }
        }
    }

    _initBoard()
    {
        this._createGameTable();
        this.m_Game = new GameStats.Game(this.m_Size);
        this._linkBoardToHTML();
        this._printBoard();
    }

    onMouseEnter_Cell(i, j)
    {
        if (this.m_GameActive)
        {
            if (this.m_Game.isValidMove(i, j))
            {

                this.m_Game.Board[i][j].Img.src = this._getPlayerTurnImage();
                if (this.m_TrainerMode)
                {
                    this.m_Game.updateMatrixOfPossibilities(i, j);
                    for (let x = 0; x < this.m_Size; x++)
                    {
                        for (let y = 0; y < this.m_Size; y++)
                        {
                            if (this.m_Game.matrixPossibilities[x][y] !== ePawnType.Empty)
                            {
                                switch (this.m_Game.matrixPossibilities[x][y])
                                {
                                    case ePawnType.White:
                                    this.m_Game.Board[x][y].Img.src = ePawnImageSrc.White;
                                        break;

                                    case ePawnType.Black:
                                    this.m_Game.Board[x][y].Img.src = ePawnImageSrc.Black;
                                        break;

                                    case ePawnType.Empty:
                                    this.m_Game.Board[x][y].Img.src = ePawnImageSrc.Empty;
                                        break;

                                }
                            }
                        }
                    }

                }
            }
        }
    }

    _getPlayerTurnImage()
    {
        let res = null;
        switch (this.m_Game.PlayerTurnType)
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

    _erasePrevBoard()
    {
        let table = document.getElementById("myBoard");
        table.removeChild(table.childNodes[0]);
    }

    onClick_Start()
    {
        this._startGame();
    }

    _startGame() 
    {
        this._erasePrevBoard();
        this._initBoard();
        this.m_GameActive = true;
        this._updateUIStats();
        this._startTimer();
        document.getElementById("average-player1").innerHTML = `${ this.m_Game.m_Stats.Player1.average.toFixed(2) }`;
        document.getElementById("average-player2").innerHTML = `${ this.m_Game.m_Stats.Player2.average.toFixed(2) }`;
        document.getElementById("stop").disabled = false;

        let temp = new Date();
        if (this.m_Game.PlayerTurnType === ePawnType.White)
        {
            this.m_Game.m_Stats.Player1.roundTimePlayer.push(temp.getTime());
        }
        else
        {
            this.m_Game.m_Stats.Player2.roundTimePlayer.push(temp.getTime());
        }

    }

    _startTimer()
    {
        // @ts-ignore
        document.getElementById("start").disabled = true;
        let minutesLabel = document.getElementById("minutes");
        let secondsLabel = document.getElementById("seconds");
        let totalSeconds = 0;
        let timer = setInterval(setTime, 1000);
        this.m_Timer = timer;

        function setTime()
        {
            ++totalSeconds;
            secondsLabel.innerHTML = this._pad(totalSeconds % 60);
            // @ts-ignore
            minutesLabel.innerHTML = _pad(parseInt(totalSeconds / 60));
        }
    };

    _pad(val)
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

    endGameAsWinner(winner)
    {
        this._showWinner(winner);


        this.endGame();
        // @ts-ignore
        document.getElementById("stop").disabled = true;
        let table = document.getElementById("myBoard");
        table.className = "game-off";
        this.m_GameActive = false;

    }

    endGame()
    {
        // @ts-ignore
        document.getElementById("start").disabled = false;
        clearInterval(this.m_Timer);
    }

    modifyBoardSize(size)
    {
        this.m_Size = size;
    }

    _technicalVictory()
    {
        if (this.m_Game.PlayerTurnType === ePawnType.White)
        {
            this.endGameAsWinner(ePawnType.Black);
        }
        else if (this.m_Game.PlayerTurnType === ePawnType.Black)
        {
            this.endGameAsWinner(ePawnType.White);
        }
    }

    _showWinner(winner)
    {
        this.modal.style.display = "block";
        if (winner === ePawnType.Tie)
        {
            this.modalText.innerHTML = "There is a Tie";
        }
        else
        {
            this.modalText.innerHTML = `The Winner is: The ${ winner } Player`;
        }
    }

    _initBubblyButtons()
    {
        let bubblyButtons = document.getElementsByClassName("bubbly-button");

        for (let i = 0; i < bubblyButtons.length; i++) 
        {
            bubblyButtons[i].addEventListener('click', this.animateButton, false);
        }
    }

    _initListButtons()
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
                    this.modifyBoardSize(this.id);
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
                this._closeAllSelect(this);
                this.nextSibling.classList.toggle("select-hide");
                this.classList.toggle("select-arrow-active");
            });
        }

    }

    onClick_Document(i_Element)
    {
        this._closeAllSelect(i_Element);
    }

    _closeAllSelect(i_Element)
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

    RunGame()
    {
        let stopFunc = this._technicalVictory;
        let startFunc = this.onClick_Start;
        let trainFunc = this.onChange_Train;
        let mod = this.modal;

        this._initBoard();
        console.log(this.m_Game);
        document.getElementById('trainer').onchange = function () { trainFunc(); };
        document.getElementById('start').onclick = function () { startFunc(); };
        document.getElementById('stop').onclick = function () { stopFunc(); };
        this.span.onclick = function () { mod.style.display = "none"; };
        window.onclick = function (event) { if (event.target == mod) { mod.style.display = "none"; } };
        this._initBubblyButtons();
        this._initListButtons();
        document.addEventListener("click", this.onClick_Document);
    }
}