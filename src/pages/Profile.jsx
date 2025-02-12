import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    getProfile()
  }, [user])

  async function getProfile() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      toast.error('Error loading profile!')
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(e) {
    e.preventDefault()
    try {
      setUpdating(true)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Error updating profile!')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-black text-accent mb-8">PROFILE</h1>
      <div className="brutal-card p-8">
        <form onSubmit={updateProfile} className="space-y-6">
          <div>
            <label className="block text-accent font-bold mb-2">Name</label>
            <input
              type="text"
              className="brutal-input w-full"
              value={profile?.name || ''}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-accent font-bold mb-2">Bio</label>
            <textarea
              className="brutal-input w-full h-32"
              value={profile?.bio || ''}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-accent font-bold mb-2">Website</label>
            <input
              type="url"
              className="brutal-input w-full"
              value={profile?.website || ''}
              onChange={e => setProfile({ ...profile, website: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="brutal-btn w-full"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
