import { Link } from 'react-router-dom'
import './Button.css'

function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) {
  const classes = `btn btn-${variant}${className ? ` ${className}` : ''}`

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
