const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const app = express.Router();
const argon2id = require("argon2");

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).send("User with email already exists");
    } else {
        const hash = await argon2id.hash(password);
        const user = await User.create({ name, email, password: hash });
        return res.status(201).send({ message: "Signup successful", user });
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      if (!(await argon2id.verify(user.password, password))) {
        return res.status(401).send({ message: "Invalid password" });
      }

      const token = jwt.sign({ id: user._id, email: user.email }, config.secret, {
        expiresIn: config.tokenLife,
      });

      const response = {
        status: "Logged in",
        token: token
      };

      res.status(200).send(response);
    } else {
      return res.status(401).send({ message: "User not found" });
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = app;
