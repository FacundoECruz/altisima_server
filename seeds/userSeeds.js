import mongoose from "mongoose";
import User from "../models/User.js";
import Player from "../models/Player.js";
import { generateUsername } from "unique-username-generator";

mongoose.connect('mongodb://localhost:27017/altisima', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONECTED TO MONGO")
    })
    .catch(err => {
        console.log('ERROR')
        console.log(err)
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

let usersArray = []

for (let i = 0; i < 20; i++) {
  const username = generateUsername("-", 2, 14)
  usersArray.push(username)
  const user = new User({
    username: username,
    email: "fakeEmail@mail.com",
    password: "pass",
  })
  user.save()
    .then(p => {
      console.log(p)
    })
    .catch(e => {
      console.log(e)
  })
  const player = new Player({
    username: username,
    email: "fakeEmail@mail.com"
  })
  player.save()
    .then(p => {
      console.log(p)
    })
    .catch(e => {
      console.log(e)
  })
}

export default usersArray;