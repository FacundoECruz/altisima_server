function getRandomNumber(min, max) {
  const random = Math.random();
  const range = max - min;
  const randomNumber = Math.floor(random * range) + min;
  return randomNumber;
}


function generateCardsPerRound(playersQty) {
  const cardsInDeck = 40;
  const minCardsPerRound = 3;
  const maxCardsPerRound = Math.floor(cardsInDeck / playersQty);
  const roundsQty = 9;

  let cardsPerRound = [];

  for (let i = 0; i < roundsQty - 1; i++) {
    const randomNumber = getRandomNumber(minCardsPerRound, maxCardsPerRound + 1)
    cardsPerRound.push(randomNumber)
  }

  cardsPerRound.push(maxCardsPerRound)

  return cardsPerRound;
}

export default generateCardsPerRound;