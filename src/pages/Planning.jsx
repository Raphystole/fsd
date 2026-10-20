import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gauge,
  ShieldCheck,
  Users,
} from 'lucide-react'
import Papa from 'papaparse'
import '../App.css'

const getWeek = (offset = 0) => {
    const today = new Date()
    const day = today.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
  
    const monday = new Date(today)
    monday.setDate(today.getDate() + diffToMonday + offset * 7)
  
    return Array.from({ length: 7 }, (_, index) => {
      const currentDay = new Date(monday)
      currentDay.setDate(monday.getDate() + index)
  
      return {
        today : today,
        date: currentDay,
        weekday: currentDay
          .toLocaleDateString('fr-FR', { weekday: 'short' })
          .replace('.', '')
          .toUpperCase(),
        dateNumber: currentDay
          .getDate()
          .toString()
          .padStart(2, '0'),
        dateSmall: currentDay
          .toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            })
          .replace('.', '')
          .toUpperCase()
      }
    })
  }

//const days = getCurrentWeek(weekOffset)

/*
const days = [
  { weekday: 'LUN', date: '21' },
  { weekday: 'MAR', date: '22' },
  { weekday: 'MER', date: '23' },
  { weekday: 'JEU', date: '24' },
  { weekday: 'VEN', date: '25' },
  { weekday: 'SAM', date: '26' },
  { weekday: 'DIM', date: '27' },
]
  */

const teams = [
  { id: 'a', name: 'Équipe A', lead: 'M. Laurent', people: 6, color: '#146ef5' },
  { id: 'b', name: 'Équipe B', lead: 'S. Costa', people: 5, color: '#ff5b2e' },
  { id: 'c', name: 'Équipe C', lead: 'N. Diallo', people: 6, color: '#8d5cf6' },
  { id: 'vsd', name: 'Équipe VSD', lead: 'A. Martin', people: 4, color: '#0a9f74' },
]

const shifts = {
  a: [
    { label: 'Matin', time: '05:00 — 13:00' }, { label: 'Matin', time: '05:00 — 13:00' },
    { label: 'Matin', time: '05:00 — 13:00' }, { label: 'Matin', time: '05:00 — 13:00' },
    { label: 'Matin', time: '05:00 — 13:00' }, null, null,
  ],
  b: [
    { label: 'Après-midi', time: '13:00 — 21:00' }, { label: 'Après-midi', time: '13:00 — 21:00' },
    { label: 'Après-midi', time: '13:00 — 21:00' }, { label: 'Après-midi', time: '13:00 — 21:00' },
    { label: 'Après-midi', time: '13:00 — 21:00' }, null, null,
  ],
  c: [
    { label: 'Nuit', time: '21:00 — 05:00' }, { label: 'Nuit', time: '21:00 — 05:00' },
    { label: 'Nuit', time: '21:00 — 05:00' }, { label: 'Nuit', time: '21:00 — 05:00' },
    { label: 'Nuit', time: '21:00 — 05:00' }, null, null,
  ],
  vsd: [null, null, null, null,
    { label: 'VSD', time: '17:00 — 05:00' }, { label: 'VSD', time: '17:00 — 05:00' }, { label: 'VSD', time: '17:00 — 05:00' },
  ],
}

