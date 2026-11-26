import { useEffect, useMemo, useRef, useState } from 'react'
import './Select.css'

function Select({
  value,
  onChange,
  options,
  placeholder = 'Select',
  invalid = false,
  id,
}) {
  const [open, setOpen] = useState(false)
  const [focusIdx, setFocusIdx] = useState(-1)
  const wrapRef = useRef(null)
  const listRef = useRef(null)

  const selected = useMemo(
    () => options.find((o) => o.value === value) || null,
    [options, value],
  )

  const openList = () => {
    const idx = options.findIndex((o) => o.value === value)
    setFocusIdx(idx >= 0 ? idx : 0)
    setOpen(true)
  }
  const toggleList = () => (open ? setOpen(false) : openList())

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open || focusIdx < 0) return
    const el = listRef.current?.children?.[focusIdx]
    el?.scrollIntoView({ block: 'nearest' })
  }, [focusIdx, open])

  const pick = (v) => {
    onChange(v)
    setOpen(false)
  }

  const onKey = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIdx((i) => Math.min(options.length - 1, i + 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIdx((i) => Math.max(0, i - 1))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (focusIdx >= 0) pick(options[focusIdx].value)
    }
  }

  return (
    <div className="select" ref={wrapRef}>
      <button
        id={id}
        type="button"
        className={`select-trigger${invalid ? ' is-invalid' : ''}${selected ? '' : ' is-placeholder'}`}
        onClick={toggleList}
        onKeyDown={onKey}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="select-list" role="listbox" ref={listRef}>
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={[
                'select-option',
                opt.value === value ? 'is-selected' : '',
                i === focusIdx ? 'is-focus' : '',
              ].filter(Boolean).join(' ')}
              onMouseEnter={() => setFocusIdx(i)}
              onClick={() => pick(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
