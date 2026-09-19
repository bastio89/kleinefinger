// Alle Inhalte der Spielwiese – bewusst deutsch, kindgerecht und ohne Fremdwoerter.

export const BUCHSTABEN = [
  { zeichen: 'A', wort: 'Apfel', emoji: '🍎' },
  { zeichen: 'B', wort: 'Ball', emoji: '⚽' },
  { zeichen: 'C', wort: 'Clown', emoji: '🤡' },
  { zeichen: 'D', wort: 'Delfin', emoji: '🐬' },
  { zeichen: 'E', wort: 'Elefant', emoji: '🐘' },
  { zeichen: 'F', wort: 'Frosch', emoji: '🐸' },
  { zeichen: 'G', wort: 'Giraffe', emoji: '🦒' },
  { zeichen: 'H', wort: 'Hund', emoji: '🐶' },
  { zeichen: 'I', wort: 'Igel', emoji: '🦔' },
  { zeichen: 'J', wort: 'Jojo', emoji: '🪀' },
  { zeichen: 'K', wort: 'Katze', emoji: '🐱' },
  { zeichen: 'L', wort: 'Löwe', emoji: '🦁' },
  { zeichen: 'M', wort: 'Maus', emoji: '🐭' },
  { zeichen: 'N', wort: 'Nashorn', emoji: '🦏' },
  { zeichen: 'O', wort: 'Orange', emoji: '🍊' },
  { zeichen: 'P', wort: 'Pinguin', emoji: '🐧' },
  { zeichen: 'Q', wort: 'Qualle', emoji: '🪼' },
  { zeichen: 'R', wort: 'Rakete', emoji: '🚀' },
  { zeichen: 'S', wort: 'Sonne', emoji: '☀️' },
  { zeichen: 'T', wort: 'Tiger', emoji: '🐯' },
  { zeichen: 'U', wort: 'Uhr', emoji: '⏰' },
  { zeichen: 'V', wort: 'Vogel', emoji: '🐦' },
  { zeichen: 'W', wort: 'Wal', emoji: '🐳' },
  { zeichen: 'X', wort: 'Xylofon', emoji: '🎼' },
  { zeichen: 'Y', wort: 'Yacht', emoji: '⛵' },
  { zeichen: 'Z', wort: 'Zebra', emoji: '🦓' },
  { zeichen: 'Ä', wort: 'Ähre', emoji: '🌾' },
  { zeichen: 'Ö', wort: 'Öl', emoji: '🫒' },
  { zeichen: 'Ü', wort: 'Übung', emoji: '🤸' },
  // ß steht nie am Wortanfang, darum "wie in" statt "wie".
  { zeichen: 'ß', wort: 'Straße', emoji: '🛣️', ansage: 'Eszett wie in Straße' },
]

export const ZAHLEN = [
  { zeichen: '0', wort: 'Null', anzahl: 0 },
  { zeichen: '1', wort: 'Eins', anzahl: 1 },
  { zeichen: '2', wort: 'Zwei', anzahl: 2 },
  { zeichen: '3', wort: 'Drei', anzahl: 3 },
  { zeichen: '4', wort: 'Vier', anzahl: 4 },
  { zeichen: '5', wort: 'Fünf', anzahl: 5 },
  { zeichen: '6', wort: 'Sechs', anzahl: 6 },
  { zeichen: '7', wort: 'Sieben', anzahl: 7 },
  { zeichen: '8', wort: 'Acht', anzahl: 8 },
  { zeichen: '9', wort: 'Neun', anzahl: 9 },
]

