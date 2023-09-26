import supabase from '../database/supabase.js'

export async function checkUser (req, res, next) {
  const { email, password } = req.headers

  if (!email || !password) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const { data, userError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (userError) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}

export async function checkOrigin (req, res, next) {
  const { origin } = req.headers

  if (origin !== process.env.SECRET) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
