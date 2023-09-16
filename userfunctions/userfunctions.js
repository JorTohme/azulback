import supabase from '../database/supabase.js'

export async function checkUser (req, res) {
  const { email, password } = req.headers

  if (!email || !password) {
    return { error: 'Unauthorized' }
  }

  const { userData, userError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (userError) {
    return { error: userError.message }
  }
}

export async function checkOrigin (req, res) {
  const { origin } = req.headers

  if (origin !== process.env.SECRET) {
    return { error: 'Unauthorized' }
  }
}