const technicians = [
  { id: 'a1', name: 'Marc Laurent', initials: 'ML', role: 'Chef d’équipe', teamId: 'a' },
  { id: 'a2', name: 'Hugo Bernard', initials: 'HB', role: 'Électromécanicien', teamId: 'a' },
  { id: 'a3', name: 'Léa Robert', initials: 'LR', role: 'Automaticienne', teamId: 'a' },
  { id: 'a4', name: 'Thomas Petit', initials: 'TP', role: 'Mécanicien', teamId: 'a' },
  { id: 'a5', name: 'Inès Roux', initials: 'IR', role: 'Technicienne méthodes', teamId: 'a' },
  { id: 'a6', name: 'Julien Moreau', initials: 'JM', role: 'Électricien', teamId: 'a' },
  { id: 'b1', name: 'Sarah Costa', initials: 'SC', role: 'Cheffe d’équipe', teamId: 'b' },
  { id: 'b2', name: 'Karim Benali', initials: 'KB', role: 'Électromécanicien', teamId: 'b' },
  { id: 'b3', name: 'Chloé Simon', initials: 'CS', role: 'Automaticienne', teamId: 'b' },
  { id: 'b4', name: 'Lucas Michel', initials: 'LM', role: 'Mécanicien', teamId: 'b' },
  { id: 'b5', name: 'Emma Fontaine', initials: 'EF', role: 'Électricienne', teamId: 'b' },
  { id: 'c1', name: 'Nabil Diallo', initials: 'ND', role: 'Chef d’équipe', teamId: 'c' },
  { id: 'c2', name: 'Pauline Leroy', initials: 'PL', role: 'Électromécanicienne', teamId: 'c' },
  { id: 'c3', name: 'Antoine Garcia', initials: 'AG', role: 'Automaticien', teamId: 'c' },
  { id: 'c4', name: 'Sofia Nguyen', initials: 'SN', role: 'Mécanicienne', teamId: 'c' },
  { id: 'c5', name: 'Romain Dubois', initials: 'RD', role: 'Technicien méthodes', teamId: 'c' },
  { id: 'c6', name: 'Camille Perrin', initials: 'CP', role: 'Électricienne', teamId: 'c' },
  { id: 'v1', name: 'Alice Martin', initials: 'AM', role: 'Cheffe d’équipe', teamId: 'vsd' },
  { id: 'v2', name: 'Mehdi El Amrani', initials: 'ME', role: 'Électromécanicien', teamId: 'vsd' },
  { id: 'v3', name: 'Manon Lefèvre', initials: 'ML', role: 'Automaticienne', teamId: 'vsd' },
  { id: 'v4', name: 'Baptiste Girard', initials: 'BG', role: 'Mécanicien', teamId: 'vsd' },
]
import * as XLSX from 'xlsx'

const XLSX_URL =
  'https://docs.google.com/spreadsheets/d/1UYQFHYg5YOIV-nhL14_cTz8Rnhn9Ec2obnFE42HsS_o/export?format=xlsx'

  function getSheetName(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
  
    return `${month}${year}`
  }

  async function loadPlanning(date) {
    const response = await fetch(XLSX_URL)
  
    if (!response.ok) {
      throw new Error('Impossible de charger le planning')
    }
  
    const buffer = await response.arrayBuffer()
  
    const workbook = XLSX.read(buffer, {
      type: 'array',
    })
  
    const sheetName = getSheetName(date)
    const sheet = workbook.Sheets[sheetName]
  
    if (!sheet) {
      throw new Error(`Onglet ${sheetName} introuvable`)
    }
  
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      raw: false,
    })
  
    return rows
  }

const rows = await loadPlanning(new Date())

console.log("test")
console.log(rows)

const normalize = value => (value ?? '').trim()

function formatSheetDate(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
  
    return `${day}/${month}/${year}`
  }

  
function parseTimeRange(value) {
    const text = normalize(value)
  
    const match = text.match(
      /(\d{1,2})(?:h(\d{2}))?\s*[-/–—]\s*(\d{1,2})(?:h(\d{2}))?/i
    )
  
    if (!match) return null
  
    return {
      start: formatTime(match[1], match[2]),
      end: formatTime(match[3], match[4]),
    }
  }

  function formatTime(hour, minute = '00') {
    return `${String(Number(hour)).padStart(2, '0')}:${minute || '00'}`
  }
  

