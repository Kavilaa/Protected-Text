import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import Notes from "./notes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/note", async (req, res) => {
  try {
    const { title, text, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newNote = new Notes({
      title,
      text,
      hashedPassword,
    });
    await newNote.save();
    res.status(201).json({ message: "Note added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/note/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const { password } = req.body;
    const note = await Notes.findOne({ title });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    const passwordMatch = await bcrypt.compare(password, note.hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.status(200).json({ title: note.title, text: note.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/note-status/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const note = await Notes.findOne({ title });
    if (note) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/protected-notes");
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
    console.log("connected to database");
    console.log("Server is running on port", PORT);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});
