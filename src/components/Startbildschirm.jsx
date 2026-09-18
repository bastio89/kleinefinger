import { MODI } from '../data/modi.js'

export default function Startbildschirm({
  modus,
  setModus,
  sprache,
  setSprache,
  toene,
  setToene,
  aufStart,
  aufZurueck,
}) {
  return (
    <div className="start">
      <button type="button" className="zurueck" onClick={aufZurueck}>
        ← Zur Startseite
      </button>
      <header className="start-kopf">
        <h1>
          <span className="hand">👆</span> Kleine Finger
        </h1>
        <p className="untertitel">
          Die Tastatur- und Mausspielwiese für die Allerkleinsten. Einfach drauflos drücken –
          es kann nichts kaputtgehen.
        </p>
      </header>

      <h2 className="abschnitt">Was soll passieren?</h2>
      <div className="modus-liste">
        {MODI.map((m) => (
          <button
            key={m.id}
            type="button"
            className={'modus-karte' + (modus === m.id ? ' gewaehlt' : '')}
            onClick={() => setModus(m.id)}
            aria-pressed={modus === m.id}
          >
            <span className="modus-symbol" aria-hidden="true">
              {m.symbol}
            </span>
            <span className="modus-name">{m.name}</span>
            <span className="modus-text">{m.beschreibung}</span>
          </button>
        ))}
      </div>

      <h2 className="abschnitt">Ton</h2>
      <div className="schalter-reihe">
        <button
          type="button"
          className={'schalter' + (toene ? ' an' : '')}
          onClick={() => setToene(!toene)}
          aria-pressed={toene}
        >
          🎵 Klänge {toene ? 'an' : 'aus'}
        </button>
        <button
          type="button"
          className={'schalter' + (sprache ? ' an' : '')}
          onClick={() => setSprache(!sprache)}
          aria-pressed={sprache}
        >
          🗣️ Sprachausgabe {sprache ? 'an' : 'aus'}
        </button>
      </div>

      <button type="button" className="los" onClick={aufStart}>
        Los geht’s!
      </button>

      <section className="eltern-hinweis">
        <h2>Für Eltern</h2>
        <ul>
          <li>
            Das Spiel startet im Vollbild. Alle Tasten werden abgefangen, damit nichts verstellt
            wird.
          </li>
          <li>
            <strong>Beenden:</strong> <kbd>Esc</kbd> zwei Sekunden lang gedrückt halten – oder zwei
            Sekunden in die <strong>rechte untere Ecke</strong> tippen. Dann öffnet sich das
            Elternmenü.
          </li>
          <li>
            Die Sprachausgabe nutzt die deutsche Stimme des Geräts. Fehlt sie, bleibt es bei den
            Klängen.
          </li>
          <li>Es werden keine Daten gespeichert oder gesendet – alles läuft im Browser.</li>
        </ul>
      </section>
    </div>
  )
}
