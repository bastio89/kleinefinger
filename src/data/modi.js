export const MODI = [
  {
    id: 'buchstaben',
    name: 'Buchstaben & Zahlen',
    symbol: '🔤',
    beschreibung: 'Jede Taste zeigt ihren Buchstaben – mit Bild, Wort und Ansage.',
  },
  {
    id: 'formen',
    name: 'Formen & Farben',
    symbol: '⭐',
    beschreibung: 'Bunte Sterne, Herzen und Kreise purzeln über den Bildschirm.',
  },
  {
    id: 'tiere',
    name: 'Tiere',
    symbol: '🐘',
    beschreibung: 'Ein Tier pro Druck – mit deutschem Namen und Artikel.',
  },
  {
    id: 'malen',
    name: 'Malen',
    symbol: '🖍️',
    beschreibung: 'Maus oder Finger ziehen Regenbogenspuren, Tasten setzen Kleckse.',
  },
  {
    id: 'gemischt',
    name: 'Bunt gemischt',
    symbol: '🎉',
    beschreibung: 'Buchstaben, Formen und Tiere wechseln sich zufällig ab.',
  },
]

export function modusInfo(id) {
  return MODI.find((m) => m.id === id) ?? MODI[0]
}
