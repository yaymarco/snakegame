var Menu = {

    preload : function() {
        // will load all the resources needed for this game.
        game.load.image('menu', './assets/images/menu.png');
    },

    create: function () {

        // adds menu screen.
        // adds a button that when clicked will start the game. the button is basically the entire game.
        this.add.button(0, 0, 'menu', this.startGame, this);

    },

    startGame: function () {

        // changes the state from menu to game.
        this.state.start('Game');

    }

};