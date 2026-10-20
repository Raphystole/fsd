import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Factory,
  Gauge,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import Navbar from "./components/Navbar"
import Header from "./components/Header"

import Planning from "./pages/Planning"

const teams = [
  { id: 'a', name: 'Équipe A', lead: 'M. Laurent', people: 6, color: '#146ef5' },
  { id: 'b', name: 'Équipe B', lead: 'S. Costa', people: 5, color: '#ff5b2e' },
  { id: 'c', name: 'Équipe C', lead: 'N. Diallo', people: 6, color: '#8d5cf6' },
  { id: 'vsd', name: 'Équipe VSD', lead: 'A. Martin', people: 4, color: '#0a9f74' },
]

function MetricCard({ index, label, value, detail, accent }) {
  return (
    <article className="metric-card">
      <div className="metric-top"><span>{String(index).padStart(2, '0')}</span><span className={`metric-signal ${accent || ''}`} /></div>
      <div><strong>{value}</strong><p>{label}</p><small>{detail}</small></div>
    </article>
  )
}

function MainPage({ onNavigate }) {
  return (
    <div className="page dashboard-page">
      <section className="hero-grid">
        <div className="eyebrow"><span>VUE D'ENSEMBLE</span></div>
        <div className="hero-copy">
          <h1>La maintenance,<br />en mouvement<span className="blue-block">.</span></h1>
          <p>Une vue claire de vos équipes aujourd’hui — avant de piloter demain chaque intervention et chaque équipement.</p>
        </div>
        <div className="hero-side">
          <div className="shift-now">
            <div className="shift-label"><Clock3 size={18} /><span>POSTE EN COURS</span></div>
            <strong>APRÈS-MIDI</strong>
            <span>13:00 — 21:00</span>
            <div className="progress"><i /></div>
            <small>6 h 28 restantes</small>
          </div>
          <button className="primary-cta" onClick={() => onNavigate('planning')}>Ouvrir le planning <ArrowUpRight size={19} /></button>
        </div>
      </section>

      <section className="metrics" aria-label="Indicateurs du jour">
        <MetricCard index={1} value="17" label="Techniciens planifiés" detail="4 équipes mobilisées" />
        <MetricCard index={2} value="08" label="Présents maintenant" detail="Couverture conforme" accent="green" />
        <MetricCard index={3} value="03" label="Interventions en cours" detail="Dont 1 prioritaire" accent="orange" />
        <MetricCard index={4} value="96%" label="Disponibilité atelier" detail="Objectif ≥ 95%" accent="green" />
      </section>

      <section className="today-section">
        <div className="section-heading">
          <div><span className="section-kicker">AUJOURD’HUI</span><h2>Équipes en poste</h2></div>
          <button className="text-button" onClick={() => onNavigate('planning')}>Voir la semaine <ArrowUpRight size={17} /></button>
        </div>
        <div className="team-strip">
          {teams.slice(0, 3).map((team, index) => (
            <article className="team-now" key={team.id}>
              <div className="team-index">0{index + 1}</div>
              <div className="team-line" style={{ background: team.color }} />
              <div className="team-main"><span className="live-badge">{index === 1 ? 'EN POSTE' : index === 0 ? 'TERMINÉ' : 'À VENIR'}</span><h3>{team.name}</h3><p>{index === 0 ? '05:00 — 13:00' : index === 1 ? '13:00 — 21:00' : '21:00 — 05:00'}</p></div>
              <div className="team-meta"><Users size={18} /><strong>{team.people}</strong><span>techniciens</span></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const [navOpen, setNavOpen] = useState(false)
  const navigate = (page) => {
    setActive(page);
    setNavOpen(false)
  }
  const renderPage = () => {
    switch (active) {
      case 'planning':
        return <Planning />

      default:
        return <MainPage onNavigate={navigate} />
    }
  }
  return (
    <div className="app-shell">
      <Navbar active={active} onNavigate={navigate} open={navOpen} onClose={() => setNavOpen(false)} />
      {navOpen && <button className="nav-backdrop" onClick={() => setNavOpen(false)} aria-label="Fermer le menu" />}
      <div className="content-shell">
        <Header onMenu={() => setNavOpen(true)} />
        <main>{renderPage()}</main>
      </div>
    </div>
  )
}

