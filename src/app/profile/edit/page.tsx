'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { userAPI } from '@/lib/api'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, _hasHydrated, setUser } = useAuthStore()
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    location_address: '',
    location_lat: '',
    location_lng: '',
  })
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState('')

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
        location_address: user.location_address || '',
        location_lat: user.location_lat?.toString() || '',
        location_lng: user.location_lng?.toString() || '',
      })
    }
  }, [isAuthenticated, _hasHydrated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data: any = {
        full_name: profileForm.full_name,
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url,
        location_address: profileForm.location_address,
      }

      if (profileForm.location_lat) data.location_lat = parseFloat(profileForm.location_lat)
      if (profileForm.location_lng) data.location_lng = parseFloat(profileForm.location_lng)

      const response = await userAPI.updateProfile(data)
      const updatedUser = response.data.data || response.data
      
      // Update user in store
      setUser({ ...user, ...updatedUser })
      
      success('Profile updated successfully!')
      router.push('/dashboard')
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddInterest = async () => {
    if (!newInterest.trim()) return

    try {
      await userAPI.addInterests([newInterest.trim()])
      setInterests([...interests, newInterest.trim()])
      setNewInterest('')
      success('Interest added!')
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to add interest')
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest))
  }

  if (!_hasHydrated || !isAuthenticated || !user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-4 border-old-ink bg-gradient-to-br from-old-paper to-amber-50 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <span className="text-4xl">✏️</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Edit Profile</h1>
              <p className="text-old-grey text-sm uppercase tracking-wider">Update Your Information</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-4 border-b-4 border-old-ink">
            <h2 className="text-xl font-bold uppercase tracking-wider">Basic Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-old-border focus:border-old-ink outline-none font-mono"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Bio
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-old-border focus:border-old-ink outline-none font-mono resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-old-border focus:border-old-ink outline-none font-mono"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Location Address
              </label>
              <input
                type="text"
                value={profileForm.location_address}
                onChange={(e) => setProfileForm({ ...profileForm, location_address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-old-border focus:border-old-ink outline-none font-mono"
                placeholder="City, Country"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={profileForm.location_lat}
                  onChange={(e) => setProfileForm({ ...profileForm, location_lat: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-old-border focus:border-old-ink outline-none font-mono"
                  placeholder="23.8103"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={profileForm.location_lng}
                  onChange={(e) => setProfileForm({ ...profileForm, location_lng: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-old-border focus:border-old-ink outline-none font-mono"
                  placeholder="90.4125"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 border-4 border-old-ink bg-old-ink text-old-paper hover:bg-gray-800 
                         font-bold uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border-4 border-old-border bg-white hover:bg-gray-100 
                         font-bold uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Interests Section */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-4 border-b-4 border-old-ink">
            <h2 className="text-xl font-bold uppercase tracking-wider">Reading Interests</h2>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Add Interest */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                className="flex-1 px-4 py-3 border-2 border-old-border focus:border-old-ink outline-none font-mono"
                placeholder="Add an interest (e.g., Science Fiction, History)"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-6 py-3 border-4 border-old-ink bg-old-ink text-old-paper hover:bg-gray-800 
                         font-bold uppercase tracking-wider transition-all"
              >
                Add
              </button>
            </div>

            {/* Interests List */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 border-2 border-old-ink bg-old-paper"
                  >
                    <span className="font-bold text-sm uppercase">{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-old-grey uppercase">
              💡 Add interests to get better book recommendations and priority matching
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
