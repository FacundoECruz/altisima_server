import express from "express";
import User from "../models/User.js";
import Player from "../models/Player.js";
import mongoose from "mongoose";
const router = express.Router();

async function validateUserData(req, res, next) {
  const { username, email } = req.body;

  const isUsernameRepeated = await User.findOne({ username: username });
  const isEmailRepeated = await User.findOne({ email: email });
  const isPlayerNameRepeated = await Player.findOne({ username: username });

  if (
    isUsernameRepeated !== null ||
    isEmailRepeated !== null ||
    isPlayerNameRepeated !== null
  ) {
    return res.status(400).json({
      error: "El nombre de usuario o correo electrónico ya están registrados",
    });
  }

  next();
}

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "No se pudo recuperar los usuarios", error });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.find({ username: username }); //
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "No se pudo recuperar el usuario", error });
  }
});

router.post("/", validateUserData, async (req, res) => {
  const user = new User(req.body);
  const player = new Player(req.body);
  try {
    await user.save();
    await player.save();
    console.log(user);
    return res.status(201).json(user);
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
      return res.status(401).json({ message: "Usuario o contraseña invalidos" });
    }
    const passwordMatch = user.password === password;
    if (!passwordMatch) {
      return res.status(401).json({ message: "Usuario o contraseña invalidos" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
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
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  if (!updatedPlayer) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.status(200).json(updatedUser);
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "User ID invalida" });
  }
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.status(200).json({ message: "Borrado exitosamente" });
});

export { router };
