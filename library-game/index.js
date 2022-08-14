let SHELF_COUNT = 6;
let BOOK_COLORS = [
  "red",
  "blue",
  "green",
  "pink",
  "purple",
  "yellow",
  "orange",
];
const shelfArr = [];
let SHELF_SIZE = 3;
let blankCount = 1;
const LEFT = "left";
const RIGHT = "right";
const container = document.querySelector(".container");
const startButton = document.querySelector("#start");
const discardDivs = document.querySelectorAll(".discard");
const shelfQuanRange = document.querySelector("#shelf-quan-range");
const shelfSizeRange = document.querySelector("#shelf-size-range");
const colorQuanRange = document.querySelector("#color-quan-range");
const header = document.querySelector(".header");
colorQuanRange.max = shelfQuanRange.value;
//! Initial operations

const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
    colorQuanRange.max = shelfQuanRange.value;
  });
  setBubble(range, bubble);
});

startButton.addEventListener("click", (e) => {
  setStartProps();
  document
    .querySelectorAll(".range-wrap")
    .forEach((div) => (div.style.display = "none"));
  startButton.style.display = "none";
  header.style.display = "none";
  setShelves();
  setShelfArr();
  draw(shelfArr);
  setEvents();
  discardDivs.forEach((discardDiv) => {
    discardDiv.style.visibility = "visible";
  });
});

