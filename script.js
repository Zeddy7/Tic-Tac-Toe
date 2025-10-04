const gameModule = (function () {
   function gameBoard() {
      let row = 3;
      let column = 3;
      let board = [];
      function start() {
         board = [];
         for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < column; j++) {
               board[i].push(Cell());
            }
         }
      }
      start();

      const getBoard = () => board;

      const cellChosen = (row, column, player) => {
         if (board[row][column].getLetter() !== "") {
            return false;
         }
         board[row][column].addLetter(player);
         return true;
      };

      const printBoard = () => {
         const fullBoard = board.map(row => row.map(cell => cell.getLetter()));
         return fullBoard;
      };

      return { getBoard, cellChosen, printBoard, start };
   }

   function Cell() {
      let letter = "";
      const addLetter = player => (letter = player);
      const getLetter = () => letter;
      return { addLetter, getLetter };
   }

   function gameController(
      playerOneName = "Player One",
      playerTwoName = "Player Two",
      initialScores = { "Player X": 0, "Player O": 0 }
   ) {
      const board = gameBoard();
      const players = [
         {
            name: playerOneName,
            token: "X",
            score: initialScores[playerOneName],
         },
         {
            name: playerTwoName,
            token: "O",
            score: initialScores[playerTwoName],
         },
      ];

      let isGameOver = false;
      let activePlayer = players[0];

      const switchPlayerTurn = () => {
         activePlayer = activePlayer === players[0] ? players[1] : players[0];
      };

      const getActivePlayer = () => activePlayer;
      const getPlayers = () => players;

      const autoReset = () => {
         board.start();
         isGameOver = false;
         activePlayer = players[0];
      };

      const updateScreen = () => {
         const gameBoardElement = document.querySelector(".container");
         const scoresElement = document.querySelector(".scores");

         gameBoardElement.textContent = "";

         const boardData = board.getBoard();
         const activePlayer = getActivePlayer();

         document.querySelector(
            ".active-player"
         ).textContent = `${activePlayer.name}'s turn`;
         scoresElement.innerHTML = ` <p>${players[0].name} Score: ${players[0].score}</p>
                  <p>${players[1].name} Score: ${players[1].score}</p>`;

         boardData.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
               const cellButton = document.createElement("button");
               cellButton.classList.add("cell");
               cellButton.dataset.row = rowIndex;
               cellButton.dataset.column = columnIndex;
               cellButton.textContent = cell.getLetter();
               gameBoardElement.appendChild(cellButton);
            });
         });
      };

      const checkForDraw = currentBoard => {
         const flatBoard = currentBoard.flat();
         return flatBoard.every(cell => cell.getLetter() !== "");
      };

      const checkForWin = (currentBoard, playerToken) => {
         const boardValues = currentBoard.map(row =>
            row.map(cell => cell.getLetter())
         );

         const checkLine = line => {
            return line.every(cellValue => cellValue === playerToken);
         };

         for (const row of boardValues) {
            if (checkLine(row)) return true;
         }

         for (let col = 0; col < 3; col++) {
            const column = boardValues.map(row => row[col]);
            if (checkLine(column)) return true;
         }

         const primaryDiagonal = [
            boardValues[0][0],
            boardValues[1][1],
            boardValues[2][2],
         ];
         if (checkLine(primaryDiagonal)) return true;

         const secondaryDiagonal = [
            boardValues[0][2],
            boardValues[1][1],
            boardValues[2][0],
         ];
         if (checkLine(secondaryDiagonal)) return true;

         return false;
      };

      const playRound = (row, column) => {
         const winnerDisplay = document.querySelector(".winner");

         if (isGameOver) {
            autoReset();
            updateScreen();
            return;
         }

         const hasPlayedCell = board.cellChosen(
            row,
            column,
            getActivePlayer().token
         );

         if (!hasPlayedCell) {
            return;
         }

         winnerDisplay.textContent = "New Game Started!";

         if (checkForWin(board.getBoard(), getActivePlayer().token)) {
            winnerDisplay.textContent = `${getActivePlayer().name} wins!`;
            getActivePlayer().score++;
            const scores = document.querySelector(".scores");
            scores.innerHTML = ` <p>${players[0].name} Score: ${players[0].score}</p>
               <p>${players[1].name} Score: ${players[1].score}</p>`;
            isGameOver = true;
            return;
         }

         if (checkForDraw(board.getBoard())) {
            winnerDisplay.textContent = `ITS A DRAW!`;
            isGameOver = true;
            return;
         }

         switchPlayerTurn();
      };

      return {
         playRound,
         getActivePlayer,
         getBoard: board.getBoard,
         getPlayers,
         updateScreen,
         autoReset,
      };
   }

   function displayDom() {
      let game = gameController("Player X", "Player O");
      const winnerDisplay = document.querySelector(".winner");
      const gameBoard = document.querySelector(".container");
      const restartButton = document.querySelector(".restart");

      const updateScreen = () => {
         game.updateScreen();
         if (
            game.getPlayers()[0].score === 0 &&
            game.getPlayers()[1].score === 0
         ) {
            winnerDisplay.textContent = "New Game Started!";
         }
      };

      function clickHandlerBoard(e) {
         const selectedRow = e.target.dataset.row;
         const selectedColumn = e.target.dataset.column;
         if (!selectedRow || !selectedColumn) return;

         game.playRound(selectedRow, selectedColumn);
         updateScreen();
      }
      gameBoard.addEventListener("click", clickHandlerBoard);

      function restartGame() {
         game = gameController("Player X", "Player O");
         updateScreen();
      }
      restartButton.addEventListener("click", restartGame);
      updateScreen();
   }
   return { displayDom };
})();
gameModule.displayDom();
