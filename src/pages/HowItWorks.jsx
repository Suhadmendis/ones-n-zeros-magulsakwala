import Badge from '../components/Badge'
import Button from '../components/Button'
import WaveDivider from '../components/WaveDivider'
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
