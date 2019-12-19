// # # # # # # # IMPORTS AND DEFINITIONS # # # # # # #

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formidable = require("express-formidable");

// Server app declaration
const app = express();
app.use(formidable());
app.use(cors());

// Mongoose connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// Demande de Devis Model Definition
const Devis = mongoose.model("Devis", {
  email: String,
  type: String,
  etat: String,
  usage: String,
  situation: String,
  montant: String,
  zip: String
});

// # # # # # # # ROUTES # # # # # # # # # # # # # #

// - - - - - - - - - - HELLO WORLD - - - - - - - -
app.get("/", async (req, res) => {
  res.status(200).json({ message: "Meilleur Taux Back te passe le bonjour" });
});

// - - - - - - - - - - PING - - - - - - - -
app.get("/ping", async (req, res) => {
  try {
    res.status(200).json({ message: "pong" });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
});
// - - - - - - - - - - DEVIS CREATION - - - - - - - -
app.post("/deviscreation", async (req, res) => {
  try {
    const devis = new Devis(req.fields);
    await devis.save();
    console.log("creation", devis);

    res.status(200).json({ message: "Created" });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
});

// # # # # # # # STARTER # # # # # # # # # # # # # #

app.listen(process.env.PORT, () => {
  console.log("server started on", process.env.PORT);
});
