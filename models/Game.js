import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  cardsPerRound: Array,
  results: Array,
  date: String,
  round: Number,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
});

const Game = mongoose.model("Game", GameSchema);

export default Game;
