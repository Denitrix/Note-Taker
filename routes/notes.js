const tips = require("express").Router();
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");
const uuid = require("../helpers/uuid");

tips.get(
  //get method to read db.json
  "/",
  (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
    /* fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        res.json(parsedNotes);
      }
    }); */
  }
);

tips.post("/", (req, res) => {
  const { title, text } = req.body;

  const newNote = {
    id: uuid(),
    title,
    text,
  };
  readAndAppend(newNote, "./db/db.json");
  res.json(`Note Saved`);
  /* fs.readFile("./db/db.json", "utf8", (err, data) => {
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
  }); */
});

tips.delete("/:id", (req, res) => {
  const id = req.params.id;
  readFromFile("./db/db.json").then((data) => {
    const parsedNotes = JSON.parse(data);
    const toDelete = parsedNotes.findIndex((i) => i.id == id);
    if (toDelete > -1) {
      parsedNotes.splice(toDelete, 1);
    }
    writeToFile("./db/db.json", parsedNotes);
    res.json(`Note ${id} Deleted`);
  });
  /* fs.readFile("./db/db.json", "utf8", (err, data) => {
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
  }); */
});

module.exports = tips;
