import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://play-lh.googleusercontent.com/rX_nOuUDijsV_NnWZP9JgYTsFpxn5y7qCqDxFIpZ-BqiJu8un7UbdSgVTZSrJuzAlQ",
  },
  password: {
    type: String,
    required: true,
  },
  createdGames: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
