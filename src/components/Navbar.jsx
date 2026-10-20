import {
  CalendarDays,
  CircleHelp,
  Factory,
  LayoutDashboard,
  Settings,
  Wrench,
  X,
} from 'lucide-react'
import '../App.css'

const navItems = [
  { id: 'dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'planning', label: 'Planning équipes', icon: CalendarDays },
  { id: 'equipment', label: 'Équipements', icon: Factory, soon: true },
  { id: 'workorders', label: 'Interventions', icon: Wrench, soon: true },
]

function Logo() {
  return (
    <div className="brand" aria-label="Atelier">
      <img src="./public/FSD-logo.png" className="brand-logo"></img>
      <span className="brand-name">FSD</span>
    </div>
  )
}

function Navbar({ active, onNavigate, open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar-top">
        <Logo />
        <button className="icon-button close-nav" onClick={onClose} aria-label="Fermer le menu"><X size={20} /></button>
      </div>
      <nav className="primary-nav" aria-label="Navigation principale">
        <p className="nav-label">ESPACE DE TRAVAIL</p>
        {navItems.map(({ id, label, icon: Icon, soon }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => !soon && onNavigate(id)}
            aria-disabled={soon}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {soon && <span className="soon">BIENTÔT</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item"><Settings size={18} /><span>Paramètres</span></button>
        <button className="nav-item"><CircleHelp size={18} /><span>Centre d’aide</span></button>
        <div className="user-card">
          <div className="avatar">FD</div>
          <div><strong>Flavien Dupont</strong><span>Responsable maintenance</span></div>
        </div>
      </div>
    </aside>
  )
}

export default Navbar