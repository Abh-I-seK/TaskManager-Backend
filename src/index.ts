import express from "express"
import jwt from "jsonwebtoken"
import { Usernote } from "./db/schema"
import mongoose from "mongoose"
import cors from "cors"
import "dotenv/config"
const app = express()
const jwtpwd = process.env.JWT_PWD as string;
app.use(cors())
app.use(express.json())
import authRoutes from "./routes/auth";
import noteRoute from "./routes/note";

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoute);

app.get("/api/check", async (req, res) => {
  try {
    if (!req.headers.authorization) {
      res.status(403).json({ msg: "User not authenticated" })
      return
    }
    let tk = req.headers.authorization
    if (Array.isArray(req.headers.authorization)) {
      tk = req.headers.authorization[0]
    }
    const token = tk.split(" ")[1]
    const decode = jwt.verify(token, jwtpwd) as { username: string }
    const v = await Usernote.findOne({ username: decode.username })
    if (!v) {
      res.status(404).json({ msg: "User not authenticated" })
      return;
    }
    res.json({"username" : decode.username})
  } catch (err) {
    res.status(403).json({ msg: "User not authenticated" })
  }
})


mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err))

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
