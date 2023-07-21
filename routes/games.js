import express from "express";
import Game from "../models/Game.js";
import Player from "../models/Player.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import generateCardsPerRound from "../utils/generateCardsPerRound.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving games", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const game = await Game.findById(id);
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving game", error });
  }
});

router.post("/", async (req, res) => {
  const playersDto = req.body;
  const players = await Promise.all(
    playersDto.map(async (p) => {
      try {
        const dbPlayer = await Player.findOne({ username: p.username });
        console.log(dbPlayer)
        return dbPlayer;
      } catch (error) {
        console.log(error);
      }
    })
  );

  const cardsPerRound = generateCardsPerRound(playersDto.length)

  const playersImgs = await Promise.all(
    players.map(async (player) => {
      const dbPlayer = await Player.findOne({username: player.username});
      return dbPlayer.image;
    })
  );

  const playersWithImages = playersDto.map((player, index) => ({
    ...player,
    image: playersImgs[index],
  }));

  const game = new Game({
    cardsPerRound,
    results: [playersDto],
    date: new Date(),
    round: 1,
    players: players.map((id) => new mongoose.Types.ObjectId(id)),
  });
  try {
    const savedGame = await game.save();
    const response = {
      id: savedGame._id,
      round: savedGame.round,
      cardsPerRound: cardsPerRound,
      status: "in progress",
      players: playersWithImages,
    };
    console.log("***Game Created***");
    console.log(savedGame);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.patch("/next", async (req, res) => {
  const game = await Game.findById(req.body.gameId);
  const roundResults = req.body.playersRound;
  const round = game.round;

  const resultsForDb = roundResults.map((player, index) => {
    if (player.bidsLost === 0)
      player.score =
        parseInt(game.results[round - 1][index].score) + 5 + player.bid;
    else
      player.score =
        parseInt(game.results[round - 1][index].score) - player.bidsLost;
    return player;
  });

  const newRoundState = resultsForDb.map((player) => {
    return {
      username: player.username,
      score: player.score,
      bid: 0,
      bidsLost: 0,
      image: player.image,
    };
  });

  game.round = game.round + 1;

  game.results.push(resultsForDb);
  try {
    const savedGame = await game.save();
    const response = {
      round: savedGame.round,
      newRoundState: newRoundState,
      status: "in progress",
    };
    console.log("***Round data saved***");
    console.log(savedGame);

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.patch("/prev", async (req, res) => {
  const game = await Game.findById(req.body.gameId);
  const prevRound = game.results.pop();
  game.round = game.round - 1;

  try {
    const savedGame = await game.save();
    const response = {
      round: savedGame.round,
      newRoundState: prevRound,
      status: "in progress",
    };
    console.log("***Round data saved with prevRound request***");
    console.log(savedGame);

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.patch("/finish", async (req, res) => {
  const game = await Game.findById(req.body.gameId);
  const { user, winner, players } = req.body;
  
  console.log("***players***")
  console.log(players)
  try {
    //LOGICA DEL GANADOR
    const winnerFilter = { username: winner };
    const winnerUpdate = { $inc: { gamesWon: 1 } };
    const updatedWinner = await Player.findOneAndUpdate(
      winnerFilter,
      winnerUpdate,
      {
        new: true,
      }
    );
    console.log("***Updated Winner***");
    console.log(updatedWinner);

    //LOGICA DE PARTIDAS JUGADAS
    const playerIds = game.players;
    const gamesPlayedUpdate = { $inc: { gamesPlayed: 1 } };
    const gamesPlayedUpdateResult = await Player.updateMany(
      { _id: { $in: playerIds } },
      gamesPlayedUpdate
    );
    console.log("***Updated Games Played***");
    console.log(gamesPlayedUpdateResult);
    //LOGICA DE SUMA DE PUNTOS
    playerIds.map(async (id, index) => {
      const scoreFilter = { _id: id };
      const scoreUpdate = { $inc: { totalScore: players[index].score } };
      const updatedScore = await Player.findOneAndUpdate(
        scoreFilter,
        scoreUpdate,
        {
          new: true,
        }
      );
      console.log("***Updated Score***");
      console.log(updatedScore);
    });
    //LOGICA DEL CREADOR
    const hostFilter = { username: user };
    const hostUpdate = { $inc: { createdGames: 1 } };
    const updatedHost = await User.findOneAndUpdate(hostFilter, hostUpdate, {
      new: true,
    });
    console.log("***Updated Host***");
    console.log(updatedHost);

    const savedGame = await game.save();

    const response = {
      savedGame: savedGame
    };
    console.log("***Game data saved***");
    console.log(savedGame);

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err.message);
  }
});
export { router };
