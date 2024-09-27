import express from "express";
import { Usernote } from "../db/schema";
import jwt from "jsonwebtoken";
const jwtpwd = process.env.JWT_PWD as string;
const router = express.Router();

router.post("/signup", async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const f = await Usernote.findOne({ username: username })
    if (f) {
      res.status(403).json({ msg: "User already present " })
  
      return
    } else {
      await Usernote.create({
        username: username,
        password: password, 
        notes: [],
      })
  
      res.status(200).json({ msg: "New user id created" })
    }
  })

  async function userPresent(name: string) {
    const f = await Usernote.findOne({ username: name })
    if (f) return true
    return false
  }

  router.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password)
      res.status(403).json({ msg: "Insufficient Credential" })
    else {
      const ispresent = await userPresent(req.body.username)
      if (ispresent) {
        const token = jwt.sign({ username: req.body.username }, jwtpwd, {
          expiresIn: "1d",
        })
  
        res.status(200).json({ token })
      } else {
        res.status(403).json({ msg: "User Not Found" })
      }
    }
  })

export default router;