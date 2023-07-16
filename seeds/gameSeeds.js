import usersArray from "./userSeeds.js";
import Game from "../models/Game.js";

// Funcion para tener numeros random
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Armar lista de jugadores en la partida en 
// base a los que se generan en el otro seed
function generateFakePlayersList(arr) {
  let players = [];
  let playersQty = getRandomNum(3, 8);
  for (let i = 0; i < playersQty; i++) {
    players.push(arr[getRandomNum(0, arr.length)]);
  }
  return players;
}

// Generar una ronda con resultados falsos
function generateRound(players, index) {
  let roundNum = index + 1;
  const cardsInDeck = 40;
  let maxCardsToDeal = Math.floor(cardsInDeck / players.length);
  let cardsToDeal = getRandomNum(3, maxCardsToDeal);

  // Generar la tabla de posiciones
  let score = [];
  for (let i = 0; i < players.length; i++) {
    let player = {
      name: players[i],
      score: getRandomNum(-i, roundNum * 8),
      bet: getRandomNum(0, 4),
      lost: getRandomNum(0, 2),
    };
    score.push(player);
  }

  let round = {
    round: roundNum,
    cardsToDeal: cardsToDeal,
    score: score,
  };

  return round;
}

// Generar juego completo con resultados falsos
function generateFakeGame() {
  let players = generateFakePlayersList(usersArray);
  let roundsQty = 9;
  let gameData = [];
  for (let i = 0; i < roundsQty; i++) {
    let round = generateRound(players, i);
    gameData.push(round);
  }
  return gameData;
}

// Seedear la db
for (let i = 0; i < 10; i++) {
  let gameResults = generateFakeGame();
  let day = getRandomNum(1, 32);
  let month = getRandomNum(1, 13);
  let rounds = gameResults[gameResults.length - 1].round;

  let gameForDb = new Game({
    results: gameResults,
    duration: 1220,
    date: `${day}/${month}/2022`,
    rounds: rounds,
  });
  gameForDb
    .save()
    .then((g) => {
      console.log(g);
    })
    .catch((e) => {
      console.log(e);
    });
}
