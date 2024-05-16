const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://bilguudeishinezul23:OhABJiilqIrG7VOD@cluster0.aa5ozjo.mongodb.net/orbital",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("DataBase connected"))
  .catch((err) => console.log(err));

const User = mongoose.model("User", {
  username: { type: String, unique: true },
  password: String,
});

const hashPassword = (password) => {
  return password;
};

const createUser = (username, password) => {
  const user = new User({
    username,
    password: hashPassword(password),
  });
  return user.save();
};

const findUserByUsername = (username) => {
  return User.findOne({ username });
};

const comparePassword = (password, hashedPassword) => {
  return password === hashedPassword;
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  findUserByUsername(username)
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: "Username or password is incorrect" });
      } else {
        const isPasswordValid = comparePassword(password, user.password);
        if (isPasswordValid) {
          res.send({ message: "Login successful" });
        } else {
          res
            .status(401)
            .send({ message: "Username or password is incorrect" });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal Server Error" });
    });
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  createUser(username, password)
    .then((user) => {
      console.log(user);
      res.json({ user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
