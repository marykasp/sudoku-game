let NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const newGrid = (size) => {
  // instance of Array class
  let arr = new Array(size);

  for (let i = 0; i < size; i++) {
    // create a row inside the main array
    arr[i] = new Array(size);
  }

  for (let i = 0; i < Math.pow(size, 2); i++) {
    // grab the cell of the row and column - [0][0] [0][1]
    arr[Math.floor(i / size)][i % size] = 0;
  }

  console.log(arr);
  return arr;
};

// check duplicate number in col
const isColValid = (grid, col, value) => {
  for (let row = 0; row < 9; row++) {
    // already value in that column
    if (grid[row][col] === value) return false;
  }

  return true;
};

// check duplicate number in row
const isRowValid = (grid, row, value) => {
  for (let col = 0; col < 9; col++) {
    // if value is already in that row
    if (grid[row][col] === value) return false;
  }

  return true;
};

// check duplicate number in 3x3 grid
const isBoxValid = (grid, box_row, box_col, value) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row + box_row][col + box_col] === value) return false;
    }
  }

  return true;
};

// check in row, col and 3x3 box
const isValid = (grid, row, col, value) => {
  return (
    isColValid(grid, col, value) &&
    isRowValid(grid, row, value) &&
    // row - 0, 3, 6 col - 0, 3, 6
    isBoxValid(grid, row - (row % 3), col - (col % 3), value) &&
    value !== 0
  );
};

// find unassigned cell - change the row and column position
const findUnassignedPos = (grid, pos) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        pos.row = row;
        pos.col = col;
        return true;
      }
    }
  }

  return false;
};

// shuffle array
const shuffleArray = (arr) => {
  let currIndex = arr.length;

  while (currIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currIndex);
    // change the current index
    currIndex -= 1;

    // save the value at the current index to use in swap
    let temp = arr[currIndex];
    // change the value to the value at the random index
    arr[currIndex] = arr[randomIndex];
    // let value of random index equal to the value that was previously at the current
    arr[randomIndex] = temp;
  }

  return arr;
};

// check puzzle is complete
const isGridFull = (grid) => {
  // every method returns true if every element passes the condition
  // every cell must have a value that is not equal to 0
  return grid.every((row, i) => {
    return row.every((value, j) => {
      return value !== 0;
    });
  });
};

const sudokuCreate = (grid) => {
  let unassignedPos = {
    row: -1,
    col: -1,
  };

  // returns true if position is unassigned - only return and exit out of method if position is already assigned
  // method updates the row and column in the object
  if (!findUnassignedPos(grid, unassignedPos)) return true;

  // shuffle array of numbers 1 - 9
  let numberList = shuffleArray([...NUMBERS]);

  let row = unassignedPos.row;
  let col = unassignedPos.col;

  numberList.forEach((num, i) => {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;

      if (isGridFull(grid)) {
        return true;
      } else {
        if (sudokuCreate(grid)) {
          return true;
        }
      }
      grid[row][col] = 0;
    }
  });
  return grid;
  // return isGridFull(grid);
};

const rand = () => Math.floor(Math.random() * 9);

const removeCells = (grid, level) => {
  let res = [...grid];
  let attemps = level;
  while (attemps > 0) {
    let row = rand();
    let col = rand();
    while (res[row][col] === 0) {
      row = rand();
      col = rand();
    }
    res[row][col] = 0;
    attemps--;
  }
  return res;
};

const sudokuGen = (level) => {
  let sudoku = newGrid(9);
  let check = sudokuCreate(sudoku);
  console.log("fullboard", check);
  console.log("sudoku modified", sudoku);
  let response = removeCells(sudoku, level);
  console.log("question", response);
  // if (check) {
  //   let question = removeCells(sudoku, level);
  // }
  return undefined;
};

sudokuGen(29);
