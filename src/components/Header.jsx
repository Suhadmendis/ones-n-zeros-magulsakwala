import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'
import { useContent } from '../hooks/useContent.js'
import { useAuth } from '../hooks/useAuth.js'
import './Header.css'

const SCROLL_THRESHOLD = 50

function Header() {
  const { t, locale, toggleLocale } = useContent()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)
  const showSolid = isScrolled || !isHome

  const navLinks = [
    { label: t('header', 'nav', 'link_home'), to: '/' },
    { label: t('header', 'nav', 'link_how_it_works'), to: '/how-it-works' },
    { label: t('header', 'nav', 'link_privacy_trust'), to: '/privacy-trust' },
    { label: t('header', 'nav', 'link_contact_faq'), to: '/contact-faq' },
  ]

  const closeMenu = () => setIsOpen(false)

  const handleSignOut = async () => {
    closeMenu()
    await signOut()
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    const firstLink = panelRef.current?.querySelector('a')
    firstLink?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll('a, button')
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) toggleRef.current?.focus()
  }, [isOpen])

  return (
    <header className={`site-header${showSolid ? ' is-scrolled' : ''}`}>
      <div className="site-header__center">
        <NavLink to="/" className="site-logo" onClick={closeMenu}>
          {t('header', 'nav', 'logo')}
        </NavLink>

        <nav className="site-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="locale-toggle"
        onClick={toggleLocale}
        aria-label="Switch language"
      >
        {locale === 'en' ? 'සිං' : 'EN'}
      </button>

      {user ? (
        <div className="site-header__account">
          <NavLink to="/dashboard" className="site-header__user">{user.name}</NavLink>
          <button type="button" className="site-header__signout" onClick={handleSignOut}>
            {t('header', 'nav', 'cta_sign_out')}
          </button>
        </div>
      ) : (
        <NavLink to="/sign-in" className="site-header__signin">
          {t('header', 'nav', 'link_sign_in')}
        </NavLink>
      )}

      <Button to="/register" className="site-header__cta">
        {t('header', 'nav', 'cta_register')}
      </Button>

      <button
        ref={toggleRef}
        type="button"
        className={`menu-toggle${isOpen ? ' is-open' : ''}`}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? t('header', 'nav', 'menu_close') : t('header', 'nav', 'menu_open')}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`nav-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <nav
        id="mobile-nav-panel"
        ref={panelRef}
        className={`mobile-nav${isOpen ? ' is-open' : ''}`}
        aria-label="Mobile"
        aria-hidden={!isOpen}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeMenu}
            tabIndex={isOpen ? 0 : -1}
          >
            {link.label}
          </NavLink>
        ))}
        {user ? (
          <button
            type="button"
            className="site-header__signout"
            onClick={handleSignOut}
            tabIndex={isOpen ? 0 : -1}
          >
            {t('header', 'nav', 'cta_sign_out')}
          </button>
        ) : (
          <NavLink to="/sign-in" onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
            {t('header', 'nav', 'link_sign_in')}
          </NavLink>
        )}
        <Button to="/register" onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
          {t('header', 'nav', 'cta_register')}
        </Button>
      </nav>
    </header>
  )
}

export default Header
