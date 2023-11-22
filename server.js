const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");

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

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    }
  });
});

app.post("/api/notes/", (req, res) => {
  const { title, text } = req.body;

  const newNote = {
    id: uuid(),
    title,
    text,
  };

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
      console.log(parsedNotes, newNote);
      parsedNotes.push(newNote);

      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("Successfully updated notes!")
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
