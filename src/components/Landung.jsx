import { useCallback, useEffect, useRef, useState } from 'react'
import Element from './Element.jsx'
import { MODI } from '../data/modi.js'
import { TIERE, zufall } from '../data/inhalte.js'
import { klangStarten, spieleTon, sprich, stimmenVorbereiten } from '../klang.js'
import { inhaltFuer } from '../spiellogik.js'

const DEMO_TASTEN = [
  { beschriftung: 'A', modus: 'buchstaben', zeichen: 'a' },
  { beschriftung: 'K', modus: 'buchstaben', zeichen: 'k' },
  { beschriftung: 'Ö', modus: 'buchstaben', zeichen: 'ö' },
  { beschriftung: '4', modus: 'buchstaben', zeichen: '4' },
  { beschriftung: '⭐', modus: 'formen', zeichen: null },
  { beschriftung: '🐘', modus: 'tiere', zeichen: null },
]

// Feste Plaetze in der Vorschau-Buehne, damit sich nichts stapelt.
const DEMO_PLAETZE = [
  { x: 26, y: 40 },
  { x: 62, y: 62 },
  { x: 78, y: 36 },
  { x: 42, y: 66 },
  { x: 50, y: 34 },
]

const SCHRITTE = [
  {
    symbol: '1',
    titel: 'Modus auswählen',
    text: 'Buchstaben, Formen, Tiere, Malen oder alles gemischt – ein Tipp genügt.',
  },
  {
    symbol: '2',
    titel: 'Kind ranlassen',
    text: 'Vollbild startet, alle Tastenkürzel sind abgefangen. Jetzt darf gehämmert werden.',
  },
  {
    symbol: '3',
    titel: 'Ruhig zuschauen',
    text: 'Zum Beenden Esc zwei Sekunden lang gedrückt halten – oder die rechte untere Ecke ebenso lange.',
  },
]

const SICHERHEIT = [
  {
    symbol: '🛡️',
    titel: 'Tasten sind abgefangen',
    text: 'Keine versehentlich geschlossenen Fenster, keine verstellten Einstellungen, kein Tippen in andere Programme.',
  },
  {
    symbol: '🔒',
    titel: 'Elternsperre',
    text: 'Das Menü öffnet sich erst, wenn man zwei Sekunden lang hält – für kleine Finger praktisch nicht zu treffen.',
  },
  {
    symbol: '🚫',
    titel: 'Keine Werbung, keine Links',
    text: 'Nichts blinkt, nichts will verkauft werden, nichts führt woanders hin.',
  },
  {
    symbol: '🔌',
    titel: 'Läuft ohne Internet',
    text: 'Alles passiert im Browser. Es werden keine Daten gespeichert oder gesendet.',
  },
]

const FRAGEN = [
  {
    frage: 'Ab welchem Alter passt das?',
    antwort:
      'Ab etwa einem Jahr, weil schon ein einzelner Tastendruck etwas auslöst. Für Kindergartenkinder sind die Buchstaben- und Zahlenansagen spannend, weil sie dabei erste Wörter mitlesen können.',
  },
  {
    frage: 'Funktioniert es auf dem Tablet?',
    antwort:
      'Ja. Ein Tipp wirkt genauso wie ein Mausklick, und im Malmodus zieht der Finger die Spur. Weil es dort keine Esc-Taste gibt, öffnet sich das Elternmenü auch, wenn man die rechte untere Ecke zwei Sekunden lang gedrückt hält.',
  },
  {
    frage: 'Warum hört man keine Sprache?',
    antwort:
      'Die Ansagen nutzen die deutsche Stimme des Geräts. Fehlt sie oder ist sie nicht installiert, bleibt es bei den Klängen – alles andere funktioniert weiter. Auf dem Handy hilft es oft, den Stumm-Schalter zu prüfen.',
  },
  {
    frage: 'Kann mein Kind etwas kaputtmachen?',
    antwort:
      'Nein. Es gibt nichts zu löschen, nichts zu kaufen und nichts zu verschicken. Im schlimmsten Fall ist der Bildschirm voller Sterne.',
  },
]

