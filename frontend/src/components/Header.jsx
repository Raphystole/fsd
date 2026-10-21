import { useEffect, useState } from 'react'
import {
  Bell,
  Menu,
  Search,
} from 'lucide-react'
import '../App.css'

function Header({ onMenu }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 30_000)

    return () => clearInterval(interval)
  }, [])

  const date = now
    .toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
    })
    .toUpperCase()
  
  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Ouvrir le menu"><Menu size={20} /></button>
      <div className="site-status">Fonderies de Saint-Dizier <span className="separator">/</span> Maintenance</div>
      <div className="header-actions">
        <div className="header-date"><span className="status-dot" />{date} · {time}</div>
        <button className="search-button"><Search size={17} /><span>Rechercher</span></button>
        <button className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button>
      </div>
    </header>
  )
}

export default Header