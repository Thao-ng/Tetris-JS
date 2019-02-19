document.addEventListener("DOMContentLoaded", function (event) {

    const cvs = document.getElementById("tetris");
    const ctx = cvs.getContext("2d");


    const ROW = 20;
    const COL = COLUMN = 10;
    const SQ = squareSize = 20;
    const VACANT = "white"; // color of an empty square

// draw a square
    function drawSquare(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

        ctx.strokeStyle = "black";
        ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }

// create the board

    let board = [];
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }

// draw the board
    function drawBoard() {
        for (r = 0; r < ROW; r++) {
            for (c = 0; c < COL; c++) {
                drawSquare(c, r, board[r][c]);
            }
        }
    }

    drawBoard();

// the pieces and their colors

    const PIECES = [
        ["Z","red"],
        ["S","green"],
        ["T","yellow"],
        ["O","blue"],
        ["L","purple"],
        ["I","cyan"],
        ["J","orange"]
    ];

// generate random pieces
    function randomPiece(){
        let r = randomN = Math.floor(Math.random() * PIECES.length) // returning numbers beetween  0 -> 6
       
        return new Piece(PIECES[r][0], PIECES[r][1]);

    }



    let p = randomPiece();

// The Object Piece

    function Piece(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;

        this.tetrominoN = 0; // we start from the first pattern
        this.activeTetromino = this.tetromino[this.tetrominoN];

        // we need to control the pieces
        this.x = -2;
        this.y = 3;
    }


//fill function
    Piece.prototype.fill =function(color) {
        for (r = 0; r < this.activeTetromino.length; r++) {
            board[r] = [];
            for (c = 0; c < this.activeTetromino.length; c++) {

                //draw only occupied squares
                if (this.activeTetromino[r][c]){
                    drawSquare(this.x + c, this.y + r, color)
                }
            }
        }
    }
//draw a piece to the board

    Piece.prototype.draw =function() {
        this.fill(this.color);
    }

    p.draw();

// undraw previous piece

    Piece.prototype.undraw =function() {
        this.fill(VACANT);
    }

    p.undraw();


//move down the piece

    Piece.prototype.moveDown = function() {

        if(!this.collision(0,1, this.activeTetromino)){
            this.undraw();
            this.y++;
            this.draw();
        } else {
            //we lock the piece or generate a new piece

        }


    }
//move right the piece
    Piece.prototype.moveRight = function() {
        if(!this.collision(1, 0, this.activeTetromino)) {
            this.undraw();
            this.x++;
            this.draw();
        } else {

        }

    }
//move left the piece
    Piece.prototype.moveLeft = function() {
        if(!this.collision(-1,0, this.activeTetromino)) {
            this.undraw();
            this.x--;
            this.draw();
        } else {

        }

    }
//rotate the piece
    Piece.prototype.rotate = function() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let kick = 0;

        if (this.collision(0,0, nextPattern)){
            if(this.x > COL/2){
                //it's the right wall
                kick = -1; // moving the piece to the left

            } else {
                //it's the left wall
                kick = 1; //moving the piece to the right

            }
        }

        if(!this.collision(kick, 0, nextPattern)) {
            this.undraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0+1)%4 =1
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }
//collision function

    Piece.prototype.collision = function(x, y, piece){
        for (r = 0; r < piece.length; r++) {
            board[r] = [];
            for (c = 0; c < piece.length; c++) {

                //checking if the square is empty, we skip it
                if(piece[r][c]) {
                    continue;
                }
                //coordinates of the pice after movement
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                //conditions

                if(newX < 0 || newX >= COL || newY >= ROW ){
                    return true;
                }
                //skip newY < 0; board [-1] will crush the game
                if (newY < 0){
                    continue;
                }
                // check if there is a locked piece already in place
                if (board [newX][newY] != VACANT) {
                    return true;
                }
            }
        }
    }


// control the piece
    document.addEventListener("keydown", control);
    function control(event){
        if ( event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();

        } else if ( event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();

        } else if ( event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();

        } else if ( event.keyCode == 40){
        p.moveDown();
        dropStart = Date.now();
        }
    }





//drop piece every 1 second
    let dropStart = Date.now();
    function drop(){
        let now = Date.now();
        let delta = now - dropStart;
        if(delta > 500){
            p.moveDown();
            dropStart = Date.now();
        }

        requestAnimationFrame(drop);
    }

    drop();

});

