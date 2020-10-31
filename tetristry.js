document.addEventListener("DOMContentLoaded",() =>{

    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const estadoVital = document.querySelector("#estado");
    const startBtn = document.querySelector("#start-button");
    var nivelActual = document.getElementById("nivel");
    var nivelo = 1;
    const width = 10;
    let nextRandom = 0;
    let timerId = null;
    let score = 0;
    var velocidad = null;


    //formitas

    const lTetromino = [
        [1, width+1, width*2+1, 2], 
        [width, width+1, width+2, width*2+2], 
        [1, width+1, width*2+1, width*2], 
        [width, width*2, width*2+1, width*2+2] 
    ];

    const zTetromino = [
        [0, 1, width+1, width+2],
        [width+1, width*2+1, 2, width+2],
        [0, 1, width+1, width+2],
        [width+1, width*2+1, 2, width+2]
    ];
    
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const izTetromino = [
        [1, 2, width, width+1],
        [0, width, width+1, width*2+1],
        [1, 2, width, width+1],
        [0, width, width+1, width*2+1]
    ];

    const monTetromino = [
        [0, 1, 2, 3, width, width+1, width+2, width+3, width*2, width*2+1, width*2+2, width*2+3, width*3, width*3+1, width*3+2, width*3+3],
        [0, 1, 2, 3, width, width+1, width+2, width+3, width*2, width*2+1, width*2+2, width*2+3, width*3, width*3+1, width*3+2, width*3+3],
        [0, 1, 2, 3, width, width+1, width+2, width+3, width*2, width*2+1, width*2+2, width*2+3, width*3, width*3+1, width*3+2, width*3+3],
        [0, 1, 2, 3, width, width+1, width+2, width+3, width*2, width*2+1, width*2+2, width*2+3, width*3, width*3+1, width*3+2, width*3+3]
    ];

    const ilTetromino = [
        [0, 1, width+1, width*2+1],
        [width, width+1, width+2, 2],
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2, width*2]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, izTetromino, monTetromino, ilTetromino];

    //posicion y coso

    let currentPosition = 4;
    let currentRotation = 0;


    let random = Math.floor(Math.random()*theTetrominoes.length);

    let current = theTetrominoes[random][currentRotation];

    //funciones para que la cosa ande

    //dibujar la pieza
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add("tetromino");
        })
    }

    //desdibujar la pieza
    function undraw(){
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove("tetromino");
        })
    }

    //cronometro de dibujado

    //keycodes
    function control(e) {
        if(e.keyCode === 37){moveLeft();}
        else if(e.keyCode === 38){rotate();}
        else if(e.keyCode === 39){moveRight();}
        else if(e.keyCode === 40){moveDown();}
    }
    document.addEventListener("keyup", control);


    //abajo
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    } 

    //congelar la pieza cuando colisiona
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
            current.forEach(index => squares[currentPosition + index].classList.add("taken"));

            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
            subirDeNivel();
            console.log(velocidad, nivelo);
        }
    }

    //izquierda
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!isAtLeftEdge) {currentPosition -= 1};
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {currentPosition+=1};

        draw();
    }

    //derecha
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);

        if(!isAtRightEdge) {currentPosition += 1};
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {currentPosition-=1};

        draw();
    }

    //rotar
    function rotate() {
        undraw();

        currentRotation++;
        if(currentRotation===current.length){currentRotation = 0;}
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isAlmostAtLeftEdge = current.some(index => (currentPosition + index) % width === 1);
        if((isAtLeftEdge || isAlmostAtLeftEdge)&&(currentRotation>0)){currentRotation--;}
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);
        const isAlmostAtRightEdge = current.some(index => (currentPosition + index) % width === width-2);
        if((isAtRightEdge || isAlmostAtRightEdge)&&(currentRotation>0)){currentRotation--;}

        current = theTetrominoes[random][currentRotation];
        draw();

    }

    

    //mostrar pantallita formitas
    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;

    //pantallita formitas
    const upNextTetrominoes = [
        [1, 2, displayWidth+1, displayWidth*2+1], //formita L
        [0, 1, displayWidth+1, displayWidth+2], //formita Z
        [1, displayWidth, displayWidth+1, displayWidth+2], //formita T
        [0, 1, displayWidth, displayWidth+1], //formita O
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //formita I
        [1, 2, displayWidth, displayWidth+1], //formita Z inv
        [0, 1, 2, 3, displayWidth, displayWidth+1, displayWidth+2, displayWidth+3, displayWidth*2, displayWidth*2+1, displayWidth*2+2, displayWidth*2+3, displayWidth*3, displayWidth*3+1, displayWidth*3+2, displayWidth*3+3], // formita grande grande
        [0, 1, displayWidth+1, displayWidth*2+1]
    ];
    
    //mostrar formita futura
    function displayShape() {
        displaySquares.forEach(square => {square.classList.remove("tetrominoF")});
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add("tetrominoF");
        });
    }

    //levelear

    function subirDeNivel(){
        if(scoreDisplay.innerHTML < 10) {nivelActual.innerHTML = 1; nivelo = 1;};
        if(scoreDisplay.innerHTML >= 10){nivelActual.innerHTML = 2; nivelo = 2; dificultyUp();};
        if(scoreDisplay.innerHTML >= 20){nivelActual.innerHTML = 3; nivelo = 3; dificultyUp();};
        if(scoreDisplay.innerHTML >= 30){nivelActual.innerHTML = 4; nivelo = 4; dificultyUp();};
        if(scoreDisplay.innerHTML >= 40){nivelActual.innerHTML = 5; nivelo = 5; dificultyUp();};
        if(scoreDisplay.innerHTML >= 50){nivelActual.innerHTML = 6; nivelo = 6; dificultyUp();};
        if(scoreDisplay.innerHTML >= 60){nivelActual.innerHTML = 7; nivelo = 7; dificultyUp();};
        if(scoreDisplay.innerHTML >= 70){nivelActual.innerHTML = 8; nivelo = 8; dificultyUp();};
        if(scoreDisplay.innerHTML >= 80){nivelActual.innerHTML = 9; nivelo = 9; dificultyUp();};
        
    }


    //puntaje y redibujado de la grilla
    function addScore(){
        for (let i=0; i<199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains("taken"))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove("tetromino");
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

        //boton
        startBtn.addEventListener("click", () => {
            if(timerId){
                clearInterval(timerId);
                timerId=null;
            }
            else{
                draw();
                velocidad = 1000;
                timerId = setInterval(moveDown, velocidad);
                nextRandom = Math.floor(Math.random()*theTetrominoes.length);
                displayShape();
            }
            startBtn.innerHTML = "Pausa";
        })

        //aumentar dificultad
        function dificultyUp() {
            if(estadoVital.innerHTML==="Vivo"){
            clearInterval(timerId);
            velocidad = 1000 - (nivelo*150);
            timerId = setInterval(moveDown, velocidad);
        }
        }


    //findeljuegoamigo

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
            estadoVital.innerHTML = "Muerto";
            clearInterval(timerId);
        }
    }



})