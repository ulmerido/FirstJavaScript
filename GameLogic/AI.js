import { ePawnType } from "../Enums/ePawnType.js";
import * as GameLogic from "./GameMaster.js";

const corner = 999;
const aroundCorner = -64;
const edge = 32
const inner = -32;
const k_Inifinity = 99999;


let col1 = [corner, aroundCorner, edge, edge, edge, edge, aroundCorner, corner];
let col2 = [aroundCorner, aroundCorner, inner, inner, inner, inner, aroundCorner, aroundCorner];
let col3 = [edge, inner, inner, inner, inner, inner, inner, edge];
let col4 = [edge, inner, inner, inner, inner, inner, inner, edge];
let ratingMatrix = new Array(8);
ratingMatrix[0] = col1;
ratingMatrix[1] = col2;
ratingMatrix[2] = col3;
ratingMatrix[3] = col4;
ratingMatrix[4] = col4;
ratingMatrix[5] = col3;
ratingMatrix[6] = col2;
ratingMatrix[7] = col1;
let gDepth = 4;

export class AI
{

    constructor(i_Game)
    {
        this.game = i_Game;     
    }

    _setDepth()
    {
        switch (this.game.k_Size)
        {
            case 6:
                gDepth = 5;
                break;
            case 8:
                gDepth = 4;
                break;
            case 10:
                gDepth = 2;
                break;
            case 12:
                gDepth = 1;
                break;
            case 14:
                gDepth = 1;
                break;
            case 16:
                gDepth = 1;
                break;
        }
    }

    makeAIMove()
    {
        console.log("makeAIMove>>");
        let maxVal = -k_Inifinity;
        let minMaxVal;
        let saveX = -1, saveY = -1;
        let savedGame = this._saveGame();
        this._setDepth();
        for (let x = 0; x < this.game.k_Size; x++)
        {
            for (let y = 0; y < this.game.k_Size; y++)
            {
                if (this.game.isValidMove(x, y))
                {
                    this.doAPossibileMove(x, y);
                    minMaxVal = this.miniMax(x, y, gDepth, false, -k_Inifinity, k_Inifinity);
                    if (minMaxVal > maxVal)
                    {
                        maxVal = minMaxVal;
                        saveX = x;
                        saveY = y;
                    }

                    this._restoreGame(savedGame);
                }
            }
        }

        if (saveX !== -1)
        {
            console.log(`Moved[${ saveX } , ${ saveY }]`);
            console.log(`Max Value${ maxVal }`);
            this.game.updateMatrixOfPossibilities(saveX, saveY);
            this.game.makeAMove(saveX, saveY);
            this.game.nextTurn();
        }
        else
        {
            console.log("NO VALIED MOVES");
        }

        console.log("makeAIMove<<");
    }

    miniMax(i, j, depth, wantMax, alpha, beta)
    {
        let res = 0;
        let dif;
        let endGame = this.game.boardFull();
        if (depth === 0 || endGame)
        {
            dif = this.game.m_Stats.Player2.score - this.game.m_Stats.Player1.score;
            if (this.game.k_Size == 8)
            {
                res = this.game.m_Stats.Player2.StrategyScore - this.game.m_Stats.Player1.StrategyScore;
            }
            else
            {
                res = dif;
            }

            if (endGame)
            {
                if (dif > 0)
                {
                    res = k_Inifinity - 1;
                }
                else
                {
                    res = -k_Inifinity + 1;
                }
            }
        }
        else 
        {
            if (wantMax)
            {
                res = this.doMax(depth, alpha, beta);
            }
            else
            {
                res = this.doMin(depth, alpha, beta);
            }
        }

        return res;
    }

    doMin(depth, alpha, beta)
    {
        let savedGame = this._saveGame();
        let MinEval = k_Inifinity;
        let sonValue, res = 0;
        for (let x = 0; x < this.game.k_Size; x++)
        {
            for (let y = 0; y < this.game.k_Size; y++)
            {
                if (this.game.isValidMove(x, y))
                {
                    this.doAPossibileMove(x, y);
                    sonValue = this.miniMax(x, y, depth - 1, true, alpha, beta);
                    res = Math.min(MinEval, sonValue);
                    this._restoreGame(savedGame);
                    beta = Math.min(beta, sonValue);
                    if (beta <= alpha)
                    {
                        break;
                    }
                }
            }
        }

        return res;
    }

    doMax(depth, alpha, beta)
    {
        let savedGame = this._saveGame();
        let MaxVal = -k_Inifinity;
        let sonValue, res = 0;
        for (let x = 0; x < this.game.k_Size; x++)
        {
            for (let y = 0; y < this.game.k_Size; y++)
            {
                if (this.game.isValidMove(x, y))
                {
                    this.doAPossibileMove(x, y);
                    sonValue = this.miniMax(x, y, depth - 1, false, alpha, beta);
                    res = Math.max(MaxVal, sonValue);
                    alpha = Math.max(alpha, sonValue);
                    this._restoreGame(savedGame);
                    if (beta <= alpha)
                    {
                        break;
                    }
                }
            }
        }

        return res;
    }

    doAPossibileMove(x, y)
    {
        this.game.updateMatrixOfPossibilities(x, y);
        this.game.makeAMove(x, y);
        this.game._swapTurns();
        this.game._updateScore();
    }

    _saveGame()
    {
        let savedGame =
        {
            board: new Array(this.game.k_Size),
            playerTurn: this.game.PlayerTurnType,
            score1: this.game.m_Stats.Player1.score,
            score2: this.game.m_Stats.Player2.score,
            StrategyScore1: this.game.m_Stats.Player1.StrategyScore,
            StrategyScore2: this.game.m_Stats.Player2.StrategyScore,
        }

        for (let x = 0; x < this.game.k_Size; x++)
        {
            savedGame.board[x] = new Array(this.game.k_Size);
            for (let y = 0; y < this.game.k_Size; y++)
            {
                savedGame.board[x][y] = this.game.Board[x][y].Pawn;
            }
        }

        return savedGame;
    }

    _restoreGame(savedGame)
    {
        for (let x = 0; x < this.game.k_Size; x++)
        {
            for (let y = 0; y < this.game.k_Size; y++)
            {
                this.game.Board[x][y].Pawn = savedGame.board[x][y];
            }
        }

        this.game.PlayerTurnType = savedGame.playerTurn;
        this.game.m_Stats.Player1.score = savedGame.score1;
        this.game.m_Stats.Player2.score = savedGame.score2;
        this.game.m_Stats.Player1.StrategyScore = savedGame.StrategyScore1;
        this.game.m_Stats.Player2.StrategyScore = savedGame.StrategyScore2;
    }

}