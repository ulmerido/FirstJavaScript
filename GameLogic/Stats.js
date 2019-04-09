import * as Module from "./Player.js";

export class Stats 
{
    constructor()
    {
        this.Player1 = new Module.Player();
        this.Player2 = new Module.Player();
        this.roundsNum = 0;
    }

    initStats()
    {
        stats.Player1.average = 0;
        stats.Player2.average = 0;
        stats.roundsNum = 0;
        stats.Player1.score = 2;
        stats.Player2.score = 2;
        stats.Player1.twoPawns = 1;
        stats.Player2.twoPawns = 1;
        stats.Player1.roundTimePlayer = [];
        stats.Player2.roundTimePlayer = [];
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
    }

}