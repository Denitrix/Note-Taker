const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get(
  //sends index.html to root path
  "/",
  (req, res) => res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get(
  // sets /notes path to notes.html
  "/notes",
  (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