function getMaintenanceForDate(rows, targetDate) {
    // Find the row containing the requested date
    const dateRowIndex = rows.findIndex(
      row => normalize(row[0]) === formatSheetDate(targetDate)
    )
  
    if (dateRowIndex === -1) {
      return []
    }

    const shifts = {
        1: {interval: rows[dateRowIndex-2][4]},
        2: {interval: rows[dateRowIndex-2][5]},
        3: {interval: rows[dateRowIndex-2][6]}
    }

    const values = rows.slice(dateRowIndex, dateRowIndex + 34).map(row => row.slice(3, 7))

    const parseInterval = (interval) => {
        const match = interval.match(
          /(\d{1,2})h(?:\d{2})?\s*-\s*(\d{1,2})h(?:\d{2})?/i
        )
      
        if (!match) {
          return {
            start: null,
            end: null
          }
        }
      
        return {
          startHour: Number(match[1]),
          endHour: Number(match[2])
        }
      }

    const maintenance = values.flatMap(row => {
        const type = row[0]?.trim()

        if (!type?.startsWith("Maintenance")) {
            return []
        }

        const customInterval = type
            .replace("Maintenance", "")
            .trim()

        return row.slice(1).flatMap((name, index) => {
            if (!name?.trim()) {
                return []
            }

            const interval = customInterval || shifts[index + 1]?.interval
            const { startHour, endHour } = parseInterval(interval)

            const start = new Date(targetDate)
            const end = new Date(targetDate)

            if(startHour>endHour){
                start.setDate(targetDate.getDate() - 1)
                start.setHours(startHour)
            }
            else{
                start.setHours(startHour)
            }
            end.setHours(endHour)

            return [{
            name: name.trim(),
            start,
            end
            }]
        })
        })
        
    console.log(maintenance)
    
    return maintenance
  }

const date = new Date("2026-09-30")
const maintenance = getMaintenanceForDate(
    rows,
    date
)

