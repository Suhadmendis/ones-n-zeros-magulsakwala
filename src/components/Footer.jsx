import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import { useContent } from '../hooks/useContent.js'
import './Footer.css'

const socialIcons = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/magulsakwala',
    path: 'M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.36C16.24 4.32 15.35 4.25 14.31 4.25c-2.16 0-3.64 1.32-3.64 3.74V10.5H8.2v3h2.47V21h2.83Z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/magulsakwala',
    path: 'M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm0 6.27a2.47 2.47 0 1 1 0-4.94 2.47 2.47 0 0 1 0 4.94Zm4.85-6.42a.89.89 0 1 1-1.77 0 .89.89 0 0 1 1.77 0ZM20 8.28c-.05-1.1-.3-2.07-1.1-2.87-.79-.8-1.76-1.05-2.86-1.1C14.9 4.25 9.1 4.25 8 4.31c-1.09.05-2.06.3-2.86 1.1-.8.8-1.05 1.77-1.1 2.87C4 9.4 4 15.6 4.04 16.72c.05 1.1.3 2.07 1.1 2.87.8.8 1.77 1.05 2.86 1.1 1.12.06 6.92.06 8.04 0 1.1-.05 2.07-.3 2.86-1.1.8-.8 1.05-1.77 1.1-2.87.06-1.12.06-6.92 0-8.04ZM18.5 18a2.6 2.6 0 0 1-1.47 1.47c-1.02.4-3.44.31-4.53.31s-3.51.09-4.53-.31A2.6 2.6 0 0 1 6.5 18c-.4-1.02-.31-3.44-.31-4.53s-.09-3.51.31-4.53A2.6 2.6 0 0 1 7.97 7.47c1.02-.4 3.44-.31 4.53-.31s3.51-.09 4.53.31A2.6 2.6 0 0 1 18.5 8.94c.4 1.02.31 3.44.31 4.53s.09 3.51-.31 4.53Z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@magulsakwala',
    path: 'M21.6 8.2a3 3 0 0 0-2.1-2.1C17.7 5.6 12 5.6 12 5.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 10 2 12 2 12s0 2 .4 3.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 14 22 12 22 12s0-2-.4-3.8ZM10 15.2V8.8L15.6 12 10 15.2Z',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@magulsakwala',
    path: 'M16.6 4.2c.4 1.8 1.6 3.1 3.4 3.3v2.6c-1.3 0-2.5-.4-3.4-1.1v6.3a5.1 5.1 0 1 1-5.1-5.1c.2 0 .4 0 .6.03v2.7a2.4 2.4 0 1 0 1.9 2.4V3h2.6c0 .4 0 .8 0 1.2Z',
  },
]

function Footer() {
  const { t } = useContent()
  const [showTop, setShowTop] = useState(false)

  const footerNavLinks = [
    { label: t('footer', 'nav', 'link_home'), to: '/' },
    { label: t('footer', 'nav', 'link_how_it_works'), to: '/how-it-works' },
    { label: t('footer', 'nav', 'link_privacy_trust'), to: '/privacy-trust' },
    { label: t('footer', 'nav', 'link_register'), to: '/register' },
    { label: t('footer', 'nav', 'link_contact_faq'), to: '/contact-faq' },
  ]

  const contactEmail = t('contact-faq', 'contact', 'email')

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <footer className="site-footer">
      <button
        type="button"
        className={`site-footer-totop${showTop ? ' is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        tabIndex={showTop ? 0 : -1}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="site-footer-info">
        <div className="site-footer-info-item">
          <span className="site-footer-label">{t('footer', 'info', 'label_address')}</span>
          <p>{t('footer', 'info', 'address')}</p>
        </div>
        <div className="site-footer-info-item">
          <span className="site-footer-label">{t('footer', 'info', 'label_email')}</span>
          <p>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </div>
        <div className="site-footer-info-item">
          <span className="site-footer-label">{t('footer', 'info', 'label_hotline')}</span>
          <p>{t('footer', 'info', 'hotline')}</p>
        </div>

        <div className="site-footer-help">
          <span>{t('footer', 'info', 'help_text')}</span>
          <Button to="/contact-faq" variant="outline" className="site-footer-help-cta">
            {t('footer', 'info', 'help_cta')}
          </Button>
        </div>
      </div>

      <div className="site-footer-brand">
        <span className="site-footer-wordmark">{t('footer', 'brand', 'wordmark')}</span>
        <p className="site-footer-tagline">{t('footer', 'brand', 'tagline')}</p>

        <div className="site-footer-social">
          {socialIcons.map((icon) => (
            <a
              className="site-footer-social-icon"
              key={icon.label}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.label}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={icon.path} fill="currentColor" />
              </svg>
            </a>
          ))}
        </div>

        <nav className="site-footer-nav" aria-label="Footer">
          {footerNavLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="site-footer-copyright">
        {t('footer', 'brand', 'copyright').replace('{year}', new Date().getFullYear())}
      </p>
    </footer>
  )
}

export default Footer
