import Card from '../components/Card'
import WaveDivider from '../components/WaveDivider'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema.js'
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
      <Seo
        path="/privacy-trust"
        title="Privacy & Trust"
        description="How Magul Sakwala protects your marriage proposal data — private profiles, family-only sharing, approval before contact."
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Privacy & Trust', path: '/privacy-trust' },
          ]),
        ]}
      />
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
