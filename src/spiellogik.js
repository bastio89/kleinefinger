import { BUCHSTABEN, FARBEN, FORMEN, TIERE, ZAHLEN, farbwort, zufall } from './data/inhalte.js'
import { tonStufeFuer } from './klang.js'

// Baut aus einem Tastendruck (oder Klick) den Inhalt fuer den aktuellen Modus.
export function inhaltFuer(modus, zeichen) {
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
    return {
      typ: 'buchstabe',
      daten: buchstabe,
      farbe: farbe.hex,
      sprache: buchstabe.ansage ?? `${buchstabe.zeichen} wie ${buchstabe.wort}`,
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
