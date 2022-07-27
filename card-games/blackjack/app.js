const body = document.body;
const container = document.querySelector("#container");
const wrapper = document.querySelector(".wrapper");
const buttonsDiv = document.querySelector(".buttons");

document.querySelector("#draw-card").style.display = "none";
document.querySelector("#finish-game").style.display = "none";

const cardsContainer = document.createElement("div");
const dealerCardsContainer = document.createElement("div");
const dealerTotal = document.createElement("h1");

container.append(wrapper);
container.append(dealerCardsContainer);
container.append(cardsContainer);

let moneyH1 = document.querySelector("#money");
let money = 500;
let localMoney = localStorage.getItem("money");
if (localMoney != null) money = parseInt(localMoney);
moneyH1.innerText = `${money}`;

let bidInput = document.querySelector("#bid");
bidInput.max = money;

const suits = ["clubs", "diamonds", "hearts", "spades"];

let deck = [];
var cardsPlayed = [];
var dealerCardsPlayed = [];
let playerTotalVal;
let dealerTotalVal;

// generate ordered deck
for (let i = 0; i < 4; i++) {
  var suitName = suits[i];

  for (let k = 2; k < 15; k++) {
    var cardImg = document.createElement("img");
    cardImg.className = "card";
    cardImg.alt = `${k}_of_${suitName}`;
    cardImg.src = `./deck/${k}_of_${suitName}.png`;

    var card = generateCard(k, suitName);
    deck.push(card);
  }
}
var shuffledDeck = shuffleDeck(deck);

const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", (e) => {
  if (bidInput.value > money) {
    alert("You cannot bid more than your money");
  } else if (bidInput.value == 0) {
    alert("You cannot play without bidding");
  } else if (bidInput.value < 0) {
    alert("Nice try lol");
  } else {
    playerTotalVal = startGame(shuffledDeck);
    document.querySelector("#start-game").style.display = "none";
    document.querySelector("#draw-card").style.display = "block";
    document.querySelector("#finish-game").style.display = "block";
    cardsContainer.className = "cards-container";
    money = money - bidInput.value;
    bidInput.disabled = true;
    moneyH1.innerText = `${money}`;

    if (playerTotalVal === 21) finishGame();
  }
});

const playerDrawCardButton = document.getElementById("draw-card");
playerDrawCardButton.addEventListener("click", (e) => {
  let cardsOnScreen = playerDrawCard(shuffledDeck);
  playerTotalVal = showPlayerTotalValue(cardsOnScreen);
  if (playerTotalVal > 21) loseGame();
  if (playerTotalVal === 21) finishGame();
});

const standButton = document.getElementById("finish-game");
standButton.addEventListener("click", (e) => {
  finishGame();
});

const tryAgainButton = document.createElement("button");
tryAgainButton.className = "try-again";
tryAgainButton.innerText = "Try Again";
tryAgainButton.style.display = "none";
container.append(tryAgainButton);
tryAgainButton.addEventListener("click", () => window.location.reload());