// artikel + name, damit die Sprachausgabe "der Hund" sagen kann.
export const TIERE = [
  { emoji: '🐶', name: 'Hund', artikel: 'der' },
  { emoji: '🐱', name: 'Katze', artikel: 'die' },
  { emoji: '🐭', name: 'Maus', artikel: 'die' },
  { emoji: '🐰', name: 'Hase', artikel: 'der' },
  { emoji: '🦊', name: 'Fuchs', artikel: 'der' },
  { emoji: '🐻', name: 'Bär', artikel: 'der' },
  { emoji: '🐼', name: 'Panda', artikel: 'der' },
  { emoji: '🦁', name: 'Löwe', artikel: 'der' },
  { emoji: '🐯', name: 'Tiger', artikel: 'der' },
  { emoji: '🐘', name: 'Elefant', artikel: 'der' },
  { emoji: '🦒', name: 'Giraffe', artikel: 'die' },
  { emoji: '🦓', name: 'Zebra', artikel: 'das' },
  { emoji: '🐴', name: 'Pferd', artikel: 'das' },
  { emoji: '🐮', name: 'Kuh', artikel: 'die' },
  { emoji: '🐷', name: 'Schwein', artikel: 'das' },
  { emoji: '🐑', name: 'Schaf', artikel: 'das' },
  { emoji: '🐔', name: 'Huhn', artikel: 'das' },
  { emoji: '🐥', name: 'Küken', artikel: 'das' },
  { emoji: '🦆', name: 'Ente', artikel: 'die' },
  { emoji: '🦉', name: 'Eule', artikel: 'die' },
  { emoji: '🐧', name: 'Pinguin', artikel: 'der' },
  { emoji: '🐸', name: 'Frosch', artikel: 'der' },
  { emoji: '🐢', name: 'Schildkröte', artikel: 'die' },
  { emoji: '🐠', name: 'Fisch', artikel: 'der' },
  { emoji: '🐳', name: 'Wal', artikel: 'der' },
  { emoji: '🐬', name: 'Delfin', artikel: 'der' },
  { emoji: '🦀', name: 'Krebs', artikel: 'der' },
  { emoji: '🐝', name: 'Biene', artikel: 'die' },
  { emoji: '🦋', name: 'Schmetterling', artikel: 'der' },
  { emoji: '🐌', name: 'Schnecke', artikel: 'die' },
  { emoji: '🐞', name: 'Marienkäfer', artikel: 'der' },
  { emoji: '🐵', name: 'Affe', artikel: 'der' },
  { emoji: '🦔', name: 'Igel', artikel: 'der' },
  { emoji: '🐺', name: 'Wolf', artikel: 'der' },
  { emoji: '🐫', name: 'Kamel', artikel: 'das' },
  { emoji: '🦜', name: 'Papagei', artikel: 'der' },
]

// genus steuert die Endung des Farbworts: roter Stern / rote Blume / rotes Herz
export const FORMEN = [
  { id: 'kreis', name: 'Kreis', genus: 'm' },
  { id: 'quadrat', name: 'Quadrat', genus: 'n' },
  { id: 'dreieck', name: 'Dreieck', genus: 'n' },
  { id: 'stern', name: 'Stern', genus: 'm' },
  { id: 'herz', name: 'Herz', genus: 'n' },
  { id: 'blume', name: 'Blume', genus: 'f' },
  { id: 'sonne', name: 'Sonne', genus: 'f' },
  { id: 'mond', name: 'Mond', genus: 'm' },
  { id: 'wolke', name: 'Wolke', genus: 'f' },
  { id: 'blitz', name: 'Blitz', genus: 'm' },
  { id: 'raute', name: 'Raute', genus: 'f' },
  { id: 'kleeblatt', name: 'Kleeblatt', genus: 'n' },
]

export const FARBEN = [
  { name: 'rot', hex: '#ff4d5e' },
  { name: 'blau', hex: '#3d8bff' },
  { name: 'gelb', hex: '#ffd023' },
  { name: 'grün', hex: '#35d07f' },
  { name: 'orange', hex: '#ff9130' },
  { name: 'lila', hex: '#b269ff', unveraenderlich: true },
  { name: 'rosa', hex: '#ff7fc8', unveraenderlich: true },
  { name: 'türkis', hex: '#25d5d5' },
]

const ENDUNG = { m: 'er', f: 'e', n: 'es' }
// Farben auf -e (orange) haengen nur r/-/s an: oranger Mond, orange Sonne, oranges Herz.
const ENDUNG_AUF_E = { m: 'r', f: '', n: 's' }

// "rot" + Stern (m) -> "roter Stern". Nur lila und rosa bleiben unveraendert,
// alle anderen Farbwoerter werden gebeugt (auch tuerkis und orange).
export function farbwort(farbe, genus) {
  if (farbe.unveraenderlich) return farbe.name
  const tabelle = farbe.name.endsWith('e') ? ENDUNG_AUF_E : ENDUNG
  return farbe.name + (tabelle[genus] ?? '')
}

export function zufall(liste) {
  return liste[Math.floor(Math.random() * liste.length)]
}
