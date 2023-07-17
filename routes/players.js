import express from "express";
import Player from "../models/Player.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    console.log(players)
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving players", error });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const player = await Player.find({ username: username });

    if (player.length === 0) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving player", error });
  }
});

router.post("/", async (req, res) => {
  const playerData = req.body.username;
  const isPlayerNameRepeated = await Player.exists({ username: playerData });
  if (isPlayerNameRepeated) {
    return res
      .status(400)
      .json("El nombre de usuario ya está registrado papu");
  } else {
    const player = new Player(req.body)
    try {
      await player.save();
      console.log(player);
      res.status(201).json(player);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
});

export { router };