// Blendet Abschnitte beim Hereinscrollen sanft ein.
function useSichtbar() {
  const ref = useRef(null)
  const [sichtbar, setSichtbar] = useState(false)

  useEffect(() => {
    const knoten = ref.current
    if (!knoten) return
    if (typeof IntersectionObserver === 'undefined') {
      setSichtbar(true)
      return
    }
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          setSichtbar(true)
          beobachter.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    beobachter.observe(knoten)
    return () => beobachter.disconnect()
  }, [])

  return [ref, sichtbar]
}

function Abschnitt({ children, ...rest }) {
  const [ref, sichtbar] = useSichtbar()
  return (
    <section ref={ref} className={'l-abschnitt' + (sichtbar ? ' sichtbar' : '')} {...rest}>
      {children}
    </section>
  )
}

export default function Landung({ aufWeiter }) {
  const [demoElemente, setDemoElemente] = useState([])
  const [demoTon, setDemoTon] = useState(true)
  const naechsteId = useRef(1)
  const demoTonRef = useRef(demoTon)
  demoTonRef.current = demoTon

  const demoSpielen = useCallback((modus, zeichen) => {
    klangStarten()
    stimmenVorbereiten()
    const inhalt = inhaltFuer(modus, zeichen)
    if (demoTonRef.current) {
      spieleTon(inhalt.tonStufe)
      sprich(inhalt.sprache)
    }
    const platz = DEMO_PLAETZE[naechsteId.current % DEMO_PLAETZE.length]
    const neues = {
      id: naechsteId.current++,
      x: platz.x,
      y: platz.y,
      drehung: -10 + Math.random() * 20,
      groesse: 0.4 + Math.random() * 0.08,
      zeit: Date.now(),
      ...inhalt,
    }
    setDemoElemente((alte) => [...alte.slice(-3), neues])
    window.setTimeout(() => {
      setDemoElemente((alte) => alte.filter((el) => el.id !== neues.id))
    }, 3400)
  }, [])

  // Auch auf der Startseite darf schon gedrückt werden – das erklärt das Spiel
  // schneller als jeder Text.
  useEffect(() => {
    const beiTaste = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (e.key.length !== 1 || e.key === ' ') return
      demoSpielen('buchstaben', e.key)
    }
    window.addEventListener('keydown', beiTaste)
    return () => window.removeEventListener('keydown', beiTaste)
  }, [demoSpielen])

  return (
    <div className="landung">
      <div className="l-schweber" aria-hidden="true">
        {['A', '🐘', '⭐', 'B', '🦋', '7', '❤️', 'Ö', '🐸', 'M'].map((zeichen, i) => (
          <span key={i} className={`schweber s${i + 1}`}>
            {zeichen}
          </span>
        ))}
      </div>

      <header className="l-hero">
        <p className="l-marke">
          <span className="l-punkt" /> Kostenlos · ohne Anmeldung · ohne Werbung
        </p>
        <h1>
          <span className="hand">👆</span>
          <span className="l-titel">Kleine Finger</span>
        </h1>
        <p className="l-anreisser">
          Die bunte Tastatur-Spielwiese für kleine Hände. Dein Kind haut auf die Tasten – der
          Bildschirm antwortet mit Buchstaben, Tieren, Formen, Farben und weichen Tönen.
          Alles auf Deutsch.
        </p>

        <div className="l-knoepfe">
          <button type="button" className="l-los" onClick={aufWeiter}>
            Jetzt losspielen <span aria-hidden="true">→</span>
          </button>
          <a className="l-zweit" href="#modi">
            Erst mal anschauen
          </a>
        </div>

        <div className="l-demo">
          <div className="l-demo-kopf">
            <span className="l-demo-titel">Probier’s gleich hier aus</span>
            <button
              type="button"
              className={'l-ton' + (demoTon ? ' an' : '')}
              onClick={() => setDemoTon(!demoTon)}
              aria-pressed={demoTon}
            >
              {demoTon ? '🔊 Ton an' : '🔇 Ton aus'}
            </button>
          </div>
          <div className="l-buehne">
            {demoElemente.map((el) => (
              <Element key={el.id} element={el} />
            ))}
            {demoElemente.length === 0 && (
              <p className="l-buehne-hinweis">
                Drück eine Taste auf deiner Tastatur – oder tippe unten drauf.
              </p>
            )}
          </div>
          <div className="l-tasten">
            {DEMO_TASTEN.map((taste) => (
              <button
                key={taste.beschriftung}
                type="button"
                className="l-taste"
                onClick={() => demoSpielen(taste.modus, taste.zeichen)}
              >
                {taste.beschriftung}
              </button>
            ))}
          </div>
        </div>

        <dl className="l-zahlen">
          <div>
            <dt>5</dt>
            <dd>Spielmodi</dd>
          </div>
          <div>
            <dt>30</dt>
            <dd>Buchstaben mit Bild</dd>
          </div>
          <div>
            <dt>{TIERE.length}</dt>
            <dd>Tiere mit Artikel</dd>
          </div>
          <div>
            <dt>0</dt>
            <dd>Werbung &amp; Tracker</dd>
          </div>
        </dl>
      </header>

      <Abschnitt id="modi">
        <h2>Fünf Spielwiesen</h2>
        <p className="l-unter">Jeder Modus hat seinen eigenen Reiz – umschalten geht jederzeit.</p>
        <div className="l-modi">
          {MODI.map((m, i) => (
            <article key={m.id} className={`l-modus f${i + 1}`}>
              <span className="l-modus-symbol" aria-hidden="true">
                {m.symbol}
              </span>
              <h3>{m.name}</h3>
              <p>{m.beschreibung}</p>
              <p className="l-beispiel">
                {m.id === 'buchstaben' && '„A wie Apfel“ · „Drei“'}
                {m.id === 'formen' && '„roter Stern“ · „orange Wolke“'}
                {m.id === 'tiere' && '„der Igel“ · „die Schnecke“'}
                {m.id === 'malen' && 'Regenbogenspur · bunte Kleckse'}
                {m.id === 'gemischt' && 'Überraschung bei jedem Druck'}
              </p>
            </article>
          ))}
        </div>
      </Abschnitt>

      <Abschnitt>
        <h2>So funktioniert’s</h2>
        <p className="l-unter">Drei Handgriffe, dann ist Ruhe – für ungefähr zehn Minuten.</p>
        <ol className="l-schritte">
          {SCHRITTE.map((s) => (
            <li key={s.symbol}>
              <span className="l-schritt-zahl" aria-hidden="true">
                {s.symbol}
              </span>
              <h3>{s.titel}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </Abschnitt>

      <Abschnitt>
        <h2>Sicher für kleine Hände</h2>
        <p className="l-unter">
          Das Wichtigste an einer Kinderseite ist, was sie <em>nicht</em> macht.
        </p>
        <div className="l-sicher">
          {SICHERHEIT.map((s) => (
            <article key={s.titel}>
              <span aria-hidden="true">{s.symbol}</span>
              <h3>{s.titel}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </Abschnitt>

      <Abschnitt>
        <h2>Häufige Fragen</h2>
        <div className="l-fragen">
          {FRAGEN.map((f) => (
            <details key={f.frage}>
              <summary>{f.frage}</summary>
              <p>{f.antwort}</p>
            </details>
          ))}
        </div>
      </Abschnitt>

      <Abschnitt>
        <div className="l-schluss">
          <h2>
            Bereit? <span aria-hidden="true">{zufall(TIERE).emoji}</span>
          </h2>
          <p>Modus wählen, Vollbild an, Finger frei.</p>
          <button type="button" className="l-los gross" onClick={aufWeiter}>
            Losspielen <span aria-hidden="true">→</span>
          </button>
        </div>
      </Abschnitt>

      <footer className="l-fuss">
        <p>
          Mit Liebe für kleine Finger gebaut: deutsche Wörter, deutsche Ansagen, keine
          Ablenkung.
        </p>
      </footer>
    </div>
  )
}
