import { useEffect, useMemo, useRef, useState } from 'react'
import './DatePicker.css'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const pad = (n) => String(n).padStart(2, '0')
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseISO = (s) => {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}
const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const formatDisplay = (d) => `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`

function buildGrid(year, month) {
  const first = new Date(year, month, 1)
  const start = new Date(first)
  const dow = (first.getDay() + 6) % 7
  start.setDate(1 - dow)

  const days = []
  const cur = new Date(start)
  for (let i = 0; i < 42; i += 1) {
    days.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

function DatePicker({ value, onChange, placeholder = 'yyyy-mm-dd', min, max, invalid = false, id }) {
  const selected = useMemo(() => parseISO(value), [value])
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const base = selected || today
    return { year: base.getFullYear(), month: base.getMonth() }
  })
  const [yearMode, setYearMode] = useState(false)
  const { year: viewYear, month: viewMonth } = view

  const wrapRef = useRef(null)
  const minDate = useMemo(() => parseISO(min), [min])
  const maxDate = useMemo(() => parseISO(max), [max])

  const openPanel = () => {
    const base = selected || today
    setView({ year: base.getFullYear(), month: base.getMonth() })
    setYearMode(false)
    setOpen(true)
  }
  const togglePanel = () => (open ? setOpen(false) : openPanel())

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

  const grid = useMemo(() => buildGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const shiftMonth = (delta) => {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  const outOfRange = (d) => (minDate && d < minDate) || (maxDate && d > maxDate)

  const pick = (d) => {
    if (outOfRange(d)) return
    onChange(toISO(d))
    setOpen(false)
  }

  const clear = () => {
    onChange('')
    setOpen(false)
  }

  const goToday = () => {
    if (outOfRange(today)) return
    onChange(toISO(today))
    setOpen(false)
  }

  const years = useMemo(() => {
    const base = viewYear - 6
    return Array.from({ length: 12 }, (_, i) => base + i)
  }, [viewYear])

  return (
    <div className="datepicker" ref={wrapRef}>
      <button
        id={id}
        type="button"
        className={`datepicker-trigger${invalid ? ' is-invalid' : ''}${selected ? '' : ' is-placeholder'}`}
        onClick={togglePanel}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{selected ? formatDisplay(selected) : placeholder}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="datepicker-panel" role="dialog">
          <div className="datepicker-head">
            <button
              type="button"
              className="datepicker-month-label"
              onClick={() => setYearMode((v) => !v)}
            >
              {MONTHS[viewMonth]} {viewYear}
            </button>
            <div className="datepicker-nav">
              <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)}>‹</button>
              <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)}>›</button>
            </div>
          </div>

          {yearMode ? (
            <div className="datepicker-year-grid">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={y === viewYear ? 'is-selected' : ''}
                  onClick={() => {
                    setView((v) => ({ ...v, year: y }))
                    setYearMode(false)
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="datepicker-weekdays">
                {WEEKDAYS.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </div>
              <div className="datepicker-days">
                {grid.map((d, i) => {
                  const inMonth = d.getMonth() === viewMonth
                  const isSelected = isSameDay(d, selected)
                  const isToday = isSameDay(d, today)
                  const disabled = outOfRange(d)
                  return (
                    <button
                      key={i}
                      type="button"
                      className={[
                        'datepicker-day',
                        inMonth ? '' : 'is-outside',
                        isSelected ? 'is-selected' : '',
                        isToday && !isSelected ? 'is-today' : '',
                      ].filter(Boolean).join(' ')}
                      disabled={disabled}
                      onClick={() => pick(d)}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <div className="datepicker-footer">
            <button type="button" className="datepicker-link" onClick={clear}>Clear</button>
            <button
              type="button"
              className="datepicker-link"
              onClick={goToday}
              disabled={outOfRange(today)}
              style={outOfRange(today) ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
