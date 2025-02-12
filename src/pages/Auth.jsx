import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

function Auth() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="max-w-md mx-auto p-8 brutal-card">
      <h1 className="text-3xl font-black text-accent mb-8 text-center">
        WELCOME BACK
      </h1>
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2d2d2d',
                brandAccent: '#1a1a1a',
              },
            },
          },
          className: {
            button: 'brutal-btn w-full',
            input: 'brutal-input w-full',
          },
        }}
        providers={['google']}
      />
    </div>
  )
}

export default Auth
