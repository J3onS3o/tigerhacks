// src/App.tsx
import { useState } from 'react'
// Import both of your new components
import { SignInForm } from './components/SignInForm'
import { SignUpForm } from './components/SignUpForm'
import './App.css' // Or wherever your styles are

function App() {
  // We'll use this state to toggle which form to show
  // true = show sign-in, false = show sign-up
  const [showSignIn, setShowSignIn] = useState(true)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Our Hackathon Project</h1>
        
        {/* This is the "redirect" logic. 
          It renders one component or the other based on our state.
        */}
        {showSignIn ? (
          <>
            {/* Show the Sign In form */}
            <SignInForm />
            
            {/* This is our "redirect" button */}
            <button 
              onClick={() => setShowSignIn(false)} 
              style={{ marginTop: '10px' }}
            >
              Don't have an account? Sign Up
            </button>
          </>
        ) : (
          <>
            {/* Show the Sign Up form */}
            <SignUpForm />
            
            {/* This is our "redirect" button */}
            <button 
              onClick={() => setShowSignIn(true)} 
              style={{ marginTop: '10px' }}
            >
              Already have an account? Sign In
            </button>
          </>
        )}

      </header>
    </div>
  )
}

export default App