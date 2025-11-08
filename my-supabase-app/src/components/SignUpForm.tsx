// src/components/SignUpForm.tsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'

export function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Sign up the user with email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User not found after sign up.')

      // 2. Create their profile in the 'Profiles' table
      // Now you get type-safety!
      const { error: profileError } = await supabase.from('Profiles').insert({
        id: authData.user.id, // The link to auth.users
        username: username,
        email: email
      })

      if (profileError) throw profileError

      alert('Signed up successfully! Please check your email for verification.')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // We can add a sign-in function here too
  // ... (omitted for brevity)

  return (
    <form onSubmit={handleSignUp}>
      <h3>Create an Account</h3>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}