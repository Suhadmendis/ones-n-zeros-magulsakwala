import Card from '../components/Card'
import WaveDivider from '../components/WaveDivider'
import { useContent } from '../hooks/useContent.js'
import './PrivacyTrust.css'

function PrivacyTrust() {
  const { t } = useContent()

  const principles = [1, 2, 3].map((n) => ({
    key: `card_${n}`,
    title: t('privacy-trust', 'principles', `card_${n}_title`),
    body: t('privacy-trust', 'principles', `card_${n}_body`),
  }))

  return (
    <>
      <section className="pt-intro">
        <h1>{t('privacy-trust', 'intro', 'heading')}</h1>
        <p>{t('privacy-trust', 'intro', 'subtext')}</p>
      </section>

      <div className="pt-wave">
        <WaveDivider fill="var(--color-white)" />
      </div>

      <section className="pt-principles">
        {principles.map((item) => (
          <Card key={item.key} className="pt-card">
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </Card>
        ))}
      </section>
    </>
  )
}

export default PrivacyTrust
