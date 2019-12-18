require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formidable = require("express-formidable");

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const User = mongoose.model("User", {
  name: String,
  city: String
});

app.get("/ping", (req, res) => {
  res.send("pong");
  const user = new User();
  user.name = "pierre";
  user.city = "paris";
  user.save();
});

app.listen(process.env.PORT, () => {
  console.log("server started on", process.env.PORT);
});
