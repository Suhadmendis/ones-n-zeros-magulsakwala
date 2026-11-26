import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Seo from '../components/Seo'
import { useAuth } from '../hooks/useAuth.js'
import './Dashboard.css'

function DashboardSpinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-busy="true" aria-label="Loading">
      <div style={{ width: 36, height: 36, border: '3px solid var(--color-blush-2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) return <DashboardSpinner />
  if (!user) return <Navigate to="/sign-in" replace />

  return (
    <>
      <Seo path="/dashboard" title="My Profile" noindex />
      <section className="dashboard-section">
        <h1>Welcome, {user.name}</h1>

        <Card>
          <h2>Your Details</h2>
          <dl className="dashboard-dl">
            <dt>Name</dt>
            <dd>{user.name}</dd>
            {user.email && (
              <>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </>
            )}
          </dl>
        </Card>

        <Card>
          <h2>Your Registration</h2>
          <p>Our team is reviewing your profile. We will contact you when a match is found.</p>
          <Button to="/register" variant="outline">Update Registration</Button>
        </Card>
      </section>
    </>
  )
}

export default Dashboard