function Planning() {
    const [weekOffset, setWeekOffset] = useState(0)

    const days = useMemo(() => {
        return getWeek(weekOffset)
    }, [weekOffset])

    const maintenance = useMemo(() => {
        return days.flatMap(day => {
          const rows = loadPlanning(day.date)
      
          return getMaintenanceForDate(
            rows,
            day.date
          )
        })
      }, [days])

      const peoplePlanning = useMemo(() => {
        const people = new Map()
      
        for (const item of maintenance) {
          if (!people.has(item.name)) {
            people.set(item.name, [])
          }
      
          people.get(item.name).push(item)
        }
      
        return Array.from(
          people,
          ([name, slots]) => ({
            name,
            slots: slots.sort(
              (a, b) => a.start - b.start
            ),
          })
        ).sort((a, b) =>
          a.name.localeCompare(b.name, 'fr')
        )
      }, [maintenance])

    console.log(peoplePlanning)
  const [mode, setMode] = useState('Semaine')
  const weekLabel = useMemo(() => '21 — 27 septembre 2026', [])
  const coverage = [
    { start: 'Lun. 00:00', end: 'Lun. 13:00', count: 6, hours: 13 },
    { start: 'Lun. 13:00', end: 'Lun. 21:00', count: 5, hours: 8, active: true },
    { start: 'Lun. 21:00', end: 'Mar. 13:00', count: 6, hours: 16 },
    { start: 'Mar. 13:00', end: 'Mar. 21:00', count: 5, hours: 8 },
    { start: 'Mar. 21:00', end: 'Mer. 13:00', count: 6, hours: 16 },
    { start: 'Mer. 13:00', end: 'Mer. 21:00', count: 5, hours: 8 },
    { start: 'Mer. 21:00', end: 'Jeu. 13:00', count: 6, hours: 16 },
    { start: 'Jeu. 13:00', end: 'Jeu. 21:00', count: 5, hours: 8 },
    { start: 'Jeu. 21:00', end: 'Ven. 13:00', count: 6, hours: 16 },
    { start: 'Ven. 13:00', end: 'Ven. 17:00', count: 5, hours: 4 },
    { start: 'Ven. 17:00', end: 'Ven. 21:00', count: 9, hours: 4 },
    { start: 'Ven. 21:00', end: 'Sam. 05:00', count: 10, hours: 8 },
    { start: 'Sam. 05:00', end: 'Sam. 17:00', count: 0, hours: 12, gap: true },
    { start: 'Sam. 17:00', end: 'Dim. 05:00', count: 4, hours: 12 },
    { start: 'Dim. 05:00', end: 'Dim. 17:00', count: 0, hours: 12, gap: true },
    { start: 'Dim. 17:00', end: 'Lun. 00:00', count: 4, hours: 7 },
  ]
  return (
    <div className="page planning-page">
      <section>
        <div className="eyebrow"><strong>ORGANISATION DES ÉQUIPES</strong></div>
      </section>
      <section className="planning-section">
        <div className="planning-actions">
          <div className="view-toggle" aria-label="Période affichée">
            {['Jour', 'Semaine', 'Mois'].map(item => <button key={item} className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>{item}</button>)}
          </div>
          <button className="outline-button">Gérer les équipes <ArrowUpRight size={17} /></button>
        </div>

        <div className="schedule-toolbar">
          <div className="week-nav">
            <button aria-label="Semaine précédente" onClick={() => setWeekOffset(prev => prev - 1)}><ChevronLeft size={19} /></button>
            <strong>{days[0].dateSmall} - {days.at(-1).dateSmall}</strong>
            <button aria-label="Semaine suivante" onClick={() => setWeekOffset(prev => prev + 1)}><ChevronRight size={19} /></button></div>
          <div className="legend"><span><i className="legend-dot morning" />Matin</span><span><i className="legend-dot afternoon" />Après-midi</span><span><i className="legend-dot night" />Nuit</span><span><i className="legend-dot vsd" />VSD</span></div>
        </div>

        <div className="scroll-hint"><span>21 personnes · semaine complète</span><span>Lundi → dimanche</span></div>
        <div className="schedule-wrap" tabIndex="0" aria-label="Planning individuel de la semaine complète">
          <div className="schedule-grid">
            <div className="schedule-corner"><span>PERSONNES</span><small>Nom et équipe</small></div>
            {days.map(
                (day, index) =>
                <div 
                    className={`day-head ${day.today.toDateString() === day.date.toDateString() ? 'today' : ''}`}
                    key={day.dateNumber}
                >
                    <span>{day.weekday}</span>
                    <strong>{day.dateNumber}</strong>
                    {day.today.toDateString() === day.date.toDateString() && <i>AUJ.</i>}
                </div>
            )}
            <div className="coverage-label"><span>PRÉSENCE</span><small>Effectif continu · 168 h</small></div>
            <div className="coverage-timeline" aria-label="Évolution continue de l’effectif sur la semaine">
              {coverage.map(segment => (
                <span
                  className={`coverage-segment ${segment.active ? 'active' : ''} ${segment.gap ? 'gap' : ''}`}
                  style={{ '--duration': segment.hours }}
                  title={`${segment.start} — ${segment.end} : ${segment.count} personne${segment.count > 1 ? 's' : ''}`}
                  aria-label={`${segment.start} à ${segment.end}, ${segment.count} personne${segment.count > 1 ? 's' : ''}`}
                  key={`${segment.start}-${segment.end}`}
                >
                  <strong>{segment.count}</strong>
                </span>
              ))}
            </div>
            {technicians.map(person => {
              const team = teams.find(item => item.id === person.teamId)
              return (
              <div className="schedule-row" key={person.id}>
                <div className="person-cell">
                  <span className="person-avatar" style={{ background: team.color }}>{person.initials}</span>
                  <div><strong>{person.name}</strong><small>{person.role} · {team.name}</small></div>
                </div>
                {shifts[person.teamId].map((shift, index) => (
                  <div className={`shift-cell ${index > 4 ? 'weekend' : ''}`} key={index}>
                    {shift ? <button className={`shift-pill ${person.teamId}`}><strong>{shift.label}</strong><span>{shift.time}</span></button> : <span className="rest">REPOS</span>}
                  </div>
                ))}
              </div>
            )})}
          </div>
        </div>

        <div className="planning-summary">
          <div><Gauge size={21} /><span>Couverture semaine</span><strong>100%</strong></div>
          <div><ShieldCheck size={21} /><span>Conformité repos</span><strong>OK</strong></div>
          <div><Users size={21} /><span>Heures planifiées</span><strong>824 h</strong></div>
          <p>Planning de démonstration · Les règles de rotation seront configurables dans la prochaine version.</p>
        </div>
      </section>
    </div>
  )
}

export default Planning