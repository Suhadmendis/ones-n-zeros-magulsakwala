import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Register from './pages/Register'
import ThankYou from './pages/ThankYou'
import PrivacyTrust from './pages/PrivacyTrust'
import ContactFaq from './pages/ContactFaq'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/privacy-trust" element={<PrivacyTrust />} />
          <Route path="/contact-faq" element={<ContactFaq />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
