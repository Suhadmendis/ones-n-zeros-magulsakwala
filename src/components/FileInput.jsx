import { useEffect, useMemo, useRef } from 'react'
import './FileInput.css'

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileInput({
  value,
  onChange,
  accept = 'image/*',
  invalid = false,
  id,
  hint = 'PNG or JPG, up to 5 MB',
  emptyLabel = 'Upload photo',
}) {
  const inputRef = useRef(null)
  const preview = useMemo(() => {
    if (!value || !value.type?.startsWith('image/')) return null
    return URL.createObjectURL(value)
  }, [value])

  useEffect(() => {
    if (!preview) return undefined
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const handlePick = (e) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    e.target.value = ''
  }

  const openPicker = () => inputRef.current?.click()

  const clear = () => {
    if (!window.confirm('Remove this photo?')) return
    onChange(null)
  }

  return (
    <div className={`fileinput${invalid ? ' is-invalid' : ''}`}>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handlePick}
        className="fileinput-native"
      />

      {value ? (
        <div className="fileinput-selected">
          {preview ? (
            <img src={preview} alt="" className="fileinput-thumb" />
          ) : (
            <div className="fileinput-thumb fileinput-thumb-fallback" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"
                  stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
                />
                <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          <div className="fileinput-meta">
            <span className="fileinput-name" title={value.name}>{value.name}</span>
            <span className="fileinput-size">{formatSize(value.size)}</span>
          </div>

          <div className="fileinput-actions">
            <button type="button" className="fileinput-action" onClick={openPicker}>Replace</button>
            <button type="button" className="fileinput-action is-danger" onClick={clear}>Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" className="fileinput-empty" onClick={openPicker}>
          <span className="fileinput-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="fileinput-empty-text">
            <span className="fileinput-empty-title">{emptyLabel}</span>
            <span className="fileinput-empty-hint">{hint}</span>
          </span>
        </button>
      )}
    </div>
  )
}

export default FileInput
