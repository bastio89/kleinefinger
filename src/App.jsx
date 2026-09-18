import { useCallback, useEffect, useRef, useState } from 'react'
import Element from './components/Element.jsx'
import Elternmenue from './components/Elternmenue.jsx'
import Malflaeche from './components/Malflaeche.jsx'
import Startbildschirm from './components/Startbildschirm.jsx'
import { BUCHSTABEN, FARBEN, FORMEN, TIERE, ZAHLEN, farbwort, zufall } from './data/inhalte.js'
import { klangStarten, spieleJubel, spieleTon, sprachePausieren, sprich, stimmenVorbereiten, tonStufeFuer } from './klang.js'

const HALTEDAUER = 2000 // ms, die Esc bzw. die Ecke gehalten werden muss
const LEBENSDAUER = 3400 // ms, bis ein Element verschwindet
const MAX_ELEMENTE = 24

function einstellungLesen(schluessel, standard) {
  try {
    const wert = window.localStorage.getItem(schluessel)
    return wert === null ? standard : JSON.parse(wert)
  } catch {
    return standard
  }
}

function einstellungSchreiben(schluessel, wert) {
  try {
    window.localStorage.setItem(schluessel, JSON.stringify(wert))
  } catch {
    /* z. B. privater Modus – dann eben ohne Merken */
  }
}

// Baut aus einem Tastendruck (oder Klick) den Inhalt fuer den aktuellen Modus.
function inhaltFuer(modus, zeichen) {
  const gewaehlt = modus === 'gemischt' ? zufall(['buchstaben', 'formen', 'tiere']) : modus
  const farbe = zufall(FARBEN)

  if (gewaehlt === 'buchstaben') {
    if (zeichen && /^[0-9]$/.test(zeichen)) {
      const zahl = ZAHLEN[Number(zeichen)]
      return { typ: 'zahl', daten: zahl, farbe: farbe.hex, sprache: zahl.wort, tonStufe: tonStufeFuer(zeichen) }
    }
    let treffer = null
    if (zeichen && zeichen.length === 1) {
      const gross = zeichen === 'ß' ? 'ß' : zeichen.toUpperCase()
      treffer = BUCHSTABEN.find((b) => b.zeichen === gross) ?? null
    }
    const buchstabe = treffer ?? zufall(BUCHSTABEN)
    const gesprochen = buchstabe.zeichen === 'ß' ? 'Eszett' : buchstabe.zeichen
    return {
      typ: 'buchstabe',
      daten: buchstabe,
      farbe: farbe.hex,
      sprache: `${gesprochen} wie ${buchstabe.wort}`,
      tonStufe: tonStufeFuer(buchstabe.zeichen),
    }
  }

  if (gewaehlt === 'tiere') {
    const tier = zufall(TIERE)
    return {
      typ: 'tier',
      daten: tier,
      farbe: farbe.hex,
      sprache: `${tier.artikel} ${tier.name}`,
      tonStufe: tonStufeFuer(tier.name),
    }
  }

  const form = zufall(FORMEN)
  const beschriftung = `${farbwort(farbe, form.genus)} ${form.name}`
  return {
    typ: 'form',
    daten: { form, beschriftung },
    farbe: farbe.hex,
    sprache: beschriftung,
    tonStufe: tonStufeFuer(form.name),
  }
}

