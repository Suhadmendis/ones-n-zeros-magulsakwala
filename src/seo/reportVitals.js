import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

const ENDPOINT = '/api/vitals.php'

function send(metric) {
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
    navigationType: metric.navigationType,
  })
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon(ENDPOINT, blob)
    return
  }
  fetch(ENDPOINT, { method: 'POST', body, keepalive: true }).catch(() => {})
}

export function reportVitals() {
  if (import.meta.env.DEV) return
  onCLS(send)
  onINP(send)
  onLCP(send)
  onFCP(send)
  onTTFB(send)
}
