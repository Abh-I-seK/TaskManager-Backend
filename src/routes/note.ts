import express from "express";
import { Usernote } from "../db/schema";
import jwt from "jsonwebtoken";
const jwtpwd = process.env.JWT_PWD as string;
const router = express.Router();

router.get("/", async (req, res) => {
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
      let a = await Usernote.findOne({ username: decode.username })
      if (!a) {
        res.status(403).json({ msg: "User not authenticated" })
        return
      }
      res.json({ notes: a.notes })
    } catch (err) {
      res.status(403).json({ msg: "User not authenticated" })
    }
  })
  
  router.put("/:id", async (req, res) => {
    const id = req.params.id
    const note = { ...req.body }
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
      let v = jwt.verify(token, jwtpwd) as { username: string }
      const a = await Usernote.findOne({ username: v.username })
  
      if (!a) {
        res.status(403).json({ msg: "User not authenticated" })
        return
      }
  
      let notes = a.notes
  
      for (let i = 0; i < notes.length; i++) {
        const cur = notes[i]._id.toString()
        // console.log(cur.includes(id))
        if (cur.includes(id)) {
          notes[i].status = note.status
          notes[i].priority = note.priority
          notes[i].dueDate = note.dueDate
          notes[i].description = note.description
          notes[i].title = note.title
        }
      }
  
      await Usernote.updateOne({ username: v.username }, { notes: notes })
      res.status(200).json({ msg: "Notes updated" , notes : notes})
    } catch (err) {
      console.log(err)
      res.status(403).json({ msg: "User does not exists" })
    }
  })
  
  router.delete("/:id", async (req, res) => {
    const id = req.params.id
  
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
      let v = jwt.verify(token, jwtpwd) as { username: string }
      const a = await Usernote.findOne({ username: v.username })
  
      if (!a) {
        res.status(403).json({ msg: "User not authenticated" })
        return
      }
  
      let no = []
      const note = a.notes
  
      for (let i = 0; i < note.length; i++) {
        const cur = note[i]._id.toString()
        if (cur.includes(id)) {
          continue
        }
        no.push(note[i])
      }
  
      await Usernote.updateOne({ username: v.username }, { notes: no })
      res.status(200).json({ msg: "Note deleted" , notes : no})
    } catch (err) {
      res.status(403).json({ msg: "User does not exists" })
    }
  })
  
  router.post("/", async (req, res) => {
    const note = { ...req.body }
  
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
      const decoded = jwt.verify(token, jwtpwd) as { username: string }
      let a = await Usernote.findOne({ username: decoded.username })
  
      if (!a) {
        res.status(403).json({ msg: "User not authenticated" })
        return
      }
  
      a.notes.push(note)
      await Usernote.updateOne({ username: decoded.username }, { notes: a.notes })
  
      res.status(200).json({ msg: "Notes added..." , notes: a.notes})
    } catch (err) {
      res.status(403).json({ msg: "User not authenticated" })
    }
  })

  export default router;