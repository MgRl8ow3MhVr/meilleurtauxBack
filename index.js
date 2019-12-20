// # # # # # # # IMPORTS AND DEFINITIONS # # # # # # #

// Imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formidable = require("express-formidable");
const mailgun = require("mailgun-js");

// Server app declaration
const app = express();
app.use(formidable());
app.use(cors());

// # # # # # # # MONGOOSE CONNECTION AND MODELS # # # # # # #
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const Devis = mongoose.model("Devis", {
  email: String,
  type: String,
  etat: String,
  usage: String,
  situation: String,
  montant: String,
  zip: String
});

// # # # # # # # MAILGUN SETTINGS # # # # # # #
const API_KEY = process.env.GUNKEY;
const DOMAIN = process.env.GUNDOMAIN;
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

// # # # # # # # ROUTES # # # # # # # # # # # # # #

// - - - - - - - - - - HELLO WORLD - - - - - - - - - - - - - - - - - - - - -
app.get("/", async (req, res) => {
  res.status(200).json({ message: "Meilleur Taux Back te passe le bonjour" });
});

// - - - - - - - - - - PING - - - - - - - - - - - - - - - - - - - - - - - -
app.get("/ping", async (req, res) => {
  try {
    res.status(200).json({ message: "pong" });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
});

// - - - - - - - - - - AUTHENTIFICATION - - - - - - - - - - - - - - - - - - - - -
app.post("/authent", async (req, res) => {
  console.log("authent demandee");
  try {
    if (req.fields.password === process.env.PASSWORD) {
      console.log("authent ok");
      res.status(200).json({ token: process.env.TOKEN });
    } else {
      console.log("authent nope");

      res.status(200).json({ message: "authent fail" });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// - - - - - - - - - - DEVIS CREATION - - - - - - - - - - - - - - - - - - -
app.post("/deviscreation", async (req, res) => {
  try {
    // Create new Entry
    console.log("devis creation asked", req.fields.email);
    const devis = new Devis(req.fields);
    await devis.save();

    // Send an Email
    console.log("creation OK, sending email");
    const data = {
      from: "Mailgun Sandbox <postmaster@" + DOMAIN + ">",
      to: "7anUDQ2A3MVJkC7J@gmail.com",
      subject: "Meilleur Taux Pierre, Dossier " + devis._id,
      text:
        "Voici ton récapitulatif Meilleur Taux en JSON" + JSON.stringify(devis)
    };
    mg.messages().send(data, function(error, body) {
      console.log(body);
    });

    // Send Back Res Status OK
    console.log("email done, answering client with id", devis._id);
    res.status(200).json({ message: "Created", id: devis._id });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
});

// - - - - - - - - - - GET ALL DEVIS - - - - - - - - - - - - - - - - - - -
app.get("/getdevis", async (req, res) => {
  try {
    console.log("get all required");
    const alldevis = await Devis.find();
    res.status(200).json({ alldevis: alldevis });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// - - - - - - - - - - DELETE ONE DEVIS - - - - - - - - - - - - - - - - - - -

app.post("/deletedevis", async (req, res) => {
  try {
    console.log("delete ", req.fields.id);
    const alldevis = await Devis.findOneAndDelete(req.fields.id);
    res.status(200).json({ message: "deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// # # # # # # # STARTER # # # # # # # # # # # # # #
app.listen(process.env.PORT, () => {
  console.log("server started on", process.env.PORT);
});
