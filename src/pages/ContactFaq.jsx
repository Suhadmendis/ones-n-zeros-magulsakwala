import Button from '../components/Button'
import Card from '../components/Card'
import { useContent } from '../hooks/useContent.js'
import './ContactFaq.css'

function ContactFaq() {
  const { t } = useContent()

  const faqs = [1, 2, 3].map((n) => ({
    key: `faq_${n}`,
    q: t('contact-faq', 'faqs', `q${n}`),
    a: t('contact-faq', 'faqs', `a${n}`),
  }))

  const contactEmail = t('contact-faq', 'contact', 'email')

  return (
    <>
      <section className="cf-intro">
        <h1>{t('contact-faq', 'intro', 'heading')}</h1>
        <p>{t('contact-faq', 'intro', 'subtext')}</p>
      </section>

      <section className="cf-faqs">
        {faqs.map((item) => (
          <Card key={item.key} className="cf-card">
            <h2>{item.q}</h2>
            <p>{item.a}</p>
          </Card>
        ))}
      </section>

      <section className="cf-contact">
        <h2>{t('contact-faq', 'contact', 'heading')}</h2>
        <p>{t('contact-faq', 'contact', 'subtext')}</p>
        <Button href={`mailto:${contactEmail}`} variant="outline">
          Email {contactEmail}
        </Button>
      </section>
    </>
  )
}

export default ContactFaq
