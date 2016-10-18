var Game_Over = {

    preload : function() {
        game.load.image('gameover', './assets/images/gameover.png');
    },

    create : function() {

        // creates a button that is similar to the one we made on menu that when clicked will start the game.
        this.add.button(0, 0, 'gameover', this.startGame, this);

        // displays the last score info.
        // tostring converts the number into a string to display.
        game.add.text(235, 350, "LAST SCORE", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center"});
        game.add.text(350, 348, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });

    },

    startGame: function () {

        // changes state from game_over to game.
        this.state.start('Game');

    }

};