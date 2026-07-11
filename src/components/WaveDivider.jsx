import './WaveDivider.css'

function WaveDivider({ fill = 'var(--color-white)' }) {
  return (
    <svg
      className="wave-divider"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,30 C150,60 300,0 450,30 C600,60 750,0 900,30 C1050,60 1150,15 1200,30 L1200,60 L0,60 Z"
        fill={fill}
      />
    </svg>
  )
}

export default WaveDivider
