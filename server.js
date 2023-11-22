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

app.get(
  //get method to read db.json
  "/api/notes",
  (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        res.json(parsedNotes);
      }
    });
  }
);

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
      parsedNotes.push(newNote);
      res.json(parsedNotes);
      fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (writeErr) =>
        writeErr ? console.error(writeErr) : console.info("Note Saved")
      );
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const toDelete = parsedNotes.findIndex((i) => i.id == id);
      if (toDelete > -1) {
        parsedNotes.splice(toDelete, 1);
      }
      res.json(parsedNotes);
      fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (writeErr) =>
        writeErr ? console.error(writeErr) : console.info(`Note ${id} Deleted`)
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