function generateCard(k, suitName) {
  if (k < 11) {
    return {
      name: `${k}_of_${suitName}`,
      suit: suitName,
      value: k,
      src: `./deck/${k}_of_${suitName}.png`,
    };
  }
  switch (k) {
    case 11:
      return {
        name: `jack_of_${suitName}`,
        suit: suitName,
        value: 10,
        src: `./deck/11_of_${suitName}.png`,
      };
    case 12:
      return {
        name: `queen_of_${suitName}`,
        suit: suitName,
        value: 10,
        src: `./deck/12_of_${suitName}.png`,
      };
    case 13:
      return {
        name: `king_of_${suitName}`,
        suit: suitName,
        value: 10,
        src: `./deck/13_of_${suitName}.png`,
      };
    case 14:
      return {
        name: `ace_of_${suitName}`,
        suit: suitName,
        value: 11,
        src: `./deck/14_of_${suitName}.png`,
      };
    default:
      break;
  }
}
// de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
function shuffleDeck(array) {
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
function playerDrawCard(deck) {
  const card = deck.pop();
  cardsPlayed.push(card);
  const cardDiv = document.createElement("div");
  cardDiv.className = "card-div";
  const cardImg = document.createElement("img");
  cardImg.className = "card-img";
  cardImg.src = card.src;
  cardImg.alt = card.name;
  cardsContainer.append(cardDiv);
  cardDiv.append(cardImg);
  cardsContainer.append(buttonsDiv);

  return cardsPlayed;
}
function showPlayerTotalValue(cardsPlayed) {
  var total = 0;
  for (let i = 0; i < cardsPlayed.length; i++) {
    total = total + cardsPlayed[i].value;
  }
  if (total > 21 && cardsPlayed.some((card) => card.name.startsWith("ace"))) {
    total = total - 10;
  }
  const totalValueDiv = document.querySelector("#total-value");
  totalValueDiv.innerText = "Total value: " + total;
  return total;
}
function startGame() {
  playerDrawCard(shuffledDeck);
  let cardsPlayed = playerDrawCard(shuffledDeck);
  let total = showPlayerTotalValue(cardsPlayed);
  return total;
}
function winGame() {
  document.querySelector("#draw-card").style.display = "none";
  document.querySelector("#finish-game").style.display = "none";
  giveInfo("Win");
  money = money + bidInput.value * 2;
  moneyH1.innerText = `${money}`;
  tryAgainButton.style.display = "block";
  localStorage.clear();
  localStorage.setItem("money", money);
}
function loseGame() {
  document.querySelector("#draw-card").style.display = "none";
  document.querySelector("#finish-game").style.display = "none";
  giveInfo("Lose");
  tryAgainButton.style.display = "block";
  localStorage.clear();
  localStorage.setItem("money", money);
}
function tie() {
  giveInfo("Tie");
  tryAgainButton.style.display = "block";
  money = money + bidInput.value;
  localStorage.clear();
  localStorage.setItem("money", money);
}
function finishGame() {
  document.querySelector("#draw-card").style.display = "none";
  document.querySelector("#finish-game").style.display = "none";
  dealerCardsContainer.className = "dealer-cards-container";
  dealerTotalVal = dealerDraw();
  if (playerTotalVal > dealerTotalVal || dealerTotalVal > 21) winGame();
  if (playerTotalVal < dealerTotalVal && dealerTotalVal <= 21) loseGame();
  if (playerTotalVal == dealerTotalVal) tie();
}
function showDealerTotalValue(cardsPlayed) {
  var total = 0;
  for (let i = 0; i < cardsPlayed.length; i++) {
    total = total + cardsPlayed[i].value;
  }
  if (total > 21 && cardsPlayed.some((card) => card.name.startsWith("ace"))) {
    total = total - 10;
  }
  dealerTotal.innerText = `Total Value: ${total}`;
  return total;
}
function dealerDraw(total = 0) {
  let cardsPlayed = [];
  let maxCountToStopDrawing = 18;
  if (playerTotalVal < maxCountToStopDrawing)
    maxCountToStopDrawing = playerTotalVal;
  while (total < maxCountToStopDrawing) {
    cardsPlayed = drawForDealer(shuffledDeck);
    total = showDealerTotalValue(cardsPlayed);
  }
  return total;
}
function drawForDealer(deck) {
  const card = deck.pop();
  dealerCardsPlayed.push(card);
  const cardDiv = document.createElement("div");
  cardDiv.className = "card-div";
  const cardImg = document.createElement("img");
  cardImg.className = "card-img";
  cardImg.src = card.src;
  cardImg.alt = card.name;
  dealerCardsContainer.append(cardDiv);
  cardDiv.append(cardImg);
  dealerCardsContainer.append(dealerTotal);

  return dealerCardsPlayed;
}
function giveInfo(condition) {
  const infoDiv = document.createElement("h1");
  infoDiv.id = "info";
  infoDiv.innerText = `You ${condition}!`;
  body.append(infoDiv);
}
