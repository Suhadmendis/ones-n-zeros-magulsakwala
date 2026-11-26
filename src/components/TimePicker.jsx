import { useEffect, useMemo, useRef, useState } from 'react'
import './TimePicker.css'

const pad = (n) => String(n).padStart(2, '0')
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i))
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i))

function parseValue(v) {
  if (!v) return { h: null, m: null }
  const [h, m] = v.split(':')
  return { h: h || null, m: m || null }
}

function TimePicker({ value, onChange, placeholder = '--:--', invalid = false, id }) {
  const [open, setOpen] = useState(false)
  const { h, m } = useMemo(() => parseValue(value), [value])
  const wrapRef = useRef(null)
  const hourColRef = useRef(null)
  const minColRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const scrollTo = (container, selector) => {
      const el = container?.querySelector(selector)
      if (el && container) container.scrollTop = el.offsetTop - container.offsetTop
    }
    scrollTo(hourColRef.current, '.is-selected')
    scrollTo(minColRef.current, '.is-selected')
  }, [open])

  const pick = (nextH, nextM) => {
    const hh = nextH ?? h ?? '12'
    const mm = nextM ?? m ?? '00'
    onChange(`${hh}:${mm}`)
  }

  const clear = () => {
    onChange('')
    setOpen(false)
  }

  return (
    <div className="timepicker" ref={wrapRef}>
      <button
        id={id}
        type="button"
        className={`timepicker-trigger${invalid ? ' is-invalid' : ''}${value ? '' : ' is-placeholder'}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="timepicker-panel" role="dialog">
          <div className="timepicker-columns">
            <div className="timepicker-column" ref={hourColRef}>
              {HOURS.map((hh) => (
                <button
                  key={hh}
                  type="button"
                  className={`timepicker-cell${hh === h ? ' is-selected' : ''}`}
                  onClick={() => pick(hh, null)}
                >
                  {hh}
                </button>
              ))}
            </div>
            <div className="timepicker-sep">:</div>
            <div className="timepicker-column" ref={minColRef}>
              {MINUTES.map((mm) => (
                <button
                  key={mm}
                  type="button"
                  className={`timepicker-cell${mm === m ? ' is-selected' : ''}`}
                  onClick={() => pick(null, mm)}
                >
                  {mm}
                </button>
              ))}
            </div>
          </div>

          <div className="timepicker-footer">
            <button type="button" className="timepicker-link" onClick={clear}>Clear</button>
            <button type="button" className="timepicker-link" onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimePicker
