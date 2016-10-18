var snake, apple, apple2, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

var Game = {

    preload : function() {
        // loads the snake and the apple image to be used in this level.
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
        game.load.image('apple2', './assets/images/apple.png');
    },

    create : function() {

        snake = [];                     // works as a stack that contains parts of our snake.
        apple = {};                     // object for apple.
        apple2 = {};
        squareSize = 15;                // length of our square size which is 15x15.
        score = 0;                      // score.
        speed = 0;                      // speed.
        updateDelay = 0;                // variable to control our update rates.
        direction = 'right';            // default direction of the snake.
        new_direction = null;           // buffer to store informationo on new direction once the button has been pressed.
        addNew = false;                 // variable used when apple is eaten.

        // sets up a phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#061f27';

        // for loo pthat generates the initial snake stack. default snake will be 10 squares long.
        for(var i = 0; i < 10; i++){
            snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake');  // parameters are (x coordinate, y coordinate, image)
        }


        // generates the first apple.
        this.generateApple();

        this.generateApple2();

        // creates stylings for the text to use so we don't have to type otu the whole thing again.
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        // score text.
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // speed text.
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

    },

    update: function() {

        // handles when arrow key are pressed.
        // makes sure that the direction change is legal and will not kill the player.

        if (cursors.right.isDown && direction!='left')
        {
            new_direction = 'right';
        }
        else if (cursors.left.isDown && direction!='right')
        {
            new_direction = 'left';
        }
        else if (cursors.up.isDown && direction!='down')
        {
            new_direction = 'up';
        }
        else if (cursors.down.isDown && direction!='up')
        {
            new_direction = 'down';
        }

        // formula to calculate game speed based on the score then update it.
        // higher the score is the higher the game speed will be.
        // max speed of 10.
        speed = Math.min(10, Math.floor(score/5));
        // updates speed value on screen.   
        speedTextValue.text = '' + speed;

        // the default update function of phaser has an update rate of around 60 fps.
        // we need to slow that down to make the game playable.

        // increases a counter on every update call.
        updateDelay++;

        // the higher the speed, the more frequently this is fulfilled.
        // making the snake move faster.
        if (updateDelay % (10 - speed) == 0) {


            // snake movement

            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // if a new direction has been chosen from the keyboard, make it the direction of the snake now.
            if(new_direction){
                direction = new_direction;
                new_direction = null;
            }


            // change the last cell's coordinates relative to the head of the snake, according to the direction.

            if(direction == 'right'){

                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'left'){
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if(direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }


            // places the last cell in the front of the stack.
            // mark it as the first cell.

            snake.push(lastCell);
            firstCell = lastCell;

            // end of snake movement.



            // increases length of snake it eats an apple.
            // creates a new block at the back of the snake.
            if(addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // checks for apple collision.
            this.appleCollision();

            this.appleCollision2();

            // checks for collision with self. parameter is the head of the snake.
            this.selfCollision(firstCell);

            // checks with collision with wall. parameter is the head of the snake.
            this.wallCollision(firstCell);
        }


    },

    generateApple: function(){

        // choses a random place on the grid.
        // x is between 0 and 585 (39*15)
        // y is between 0 and 435 (29*15)

        var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;

        // adds a new apple.
        apple = game.add.sprite(randomX, randomY, 'apple');
    },

    generateApple2: function(){

        // choses a random place on the grid.
        // x is between 0 and 585 (39*15)
        // y is between 0 and 435 (29*15)

        var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;

        // adds a new apple.
        apple2 = game.add.sprite(randomX, randomY, 'apple2');
    },

    appleCollision: function() {

        // checks if any part of the snake is overlapping the apple.
        // this is needed just in case if the apple spawns inside of the snake.
        for(var i = 0; i < snake.length; i++){
            if(snake[i].x == apple.x && snake[i].y == apple.y){

                // next time the snake moves, a new block will be added to its length.
                addNew = true;

                // destroys the old apple.
                apple.destroy();

                // makes a new one.
                this.generateApple();

                // increases score.
                score++;

                // refreshes scoreboard.
                scoreTextValue.text = score.toString();

            }
        }

    },

    appleCollision2: function() {

        // checks if any part of the snake is overlapping the apple.
        // this is needed just in case if the apple spawns inside of the snake.
        for(var i = 0; i < snake.length; i++){
            if(snake[i].x == apple2.x && snake[i].y == apple2.y){

                // next time the snake moves, a new block will be added to its length.
                addNew = true;

                // destroys the old apple.
                apple2.destroy();

                // makes a new one.
                this.generateApple2();

                // increases score.
                score++;

                // refreshes scoreboard.
                scoreTextValue.text = score.toString();

            }
        }

    },

    selfCollision: function(head) {

        // checks to see if the head of the snake overlaps with any part of the snake.
        for(var i = 0; i < snake.length - 1; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){

                // if it does that means death, so it goes to the game over screen.
                game.state.start('Game_Over');
            }
        }

    },

    wallCollision: function(head) {

        // checks to see if the head of the snake overlaps with any part of the wall.

        if(head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0){


            // if it is out of the boundaries that means death, so it goes to the game over screen.
            game.state.start('Game_Over');
        }

    }

};