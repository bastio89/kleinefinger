import { MODI } from '../data/modi.js'

// Pausen-Overlay: nur hier laesst sich etwas umstellen oder beenden.
export default function Elternmenue({
  modus,
  setModus,
  sprache,
  setSprache,
  toene,
  setToene,
  vollbild,
  aufVollbild,
  aufWeiter,
  aufBeenden,
  aufBlattLeeren,
}) {
  return (
    <div className="menue-schleier" role="dialog" aria-modal="true" aria-label="Elternmenü">
      <div className="menue">
        <h2>Elternmenü</h2>
        <p className="menue-text">Das Spiel ist angehalten.</p>

        <h3>Modus</h3>
        <div className="menue-modi">
          {MODI.map((m) => (
            <button
              key={m.id}
              type="button"
              className={'menue-modus' + (modus === m.id ? ' gewaehlt' : '')}
              onClick={() => setModus(m.id)}
              aria-pressed={modus === m.id}
            >
              <span aria-hidden="true">{m.symbol}</span>
              {m.name}
            </button>
          ))}
        </div>

        <h3>Einstellungen</h3>
        <div className="menue-schalter">
          <button type="button" className={'schalter' + (toene ? ' an' : '')} onClick={() => setToene(!toene)}>
            🎵 Klänge {toene ? 'an' : 'aus'}
          </button>
          <button
            type="button"
            className={'schalter' + (sprache ? ' an' : '')}
            onClick={() => setSprache(!sprache)}
          >
            🗣️ Sprache {sprache ? 'an' : 'aus'}
          </button>
          <button type="button" className={'schalter' + (vollbild ? ' an' : '')} onClick={aufVollbild}>
            🖥️ Vollbild {vollbild ? 'an' : 'aus'}
          </button>
          {modus === 'malen' && (
            <button type="button" className="schalter" onClick={aufBlattLeeren}>
              🧽 Blatt leeren
            </button>
          )}
        </div>

        <div className="menue-knoepfe">
          <button type="button" className="weiter" onClick={aufWeiter}>
            ▶ Weiterspielen
          </button>
          <button type="button" className="beenden" onClick={aufBeenden}>
            ✖ Beenden
          </button>
        </div>
      </div>
    </div>
  )
}
