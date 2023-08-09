import express from "express";
import User from "../models/User.js";
import Player from "../models/Player.js";
import mongoose from "mongoose";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.find({ username: username }); //
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

router.post("/", async (req, res) => {
  const { username, email } = req.body;

  //Aca hay que usar logica de middleware

  let isUsernameRepeated = null;
  let isEmailRepeated = null;
  let isPlayerNameRepeated = null;

  User.exists({ username })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));

  User.exists({ email })
    .then((res) => {
      console.log(res);
      isEmailRepeated = true;
    })
    .catch((err) => console.log(err));

  Player.exists({ username })
    .then((res) => {
      console.log(res);
      isPlayerNameRepeated = true;
    })
    .catch((err) => console.log(err));

  if (isUsernameRepeated || isEmailRepeated || isPlayerNameRepeated) {
    console.log("***isUsernameRepeated***");
    console.log(isUsernameRepeated);
    console.log("***isEmailRepeated***");
    console.log(isEmailRepeated);
    console.log("***isPlayerNameRepeated***");
    console.log(isPlayerNameRepeated);
    return res
      .status(400)
      .json("El nombre de usuario o correo electrónico ya están registrados");
  }

  const user = new User(req.body);
  const player = new Player(req.body);
  try {
    await user.save();
    await player.save();
    console.log(user);
    return res.status(201).send();
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const passwordMatch = user.password === password;
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:username", async (req, res) => {
  const username = req.params.username;
  const updatedUserData = req.body;

  const filter = { username: username };
  const updatedUser = await User.findOneAndUpdate(filter, updatedUserData, {
    new: true,
  });
  const updatedPlayer = await Player.findOneAndUpdate(filter, updatedUserData, {
    new: true,
  });
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!updatedPlayer) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(updatedUser);
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "Successful deleted" });
});

export { router };
