import { Router } from 'express'
import supabase from '../database/supabase.js'
import { checkUser, checkOrigin } from '../middleware/userfunctions.js'
import Jwt from 'jsonwebtoken'

const userRouter = Router()

userRouter.post('/signup', async (req, res) => {
  const { email, password, fullname } = req.body
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    return res.status(409).json({ error: error.message })
  }

  const { errorProfiles } = await supabase
    .from('profiles')
    .insert({ email, fullname, id: data.user.id })
    .single()

  if (errorProfiles) {
    return res.status(400).json({ error: errorProfiles.message })
  }

  res.status(200).json({ success: true })
})

userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return res.status(401).json({ error: error.message })
  }

  const { data: profile, error2 } = await supabase
    .from('profiles')
    .select('fullname, organization')
    .eq('id', data.user.id)
    .single()

  if (error2) {
    return res.status(400).json({ error: error2.message })
  }

  res.status(200).json({
    success: true,
    name: profile.fullname,
    organization: profile.organization
  })

  await supabase.auth.signOut()
})

userRouter.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut()

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json({ success: true })
})

userRouter.delete('/delete', checkOrigin, checkUser, async (req, res) => {
  const { email, password } = req.headers

  const { errorProfiles } = await supabase
    .from('profiles')
    .delete()
    .eq('email', email)
    .single()

  if (errorProfiles) {
    return res.status(400).json({ error: errorProfiles.message })
  }

  const { data, userDataError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  console.log(data.user.id)
  const { error } = await supabase.auth.admin.deleteUser(
    data.user.id
  )

  const { userErrorSignOut } = await supabase.auth.signOut()

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json({ success: true })
})

userRouter.post('/loginJWT', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return res.status(401).json({ error: error.message })
  }

  const { data: profile, error2 } = await supabase
    .from('profiles')
    .select('fullname, organization')
    .eq('id', data.user.id)
    .single()

  if (error2) {
    return res.status(400).json({ error: error2.message })
  }

  const payload = {
    id: data.user.id,
    email,
    fullname: profile.fullname,
    organization: profile.organization
  }

  const token = Jwt.sign(payload, process.env.SECRET, {
    expiresIn: '1h'
  })

  res.status(200).json({
    success: true,
    token
  })

  await supabase.auth.signOut()
})

export default userRouter
