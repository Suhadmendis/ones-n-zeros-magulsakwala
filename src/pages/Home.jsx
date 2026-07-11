import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import ImagePlaceholder from '../components/ImagePlaceholder'
import heroImage from '../assets/home/anangayalk-home-banner.jpg'
import welcomeIllustration from '../assets/home/illutration.png'
import { useContent } from '../hooks/useContent.js'
import './Home.css'

function Home() {
  const { t } = useContent()

  const heroSteps = ['step_1', 'step_2', 'step_3'].map((key) => ({
    key,
    label: t('home', 'hero', key),
  }))
  const trustPrinciples = [1, 2, 3].map((n) => ({
    key: `card_${n}`,
    title: t('home', 'trust', `card_${n}_title`),
    body: t('home', 'trust', `card_${n}_body`),
  }))

  return (
    <>
      <section className="home-hero">
        <img
          className="home-hero-bg"
          src={heroImage}
          width={1920}
          height={1080}
          alt=""
          aria-hidden="true"
        />
        <div className="home-hero-scrim" aria-hidden="true" />

        <div className="home-hero-card">
          <h1>{t('home', 'hero', 'headline')}</h1>
          <p>{t('home', 'hero', 'subtext')}</p>
          <Button to="/register">{t('home', 'hero', 'cta_register')}</Button>
        </div>

        <div className="home-hero-steps">
          <div className="home-hero-steps-label">
            <span className="home-hero-steps-eyebrow">{t('home', 'hero', 'eyebrow_steps')}</span>
            <p>{t('home', 'hero', 'steps_subtitle')}</p>
          </div>
          <ol className="home-hero-steps-list">
            {heroSteps.map((step, index) => (
              <li key={step.key}>
                <Badge>{index + 1}</Badge>
                <span>{step.label}</span>
              </li>
            ))}
          </ol>
          <Button to="/register" className="home-hero-steps-cta">
            {t('home', 'hero', 'cta_start_now')}
          </Button>
        </div>
      </section>

      <section className="home-welcome">
        <div className="home-welcome-copy">
          <h2 className="home-welcome-greeting">{t('home', 'welcome', 'greeting')}</h2>
          <p className="home-welcome-lede">{t('home', 'welcome', 'lede')}</p>
          <p>{t('home', 'welcome', 'body')}</p>
          <Button to="/register">{t('home', 'welcome', 'cta')}</Button>
        </div>
        <div className="home-welcome-image">
          <img
            src={welcomeIllustration}
            width={654}
            height={630}
            alt="Illustration of a bride and groom celebrating, surrounded by hearts"
          />
        </div>
      </section>

      <section className="home-trust">
        <h2>{t('home', 'trust', 'heading')}</h2>
        <div className="home-trust-grid">
          {trustPrinciples.map((item) => (
            <Card key={item.key}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="home-members">
        <h2>{t('home', 'members', 'heading')}</h2>
        <div className="home-members-row">
          {Array.from({ length: 5 }, (_, i) => (
            <ImagePlaceholder
              key={i}
              width={200}
              height={200}
              shape="circle"
              alt={`member/testimonial thumbnail ${i + 1} — client to provide`}
            />
          ))}
        </div>
      </section>

      <section className="home-teaser">
        <h2>{t('home', 'teaser', 'heading')}</h2>
        <p>{t('home', 'teaser', 'body')}</p>
        <Button to="/how-it-works" variant="outline">
          {t('home', 'teaser', 'cta')}
        </Button>
      </section>
    </>
  )
}

export default Home
