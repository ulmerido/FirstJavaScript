import { ePawnType } from "../Enums/ePawnType.js";
import * as Module from "./Stats.js";




export class GameMaster
{
    constructor(i_Size)
    {
        this.k_Size = i_Size;
        this.Board;
        this._createGameBoard();
        this.m_Stats = new Module.Stats();
        this._initBoardPawns()
        this.PlayerTurnType = ePawnType.White;
        this.matrixPossibilities = [];
    };

    nextTurn()
    {
        let noMoreMoves;
        this._updateStats();
        this._updateAverageTime();
        this._updateRounds();
        noMoreMoves = this._updateScore();
        this._update2Pawns();
        this._swapTurns();
        return noMoreMoves;
    };

    isValidMove(i, j)
    {

        let x, y;
        let valid = false;
        if (this.Board[i][j].Pawn === ePawnType.Empty)
        {
            for (x = -1; x < 2; x++)
            {
                for (y = -1; y < 2; y++)
                {
                    if (((i + x >= 0) && (j + y >= 0)) && (i + x < this.k_Size) && (j + y < this.k_Size))
                    {
                        if (this.Board[i + x][j + y].Pawn !== ePawnType.Empty && (x !== 0 || y !== 0))
                        {
                            valid = true;
                            break;
                        }
                    }
                }
            }
        }
       
        return valid;
    };

    getWinner(i_GameEnd)
    {
        let winner = null;

        if (i_GameEnd)
        {
            if (this.m_Stats.Player1.score > this.m_Stats.Player2.score)
            {
                winner = ePawnType.White;
            }
            else if (this.m_Stats.Player1.score < this.m_Stats.Player2.score)
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
            if (this.m_Stats.Player1.score === 0)
            {
                winner = ePawnType.Black;
            }
            else if (this.m_Stats.Player2.score === 0)
            {
                winner = ePawnType.White;
            }
        }

        return winner;
    };

    _swapTurns()
    {
        if (this.PlayerTurnType === ePawnType.White)
        {
            this.PlayerTurnType = ePawnType.Black;
        }
        else
        {
            this.PlayerTurnType = ePawnType.White;
        }
    };

    _update2Pawns()
    {
        if (this.m_Stats.Player1.score === 2)
        {
            this.m_Stats.Player1.twoPawns++;
        }
        if (this.m_Stats.Player2.score === 2)
        {
            this.m_Stats.Player2.twoPawns++;
        }
    };

    _updateRounds()
    {
        this.m_Stats.roundsNum++;
    };

    _updateAverageTime()
    {
        let sum = 0;
        if (this.PlayerTurnType === ePawnType.White)
        {
            this.m_Stats.Player1.roundTimePlayer.forEach((timeSlot) => { sum += timeSlot; });
            this.m_Stats.Player1.average = sum / this.m_Stats.Player1.roundTimePlayer.length;
        }
        else
        {
            this.m_Stats.Player2.roundTimePlayer.forEach((timeSlot) => { sum += timeSlot; });
            this.m_Stats.Player2.average = sum / this.m_Stats.Player2.roundTimePlayer.length;
        }
    };

    _updateStats()
    {
        let time = new Date();

        if (this.PlayerTurnType == ePawnType.White)
        {
            let temp = time.getTime() - this.m_Stats.Player1.roundTimePlayer.pop();
            this.m_Stats.Player1.roundTimePlayer.push(temp / 1000);
            this.m_Stats.Player2.roundTimePlayer.push(time.getTime());
        }

        if (this.PlayerTurnType == ePawnType.Black)
        {
            let temp = time.getTime() - this.m_Stats.Player2.roundTimePlayer.pop();
            this.m_Stats.Player2.roundTimePlayer.push(temp / 1000);
            this.m_Stats.Player1.roundTimePlayer.push(time.getTime());
        }
    };

    _updateScore()
    {
        let counter1 = 0;
        let counter2 = 0;
        let full = true;

        for (let i = 0; i < this.k_Size; i++)
        {
            for (let j = 0; j < this.k_Size; j++)
            {
                if (this.Board[i][j].Pawn === ePawnType.Black)
                {
                    counter2++;
                }
                if (this.Board[i][j].Pawn === ePawnType.White)
                {
                    counter1++;
                }
                if (this.Board[i][j].Pawn === ePawnType.Empty)
                {
                    full = false;
                }
            }
        }

        this.m_Stats.Player1.score = counter1;
        this.m_Stats.Player2.score = counter2;

        return full;
    };

    _createGameBoard()
    {
        this.Board = new Array(this.k_Size);
        for (let i = 0; i < this.k_Size; i++)
        {
            this.Board[i] = new Array(this.k_Size);
            for (let j = 0; j < this.k_Size; j++)
            {
                this.Board[i][j] = { Cell: null, Pawn: null, Img: null };
                this.Board[i][j].Pawn = ePawnType.Empty;
            }
        }
    };

    _initBoardPawns()
    {
        let mid = this.k_Size / 2;
        this.Board[mid - 1][mid - 1].Pawn = ePawnType.Black;
        this.Board[mid][mid].Pawn = ePawnType.Black;
        this.Board[mid - 1][mid].Pawn = ePawnType.White;
        this.Board[mid][mid - 1].Pawn = ePawnType.White;
    };

    updateMatrixOfPossibilities(i, j)
    {
        let x, y;
        this.matrixPossibilities = Array(this.k_Size);
        for (x = 0; x < this.k_Size; x++)
        {
            this.matrixPossibilities[x] = Array(this.k_Size);
            for (y = 0; y < this.k_Size; y++)
            {
                this.matrixPossibilities[x][y] = this.Board[x][y].Pawn;
            }
        }

        for (x = -1; x < 2; x++)
        {
            for (y = -1; y < 2; y++)
            {
                if (x !== 0 || y !== 0)
                {
                    this._addPoss(x, y, i, j);
                }
            }
        }
        this.matrixPossibilities[i][j] = this.PlayerTurnType;
    };
    
    makeAMove()
    {
        for (let i = 0; i < this.k_Size; i++)
        {
            for (let j = 0; j < this.k_Size; j++)
            {
                if (this.matrixPossibilities[i][j] !== ePawnType.Empty)
                {
                    this.Board[i][j].Pawn = this.matrixPossibilities[i][j];
                }
            }
        }
    };

    _inBoundaries(x, y)
    {
        return (x >= 0) && (y >= 0) && (x < this.k_Size) && (y < this.k_Size);
    };

    _addPoss(colAdd, rowAdd, i, j)
    {
        let x = i;
        let y = j;
        let foundPawn = false;

        while (this._inBoundaries(x, y))
        {
            if (this.Board[x][y].Pawn === this.PlayerTurnType)
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
            while (this._inBoundaries(x, y))
            {

                if (this.Board[x][y].Pawn === this.PlayerTurnType)
                {
                    break;
                }
                else
                {
                    this.matrixPossibilities[x][y] = this.PlayerTurnType;
                }
                y += colAdd;
                x += rowAdd;
            }
        }
        else
        {

        }
    };
}