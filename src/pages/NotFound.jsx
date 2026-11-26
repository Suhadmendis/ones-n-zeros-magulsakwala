import Button from '../components/Button'
import Seo from '../components/Seo'

function NotFound() {
  return (
    <>
      <Seo path="/404" title="Page Not Found" noindex />
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '32px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: 12 }}>Page not found</h1>
        <p style={{ marginBottom: 32, color: 'color-mix(in srgb, var(--color-charcoal) 65%, transparent)' }}>
          The page you're looking for doesn't exist.
        </p>
        <Button to="/">Go home</Button>
      </section>
    </>
  )
}

export default NotFound
