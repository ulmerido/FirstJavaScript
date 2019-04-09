import { ePawnType } from "../Enums/ePawnType.js";
import * as GameLogic from "./GameMaster.js";

const corner = 16;
const aroundCorner = -3;
const edge = 2
const inner = 0;
const size = 8;

let row1 = [16.16, -3.03, 0.99, 0.43, 0.43, 0.99, -3.03, 16.16];
let row2 = [-4.12, -1.81, -0.08, -0.27, -0.27, -0.08, -1.81, -4.12];
let row3 = [1.33, -0.04, 0.51, 0.07, 0.07, 0.51, -0.04, 1.33];
let row4 = [0.63, -0.18, -0.04, -0.04, -0.01, -0.04, -0.18, 0.63];
let ratingMatrix = new Array(8);
ratingMatrix[0] = row1;
ratingMatrix[1] = row2;
ratingMatrix[2] = row3;
ratingMatrix[3] = row4;
ratingMatrix[4] = row4;
ratingMatrix[5] = row3;
ratingMatrix[6] = row2;
ratingMatrix[7] = row1;


export class AI
{

    constructor(i_Game)
    {
        this.game = i_Game
    }
    
    makeAIMove(i_Game)
    {
        this.game = i_Game;
        console.log("makeAIMove>>");
        let MaxEval = -999999;
        let sonValue;
        let saveX, saveY;
        let savedGame = this._saveGame();

        for (let x = 0; x < this.game.k_Size; x++)
        {
            for (let y = 0; y < this.game.k_Size; y++)
            {
                console.log(`[x,y]  ${ x } ? ${ y }`);
                if (this.game.isValidMove(x, y))
                {
                    console.log(`valied`);
                    console.log(this.game);
                    this.game.updateMatrixOfPossibilities(x, y);
                    this.game.makeAMove(x, y);
                    this.game._swapTurns();
                    sonValue = this.calcMinMax(x, y, 0, true);
                    if (sonValue > MaxEval)
                    {
                        MaxEval = sonValue;
                        saveX = x,
                        saveY = y;
                    }
                    console.log(this.game);
                    console.log(`new Max Value ${ sonValue }`);
                    this._restoreGame(savedGame);
                    console.log(this.game);

                }
                else
                {
                    console.log(`not Valied`);
                }
            }
        }
        console.log(`[x,y]  ${ saveX } ? ${ saveY }`);
        this.game.updateMatrixOfPossibilities(saveX, saveY);
        this.game.makeAMove(saveX, saveY);
        this.game.nextTurn();
        console.log("makeAIMove<<");

    }

    calcMinMax(i, j, depth, isMaximizing)
    {
        console.log("calcMinMax>>");
        let res = 0;
        if (depth === 0)
        {
            res = ratingMatrix[i][j];
            console.log(` [${ i }] [${ j }] = ${ res }`);
        }
        else 
        {
            res = _checkMoves(isMaximizing);
        }

        console.log("calcMinMax<<");
        return res;
    }

    _checkMoves(isMaximizing)
    {
        let savedGame = this._saveGame();
        let MaxEval = -999999;
        let MinEval = 999999;
        for (let x = 0; x < this.game.k_Size; x++)
        {
            for (let y = 0; y < this.game.k_Size; y++)
            {
                if (this.game.isValidMove(x, y))
                {
                   
                    this.game.updateMatrixOfPossibilities(x, y);
                    this.game.makeAMove(x, y);
                    this.game._swapTurns();
                    sonValue = this.calcMinMax(x, y, depth - 1, !isMaximizing);
                    if(isMaximizing)
                    {
                    res = Math.min(MaxEval, sonValue);
                    }
                    else
                    {
                        res = Math.min(MinEval,sonValue);
                    }
                    this._restoreGame(savedGame);
                    console.log(this.game);
                    console.log(`checkMoves<< ${ res } ? ${ sonValue }`);
                }
            }
        }

        return res;
    }

    _saveGame()
    {
        let savedGame =
        {
            board: new Array(this.game.k_Size),
            playerTurn: this.game.PlayerTurnType,
        }

        for (let x = 0; x < this.game.k_Size; x++)
        {
            savedGame.board[x] = new Array(this.game.k_Size);
            for (let y = 0; y < this.game.k_Size; y++)
            {
                savedGame.board[x][y] = this.game.Board[x][y].Pawn;
            }
        }
        
        console.log(savedGame);

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
    }

}