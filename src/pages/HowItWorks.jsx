import Badge from '../components/Badge'
import Button from '../components/Button'
import WaveDivider from '../components/WaveDivider'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema.js'
import { useContent } from '../hooks/useContent.js'
import './HowItWorks.css'

function HowItWorks() {
  const { t } = useContent()

  const steps = [1, 2, 3, 4, 5].map((n) => ({
    key: `step_${n}`,
    title: t('how-it-works', 'steps', `step_${n}_title`),
    body: t('how-it-works', 'steps', `step_${n}_body`),
  }))

  return (
    <>
      <Seo
        path="/how-it-works"
        title="How Magul Sakwala Works"
        description="Step-by-step guide to our private Sri Lankan matchmaking process: register, private review, family contact, mutual consent, introduction."
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'How It Works', path: '/how-it-works' },
          ]),
        ]}
      />
      <section className="hiw-intro">
        <h1>{t('how-it-works', 'intro', 'heading')}</h1>
        <p>{t('how-it-works', 'intro', 'subtext')}</p>
      </section>

      <div className="hiw-wave">
        <WaveDivider fill="var(--color-white)" />
      </div>

      <section className="hiw-steps">
        {steps.map((step, index) => (
          <div className="hiw-step" key={step.key}>
            <Badge>{index + 1}</Badge>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="hiw-cta">
        <h2>{t('how-it-works', 'cta', 'heading')}</h2>
        <Button to="/register">{t('how-it-works', 'cta', 'cta_register')}</Button>
      </section>
    </>
  )
}

export default HowItWorks
