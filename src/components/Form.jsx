// Einfache, kraeftige SVG-Formen. Alles im Raster 0..100.

function Strahlen() {
  const linien = []
  for (let i = 0; i < 8; i++) {
    const winkel = (i * Math.PI) / 4
    linien.push(
      <line
        key={i}
        x1={50 + Math.cos(winkel) * 32}
        y1={50 + Math.sin(winkel) * 32}
        x2={50 + Math.cos(winkel) * 47}
        y2={50 + Math.sin(winkel) * 47}
        strokeWidth="9"
        strokeLinecap="round"
        stroke="currentColor"
      />,
    )
  }
  return <g>{linien}</g>
}

function Blumenblaetter() {
  const blaetter = []
  for (let i = 0; i < 6; i++) {
    blaetter.push(
      <ellipse key={i} cx="50" cy="24" rx="13" ry="21" transform={`rotate(${i * 60} 50 50)`} />,
    )
  }
  return <g>{blaetter}</g>
}

export default function Form({ id, farbe }) {
  const inhalt = {
    kreis: <circle cx="50" cy="50" r="42" />,
    quadrat: <rect x="10" y="10" width="80" height="80" rx="12" />,
    dreieck: <polygon points="50,8 93,88 7,88" />,
    stern: <polygon points="50,4 62,37 97,37 68,58 79,92 50,71 21,92 32,58 3,37 38,37" />,
    herz: (
      <path d="M50 89 C14 63 6 41 21 27 C33 16 47 20 50 33 C53 20 67 16 79 27 C94 41 86 63 50 89 Z" />
    ),
    blume: (
      <g>
        <Blumenblaetter />
        <circle cx="50" cy="50" r="13" fill="#fff59b" />
      </g>
    ),
    sonne: (
      <g>
        <circle cx="50" cy="50" r="27" />
        <Strahlen />
      </g>
    ),
    mond: <path d="M64 6 A46 46 0 1 0 64 94 A37 37 0 1 1 64 6 Z" />,
    wolke: (
      <g>
        <circle cx="33" cy="58" r="21" />
        <circle cx="52" cy="44" r="26" />
        <circle cx="72" cy="60" r="19" />
        <rect x="30" y="58" width="45" height="21" rx="10" />
      </g>
    ),
    blitz: <polygon points="60,4 26,55 46,55 38,96 76,41 55,41" />,
    raute: <polygon points="50,4 94,50 50,96 6,50" />,
    kleeblatt: (
      <g>
        <circle cx="50" cy="28" r="18" />
        <circle cx="72" cy="50" r="18" />
        <circle cx="50" cy="72" r="18" />
        <circle cx="28" cy="50" r="18" />
      </g>
    ),
  }[id]

  return (
    <svg className="form" viewBox="0 0 100 100" style={{ color: farbe, fill: farbe }} aria-hidden="true">
      {inhalt}
    </svg>
  )
}
