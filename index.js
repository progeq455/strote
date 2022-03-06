const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const corsMiddleware = require("./middlewares/cors-middleware");
const authRouter = require("./routes/auth-router");
const notesRouter = require("./routes/note-router");
const categoryRouter = require("./routes/category-router");

const app = express();
const PORT = process.env.PORT || config.get("serverPort");

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/category", categoryRouter);

const start = async () => {
  try {
    mongoose.connect(config.get("DBURL"));
    app.listen(PORT, () => {
      console.log("Сервер запущен на порту " + PORT);
    });
  } catch (e) {
    console.log(e); 
  }
};

start();