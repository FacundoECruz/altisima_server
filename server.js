import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import {router as playersRouter} from "./routes/players.js";
import {router as gamesRouter} from "./routes/games.js"
import {router as usersRouter} from "./routes/users.js"

const app = express();

mongoose.connect(import.meta.env.VITE_DATABASE_LINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
app.use('/api/players', playersRouter)
app.use('/api/games', gamesRouter)
app.use('/api/users', usersRouter)

app.listen("3000", () => {
  console.log('ON 3000')
});