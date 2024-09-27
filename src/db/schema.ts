import mongoose from "mongoose"

const NotesSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Todo", "InProgress", "Completed"],
    default: "Todo",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  dueDate: Date,
})

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  notes: [NotesSchema],
})
  
 export const Usernote = mongoose.model("User", UserSchema)