function setStartProps() {
  SHELF_COUNT = shelfQuanRange.value;
  SHELF_SIZE = shelfSizeRange.value;
  BOOK_COLORS = setColors(colorQuanRange.value);
}
function setColors(quan) {
  let colorArr = [];
  for (let i = 0; i < quan; i++) {
    colorArr.push(BOOK_COLORS[i]);
  }
  return colorArr;
}
function setEvents() {
  // !EVENTS
  for (let i = 0; i < SHELF_COUNT; i++) {
    const rightButton = document.querySelectorAll(".right");
    rightButton[i].addEventListener("click", rightButtonClick);

    const leftButton = document.querySelectorAll(".left");
    leftButton[i].addEventListener("click", leftButtonClick);
  }
}
function setShelves() {
  for (let i = 0; i < SHELF_COUNT; i++) {
    let shelfWrapper = document.createElement("div");
    shelfWrapper.className = "shelf-wrapper";
    shelfWrapper.style.height = `${
      parseInt(container.style.height) / SHELF_COUNT
    }px`;
    let leftButton = document.createElement("button");
    leftButton.innerText = "<";
    leftButton.className = `shelf-button stable left left${i}`;
    let shelf = document.createElement("div");
    shelf.className = `shelf shelf${i}`;
    let rightButton = document.createElement("button");
    rightButton.innerText = ">";
    rightButton.className = `shelf-button stable right right${i}`;
    container.append(shelfWrapper);
    shelfWrapper.append(leftButton);
    shelfWrapper.append(shelf);
    shelfWrapper.append(rightButton);
  }
}
function countBookColors() {
  let books = {};
  let count = {};
  for (let k = 0; k < BOOK_COLORS.length; k++) {
    count[`${BOOK_COLORS[k]}`] = 0;
  }

  for (let i = 0; i < SHELF_COUNT; i++) {
    for (let j = 0; j < SHELF_SIZE; j++) {
      for (let k = 0; k < BOOK_COLORS.length; k++) {
        if (shelfArr[i][j] == BOOK_COLORS[k]) {
          count[`${BOOK_COLORS[k]}`]++;
          books[`${BOOK_COLORS[k]}`] = count[`${BOOK_COLORS[k]}`];
        }
      }
    }
  }
  return books;
}
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function moveRight(index) {
  let last = shelfArr[index].pop();
  shelfArr[index].unshift(last);
  return shelfArr[index];
}
function moveLeft(index) {
  let first = shelfArr[index].shift();
  shelfArr[index].push(first);
  return shelfArr[index];
}
function draw(shelves) {
  reset();
  for (let i = 0; i < SHELF_COUNT; i++) {
    for (let j = 0; j < SHELF_SIZE; j++) {
      let book = document.createElement("div");
      book.className = "book";
      book.style.backgroundColor = shelves[i][j];
      let shelf = document.querySelector(`.shelf${i}`);
      shelf.append(book);
    }
  }
}
function reset() {
  for (let i = 0; i < SHELF_COUNT; i++) {
    let shelf = document.querySelector(`.shelf${i}`);
    shelf.innerHTML = "";
  }
}
function discard(shelf, direction) {
  const discardLeftDiv = document.querySelector(".discard-left");
  const discardRightDiv = document.querySelector(".discard-right");
  discardLeftDiv.innerHTML = "";
  discardRightDiv.innerHTML = "";
  const book = document.createElement("div");
  book.className = "book";
  if (direction == "left") {
    let discarded = shelf.shift();
    shelf.push("transparent");
    discardLeftDiv.append(book);
    book.style.backgroundColor = discarded;
  } else {
    let discarded = shelf.pop();
    shelf.unshift("transparent");
    discardRightDiv.append(book);
    book.style.backgroundColor = discarded;
  }
}
function changeButtons() {
  const leftButtons = document.querySelectorAll(".left");
  leftButtons.forEach((leftButton) => {
    leftButton.innerText = ">";
    leftButton.classList.replace("stable", "animate");
    leftButton.removeEventListener("click", leftButtonClick);
    leftButton.addEventListener("click", addLeft);
  });

  const rightButtons = document.querySelectorAll(".right");
  rightButtons.forEach((rightButton) => {
    rightButton.innerText = "<";
    rightButton.classList.replace("stable", "animate");
    rightButton.removeEventListener("click", rightButtonClick);
    rightButton.addEventListener("click", addRight);
  });
}
function leftButtonClick(e) {
  //! make sure that buttons last char is number
  let index = e.target.className[e.target.className.length - 1];
  if (shelfArr[index][0] != "transparent") {
    discard(shelfArr[index], LEFT);
    changeButtons();
  } else moveLeft(index);
  draw(shelfArr);
}
function rightButtonClick(e) {
  //! make sure that buttons last char is number
  let index = e.target.className[e.target.className.length - 1];
  if (shelfArr[index][shelfArr[index].length - 1] != "transparent") {
    discard(shelfArr[index], RIGHT);
    changeButtons();
  } else moveRight(index);
  draw(shelfArr);
}
function addLeft(e) {
  document.querySelectorAll(".discard").forEach((div) => {
    if (div.firstChild) {
      let color = div.firstChild.style.backgroundColor;
      let index = e.target.className[e.target.className.length - 1];
      //! IF INCLUDES ANY TRANSPARENT
      const tIndexes = [];
      if (shelfArr[index].includes("transparent")) {
        for (let i = 0; i < shelfArr[index].length; i++) {
          if (shelfArr[index][i] === "transparent") {
            tIndexes.push(i);
          }
        }

        if (shelfArr[index][0] == "transparent") {
          shelfArr[index][0] = color;
          switchEvents();
          div.firstChild.remove();
        } else if (tIndexes[0] > 0 && tIndexes.length >= 1) {
          for (let i = 0; i < tIndexes.length; i++) {
            shelfArr[index].splice(tIndexes[i], 1);
            if (i == 0) shelfArr[index].unshift(color);
            else shelfArr[index].unshift("transparent");
          }
          switchEvents();
          div.firstChild.remove();
        }
      }
      draw(shelfArr);
    }
  });
  checkWin(shelfArr);
}
function addRight(e) {
  console.log("added right");
  document.querySelectorAll(".discard").forEach((div) => {
    if (div.firstChild) {
      let color = div.firstChild.style.backgroundColor;
      let index = e.target.className[e.target.className.length - 1];
      //! IF INCLUDES ANY TRANSPARENT
      const tIndexes = [];
      if (shelfArr[index].includes("transparent")) {
        for (let i = 0; i < shelfArr[index].length; i++) {
          if (shelfArr[index][i] === "transparent") {
            tIndexes.push(i);
          }
        }
        console.log("tIndexes", tIndexes);
        const lastIndex = shelfArr[index].length - 1;
        const lastTIndext = tIndexes.length - 1;
        if (shelfArr[index][lastIndex] == "transparent") {
          shelfArr[index][lastIndex] = color;
          switchEvents();
          div.firstChild.remove();
        } else if (tIndexes[lastTIndext] < lastIndex && tIndexes.length >= 1) {
          for (let i = 0; i < tIndexes.length; i++) {
            let dIndex = shelfArr[index].findIndex(
              (color) => color == "transparent"
            );
            shelfArr[index].splice(dIndex, 1);
          }
          for (let i = 0; i < tIndexes.length; i++) {
            if (i == 0) shelfArr[index].push(color);
            else shelfArr[index].push("transparent");
          }
          switchEvents();
          div.firstChild.remove();
        }
      }
      draw(shelfArr);
    }
  });
  checkWin(shelfArr);
}
function shuffleBookArr(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
function switchEvents() {
  const leftButtons = document.querySelectorAll(".left");
  const rightButtons = document.querySelectorAll(".right");
  leftButtons.forEach((leftButton) => {
    leftButton.innerText = "<";
    leftButton.classList.replace("animate", "stable");
    leftButton.addEventListener("click", leftButtonClick);
  });
  rightButtons.forEach((rightButton) => {
    rightButton.innerText = ">";
    rightButton.classList.replace("animate", "stable");
    rightButton.addEventListener("click", rightButtonClick);
  });
}
function checkWin(array) {
  let reducedArray = new Array(array.length);

  for (let i = 0; i < array.length; i++) {
    reducedArray[i] = [];
  }

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] != "transparent") {
        reducedArray[i].push(array[i][j]);
      }
    }
  }
  let correctShelfCount = 0;
  for (let i = 0; i < reducedArray.length; i++) {
    if (reducedArray[i].every((book) => book == reducedArray[i][0])) {
      correctShelfCount++;
    }
  }
  console.log("reducedArray: ", reducedArray);
  console.log("correctShelfCount: ", correctShelfCount);

  if (correctShelfCount == SHELF_COUNT) win();
}
function win() {
  container.innerHTML = `<button id="win-button"><div><h1>You win!</h1></div> <div>Click here to play again!</div></button>`;
  const winButton = document.querySelector("#win-button");
  winButton.addEventListener("click", () => {
    window.location.reload();
  });
  discardDivs.forEach((discardDiv) => (discardDiv.style.display = "none"));
}
function setShelfArr() {
  //! fill each shelf with books
  blankCount = SHELF_COUNT;
  let bookCount = SHELF_COUNT * SHELF_SIZE - blankCount;
  const bigArr = [];
  let colorCounts = [];
  let count = 0;
  for (let i = 0; i < BOOK_COLORS.length - 1; i++) {
    colorCounts[i] = Math.floor(bookCount / BOOK_COLORS.length);
    count = count + colorCounts[i];
  }
  colorCounts[BOOK_COLORS.length - 1] = bookCount - count;

  for (let i = 0; i < BOOK_COLORS.length; i++) {
    for (let j = 0; j < colorCounts[i]; j++) {
      bigArr.push(BOOK_COLORS[i]);
    }
  }
  for (let i = 0; i < blankCount; i++) {
    bigArr.push("transparent");
  }
  console.log(bigArr);
  let shuffledBookArr = shuffleBookArr(bigArr);
  console.log("shuffledBookArr: ", shuffledBookArr);
  let newArr = splitToChunks(shuffledBookArr, SHELF_COUNT);
  console.log("newArr: ", newArr);
  newArr.forEach((arr) => shelfArr.push(arr));
  console.log(shelfArr);
}
function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}
function splitToChunks(array, parts) {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}
