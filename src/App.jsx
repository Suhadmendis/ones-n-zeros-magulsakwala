import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const Register = lazy(() => import('./pages/Register'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const PrivacyTrust = lazy(() => import('./pages/PrivacyTrust'))
const ContactFaq = lazy(() => import('./pages/ContactFaq'))
const SignUp = lazy(() => import('./pages/SignUp'))
const SignIn = lazy(() => import('./pages/SignIn'))

function RouteFallback() {
  return <div style={{ minHeight: '60vh' }} aria-busy="true" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <Suspense fallback={<RouteFallback />}>
                <HowItWorks />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Suspense fallback={<RouteFallback />}>
                <SignUp />
              </Suspense>
            }
          />
          <Route
            path="/sign-in"
            element={
              <Suspense fallback={<RouteFallback />}>
                <SignIn />
              </Suspense>
            }
          />
          <Route
            path="/thank-you"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ThankYou />
              </Suspense>
            }
          />
          <Route
            path="/privacy-trust"
            element={
              <Suspense fallback={<RouteFallback />}>
                <PrivacyTrust />
              </Suspense>
            }
          />
          <Route
            path="/contact-faq"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ContactFaq />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
