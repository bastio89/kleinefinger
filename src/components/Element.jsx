import Form from './Form.jsx'

// Kleine Funken, die beim Erscheinen nach aussen fliegen.
function Funken({ farbe }) {
  const punkte = []
  for (let i = 0; i < 10; i++) {
    const winkel = (i / 10) * Math.PI * 2 + Math.random()
    const weite = 90 + Math.random() * 90
    punkte.push(
      <span
        key={i}
        className="funke"
        style={{
          '--dx': `${Math.cos(winkel) * weite}px`,
          '--dy': `${Math.sin(winkel) * weite}px`,
          '--verzug': `${Math.random() * 90}ms`,
          background: farbe,
        }}
      />,
    )
  }
  return <span className="funken">{punkte}</span>
}

export default function Element({ element }) {
  const { typ, daten, farbe, drehung, groesse } = element

  return (
    <div
      className="element"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        '--farbe': farbe,
        '--drehung': `${drehung}deg`,
        '--groesse': groesse,
      }}
    >
      <Funken farbe={farbe} />

      {typ === 'buchstabe' && (
        <div className="stapel">
          <div className="zeichen">{daten.zeichen}</div>
          <div className="schild">
            {daten.emoji} {daten.wort}
          </div>
        </div>
      )}

      {typ === 'zahl' && (
        <div className="stapel">
          <div className="zeichen">{daten.zeichen}</div>
          <div className="punkte">
            {Array.from({ length: daten.anzahl }, (_, i) => (
              <span key={i} className="punkt" />
            ))}
          </div>
          <div className="schild">{daten.wort}</div>
        </div>
      )}

      {typ === 'tier' && (
        <div className="stapel">
          <div className="tier">{daten.emoji}</div>
          <div className="schild">
            {daten.artikel} {daten.name}
          </div>
        </div>
      )}

      {typ === 'form' && (
        <div className="stapel">
          <Form id={daten.form.id} farbe={farbe} />
          <div className="schild">{daten.beschriftung}</div>
        </div>
      )}
    </div>
  )
}
