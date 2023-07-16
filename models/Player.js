import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwUmQOGfv3HMATaiRo8hDCdcu23Otwqg2pEg&usqp=CAU",
  },
  gamesWon: {
    type: Number,
    default: 0,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
});

const Player = mongoose.model("Player", PlayerSchema);

export default Player;
  