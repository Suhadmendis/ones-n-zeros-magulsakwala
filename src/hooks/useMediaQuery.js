import { useEffect, useState } from 'react'

// JS-level breakpoint detection for logic that can't be expressed in CSS
// (e.g. conditionally rendering different markup). Prefer CSS media queries
// for show/hide styling — this is not what drives the Header's mobile menu.
export function useMediaQuery(query) {
  const [state, setState] = useState(() => ({ query, matches: window.matchMedia(query).matches }))

  // Re-sync during render if `query` changed since the last render, rather
  // than in an effect — avoids an extra cascading render on query changes.
  if (state.query !== query) {
    setState({ query, matches: window.matchMedia(query).matches })
  }

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event) => setState({ query, matches: event.matches })

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return state.matches
}