export default function App() {
  const [phase, setPhase] = useState('start')
  const [modus, setModus] = useState(() => einstellungLesen('kf:modus', 'buchstaben'))
  const [sprache, setSprache] = useState(() => einstellungLesen('kf:sprache', true))
  const [toene, setToene] = useState(() => einstellungLesen('kf:toene', true))
  const [menueOffen, setMenueOffen] = useState(false)
  const [elemente, setElemente] = useState([])
  const [vollbild, setVollbild] = useState(false)
  const [haelt, setHaelt] = useState(false)
  const [stimmung, setStimmung] = useState(0)
  const [tastenImpuls, setTastenImpuls] = useState(null)
  const [leerenZaehler, setLeerenZaehler] = useState(0)
  const [schonGespielt, setSchonGespielt] = useState(false)

  // Spiegel fuer die globalen Listener, die nicht bei jeder Aenderung neu haengen sollen.
  const refs = useRef({})
  refs.current = { phase, modus, sprache, toene, menueOffen }
  const halteUhr = useRef(null)
  const naechsteId = useRef(1)
  const letztePlaetze = useRef([])

  useEffect(() => einstellungSchreiben('kf:modus', modus), [modus])
  useEffect(() => einstellungSchreiben('kf:sprache', sprache), [sprache])
  useEffect(() => einstellungSchreiben('kf:toene', toene), [toene])

  useEffect(() => {
    const merken = () => setVollbild(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', merken)
    return () => document.removeEventListener('fullscreenchange', merken)
  }, [])

  const halteUhrStoppen = useCallback(() => {
    if (halteUhr.current) {
      clearTimeout(halteUhr.current)
      halteUhr.current = null
    }
    setHaelt(false)
  }, [])

  const menueOeffnen = useCallback(() => {
    halteUhrStoppen()
    sprachePausieren()
    setMenueOffen(true)
  }, [halteUhrStoppen])

  const halteUhrStarten = useCallback(() => {
    if (halteUhr.current || refs.current.menueOffen) return
    setHaelt(true)
    halteUhr.current = setTimeout(() => {
      halteUhr.current = null
      menueOeffnen()
    }, HALTEDAUER)
  }, [menueOeffnen])

  // Sucht einen Platz mit moeglichst viel Abstand zu den zuletzt belegten,
  // damit sich die Elemente nicht zu Klumpen stapeln.
  const platzSuchen = useCallback((punkt) => {
    const merken = (platz) => {
      letztePlaetze.current = [...letztePlaetze.current.slice(-5), platz]
      return platz
    }
    if (punkt) {
      // Nah am Rand wandert das Element etwas nach innen, damit die
      // Beschriftung nicht abgeschnitten wird.
      const halten = (wert, min, max) => Math.min(Math.max(wert, min), max)
      return merken({
        x: halten((punkt.x / window.innerWidth) * 100, 12, 88),
        y: halten((punkt.y / window.innerHeight) * 100, 16, 84),
      })
    }
    let bester = null
    let besterAbstand = -1
    for (let i = 0; i < 14; i++) {
      const kandidat = { x: 14 + Math.random() * 72, y: 18 + Math.random() * 62 }
      const abstand = letztePlaetze.current.reduce(
        (kleinster, p) => Math.min(kleinster, Math.hypot(p.x - kandidat.x, (p.y - kandidat.y) * 0.8)),
        Number.POSITIVE_INFINITY,
      )
      if (abstand > besterAbstand) {
        besterAbstand = abstand
        bester = kandidat
      }
    }
    return merken(bester)
  }, [])

  const erzeugen = useCallback((zeichen, punkt) => {
    const inhalt = inhaltFuer(refs.current.modus, zeichen)
    if (refs.current.toene) spieleTon(inhalt.tonStufe)
    if (refs.current.sprache) sprich(inhalt.sprache)

    const platz = platzSuchen(punkt)
    const neues = {
      id: naechsteId.current++,
      x: platz.x,
      y: platz.y,
      drehung: -14 + Math.random() * 28,
      groesse: 0.8 + Math.random() * 0.45,
      zeit: Date.now(),
      ...inhalt,
    }
    setElemente((alte) => [...alte.slice(-(MAX_ELEMENTE - 1)), neues])
    setStimmung((s) => (s + 23) % 360)
    setSchonGespielt(true)
  }, [platzSuchen])

  // Rueckmeldung aus dem Malmodus: Ton immer, Farbe ansagen wenn bekannt.
  const beiKlecks = useCallback((farbname) => {
    if (refs.current.toene) spieleTon(Math.floor(Math.random() * 10))
    if (refs.current.sprache && farbname) sprich(farbname)
    setSchonGespielt(true)
  }, [])

  // Tastatur und Zeiger global abfangen, solange gespielt wird.
  useEffect(() => {
    if (phase !== 'spiel') return

    const beiTasteRunter = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (refs.current.menueOffen) return
        halteUhrStarten()
        return
      }
      if (refs.current.menueOffen) return
      // Tastenkuerzel des Browsers so weit wie moeglich schlucken.
      e.preventDefault()
      if (e.repeat) return
      if (refs.current.modus === 'malen') {
        setTastenImpuls({ id: naechsteId.current++ })
        return
      }
      erzeugen(e.key)
    }

    const beiTasteHoch = (e) => {
      if (e.key === 'Escape') halteUhrStoppen()
    }

    const beiZeiger = (e) => {
      if (refs.current.menueOffen) return
      if (refs.current.modus === 'malen') return // dort malt die Leinwand selbst
      if (e.target.closest?.('.ecke')) return
      erzeugen(null, { x: e.clientX, y: e.clientY })
    }

    const beiKontextmenue = (e) => e.preventDefault()

    window.addEventListener('keydown', beiTasteRunter)
    window.addEventListener('keyup', beiTasteHoch)
    window.addEventListener('pointerdown', beiZeiger)
    window.addEventListener('contextmenu', beiKontextmenue)
    return () => {
      window.removeEventListener('keydown', beiTasteRunter)
      window.removeEventListener('keyup', beiTasteHoch)
      window.removeEventListener('pointerdown', beiZeiger)
      window.removeEventListener('contextmenu', beiKontextmenue)
    }
  }, [phase, erzeugen, halteUhrStarten, halteUhrStoppen])

  // Verbrauchte Elemente aufraeumen.
  useEffect(() => {
    if (phase !== 'spiel') return
    const takt = setInterval(() => {
      const grenze = Date.now() - LEBENSDAUER
      setElemente((alte) => (alte.some((el) => el.zeit < grenze) ? alte.filter((el) => el.zeit >= grenze) : alte))
    }, 500)
    return () => clearInterval(takt)
  }, [phase])

  const vollbildUmschalten = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      /* manche Browser verweigern Vollbild – dann laeuft es eben im Fenster */
    }
  }, [])

  const starten = useCallback(async () => {
    klangStarten()
    stimmenVorbereiten()
    setElemente([])
    letztePlaetze.current = []
    setSchonGespielt(false)
    setPhase('spiel')
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      /* kein Vollbild moeglich, kein Problem */
    }
    if (toene) spieleJubel()
  }, [toene])

  const beenden = useCallback(async () => {
    halteUhrStoppen()
    sprachePausieren()
    setMenueOffen(false)
    setElemente([])
    setPhase('start')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
    } catch {
      /* egal */
    }
  }, [halteUhrStoppen])

  if (phase === 'start') {
    return (
      <Startbildschirm
        modus={modus}
        setModus={setModus}
        sprache={sprache}
        setSprache={setSprache}
        toene={toene}
        setToene={setToene}
        aufStart={starten}
      />
    )
  }

  return (
    <div className="spiel" style={{ '--stimmung': stimmung }}>
      {modus === 'malen' ? (
        <Malflaeche tastenImpuls={tastenImpuls} leerenZaehler={leerenZaehler} aufKlecks={beiKlecks} />
      ) : (
        <div className="buehne">
          {elemente.map((el) => (
            <Element key={el.id} element={el} />
          ))}
        </div>
      )}

      {!schonGespielt && !menueOffen && (
        <p className="hinweis">
          <span aria-hidden="true">👆</span>{' '}
          {modus === 'malen'
            ? 'Zieh mit der Maus oder dem Finger übers Blatt!'
            : 'Drück eine Taste oder klick irgendwohin!'}
        </p>
      )}

      {/* Stiller Elternbereich: 2 Sekunden halten oeffnet das Menue. */}
      <div
        className="ecke"
        onPointerDown={halteUhrStarten}
        onPointerUp={halteUhrStoppen}
        onPointerLeave={halteUhrStoppen}
        onPointerCancel={halteUhrStoppen}
        aria-label="Elternmenü öffnen: zwei Sekunden halten"
        role="button"
        tabIndex={-1}
      />

      {haelt && (
        <div className="halte-anzeige">
          <span className="halte-text">Elternmenü öffnet …</span>
          <span className="halte-balken">
            <span className="halte-fuellung" style={{ animationDuration: `${HALTEDAUER}ms` }} />
          </span>
        </div>
      )}

      {menueOffen && (
        <Elternmenue
          modus={modus}
          setModus={setModus}
          sprache={sprache}
          setSprache={setSprache}
          toene={toene}
          setToene={setToene}
          vollbild={vollbild}
          aufVollbild={vollbildUmschalten}
          aufWeiter={() => setMenueOffen(false)}
          aufBeenden={beenden}
          aufBlattLeeren={() => setLeerenZaehler((z) => z + 1)}
        />
      )}
    </div>
  )
}
