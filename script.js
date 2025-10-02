const gameModule = (function () {
   function gameBoard() {
      let row = 3;
      let column = 3;
      let board = [];

      for (let i = 0; i < row; i++) {
         board[i] = [];
         for (let j = 0; j < column; j++) {
            board[i].push(Cell());
         }
      }

      const getBoard = () => board;

      const cellChosen = (row, column, player) => {
         board[row][column].addLetter(player);
      };

      const printBoard = () => {
         const fullBoard = board.map(row => row.map(cell => cell.getLetter()));
         return fullBoard;
      };

      // console.log(getBoard());
      // console.log(cellChosen(1, 2, 1));
      // console.log(cellChosen(0, 2, 11));
      // console.log(printBoard());

      return { getBoard, cellChosen, printBoard };
   }

   function Cell() {
      let letter = "";

      const addLetter = player => {
         letter = player;
      };

      const getLetter = () => letter;

      return { addLetter, getLetter };
   }

   function gameController(
      playerOneName = "Player One",
      playerTwoName = "Player Two"
   ) {
      const board = gameBoard();
      const players = [
         {
            name: playerOneName,
            token: "X",
         },
         {
            name: playerTwoName,
            token: "O",
         },
      ];
      let isGameOver = false;
      let activePlayer = players[0];

      const switchPlayerTurn = () => {
         activePlayer = activePlayer === players[0] ? players[1] : players[0];
      };

      const getActivePlayer = () => activePlayer;

      const printNewRound = () => {
         console.log(board.printBoard());
         console.log(`${getActivePlayer().name}'s turn.`);
      };

      const playRound = (row, column) => {
         if (isGameOver) {
            console.log("Game over! Please start a new game.");
            return;
         }

         console.log(
            `${
               getActivePlayer().name
            }'s letter going to row ${row} column ${column}...`
         );
         board.cellChosen(row, column, getActivePlayer().token);

         if (checkForWin(board.getBoard(), getActivePlayer().token)) {
            console.log(`${getActivePlayer().name} wins!`);
            console.log(board.printBoard());
            isGameOver = true;
            return;
         }

         if (checkForDraw(board.getBoard())) {
            console.log(`ITS A DRAW!`);
            console.log(board.printBoard());
            isGameOver = true;
            return;
         }

         switchPlayerTurn();
         printNewRound();
      };

      const checkForDraw = currentBoard => {
         const flatBoard = currentBoard.flat();
         return flatBoard.every(cell => cell.getLetter() !== '');
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

      printNewRound();

      return {
         playRound,
         getActivePlayer,
      };
   }

   return { gameBoard, gameController };
})();

const game = gameModule.gameController("Chris", "Luna");
game.playRound(0, 0);
game.playRound(0, 1);
game.playRound(0, 2);
game.playRound(1, 0);
game.playRound(1, 1);
game.playRound(2, 0);
game.playRound(1, 2);
game.playRound(2, 2);
game.playRound(2, 1);
