'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Profile = {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
}

export default function EnglishProfileRoute() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/profile', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load profile')
        return data.user as Profile
      })
      .then(user => {
        setProfile(user)
        setName(user.name)
        setPhone(user.phone ?? '')
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save profile')
      setProfile(data.user)
      setName(data.user.name)
      setPhone(data.user.phone ?? '')
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">My Profile</h1>
      <p className="mb-8 text-muted-foreground">Manage your Corner Kona account details.</p>

      {loading && <p>Loading profile...</p>}

      {!loading && error && !profile && (
        <div className="space-y-4">
          <p role="alert" className="text-red-600">{error}</p>
          <Link href="/en/login" className="underline">Go to login</Link>
        </div>
      )}

      {profile && (
        <form onSubmit={saveProfile} className="space-y-5 rounded-2xl border p-6">
          <div>
            <label htmlFor="profile-name" className="mb-2 block font-medium">Name</label>
            <input
              id="profile-name"
              value={name}
              onChange={event => setName(event.target.value)}
              maxLength={100}
              required
              className="w-full rounded-lg border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="mb-2 block font-medium">Email</label>
            <input
              id="profile-email"
              value={profile.email}
              readOnly
              className="w-full rounded-lg border bg-muted px-3 py-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>

          <div>
            <label htmlFor="profile-phone" className="mb-2 block font-medium">Phone</label>
            <input
              id="profile-phone"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              maxLength={20}
              className="w-full rounded-lg border bg-background px-3 py-2"
            />
          </div>

          {error && <p role="alert" className="text-red-600">{error}</p>}
          {message && <p role="status" className="text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </main>
  )
}
