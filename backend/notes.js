import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    hashedPassword: String,
  },
  { timestamps: true }
);

const Notes = mongoose.model("Note", noteSchema);

export default Notes;
