import { Router } from 'express'
import supabase from '../database/supabase.js'
import jwt from 'jsonwebtoken'
const userRouter = Router()

userRouter.post('/signup', async (req, res) => {
  const { email, password, fullname } = req.body
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const { errorProfiles } = await supabase
    .from('profiles')
    .insert({ fullname, id: data.user.id })
    .single()

  if (errorProfiles) {
    return res.status(400).json({ error: errorProfiles.message })
  }

  res.status(200)
})

userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { user, session, error } = await supabase.auth.signIn({
    email,
    password
  })

  if (error) {
    return res.status(401).json({ error: error.message })
  }

  const token = jwt.sign(session, process.env.JWT_SECRET)

  res.cookie('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })

  res.status(200).json({ user })
})

userRouter.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut()

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json({ success: true })
})

export default userRouter
