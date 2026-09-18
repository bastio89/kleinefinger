// Toene (Web Audio) und deutsche Sprachausgabe (Web Speech).
// Beides startet erst nach einer Nutzergeste – darum `klangStarten()` beim Start-Klick.

const PENTATONIK = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21] // C-Dur-Pentatonik, klingt immer harmonisch
const GRUNDTON = 261.63 // C4

let ctx = null
let summe = null // gemeinsamer Lautstaerkeregler

export function klangStarten() {
  if (typeof window === 'undefined') return
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  if (!ctx) {
    ctx = new AudioCtx()
    summe = ctx.createGain()
    summe.gain.value = 0.28
    summe.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
}

function frequenz(stufe) {
  const halbton = PENTATONIK[((stufe % PENTATONIK.length) + PENTATONIK.length) % PENTATONIK.length]
  return GRUNDTON * Math.pow(2, halbton / 12)
}

// Ein weicher, glockenartiger Ton – ohne Knacken durch sanfte Huellkurve.
export function spieleTon(stufe = 0, { dauer = 0.7, lautstaerke = 1 } = {}) {
  if (!ctx) return
  const jetzt = ctx.currentTime
  const hz = frequenz(stufe)
  const huelle = ctx.createGain()
  huelle.connect(summe)
  huelle.gain.setValueAtTime(0, jetzt)
  huelle.gain.linearRampToValueAtTime(0.9 * lautstaerke, jetzt + 0.012)
  huelle.gain.exponentialRampToValueAtTime(0.0001, jetzt + dauer)

  for (const [form, versatz, anteil] of [
    ['triangle', 0, 0.7],
    ['sine', 12, 0.3],
  ]) {
    const osz = ctx.createOscillator()
    const teil = ctx.createGain()
    teil.gain.value = anteil
    osz.type = form
    osz.frequency.setValueAtTime(hz * Math.pow(2, versatz / 12), jetzt)
    osz.connect(teil)
    teil.connect(huelle)
    osz.start(jetzt)
    osz.stop(jetzt + dauer + 0.05)
  }
}

// Kleines Glitzer-Arpeggio, z. B. beim Start.
export function spieleJubel() {
  if (!ctx) return
  ;[0, 2, 4, 6].forEach((stufe, i) => {
    setTimeout(() => spieleTon(stufe + 5, { dauer: 0.5, lautstaerke: 0.7 }), i * 90)
  })
}

/* ---------------------------------- Sprache --------------------------------- */

let stimme = null
let stimmenGesucht = false

function stimmeWaehlen() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const alle = window.speechSynthesis.getVoices()
  if (!alle.length) return
  stimme =
    alle.find((s) => /^de[-_]DE$/i.test(s.lang) && s.localService) ||
    alle.find((s) => /^de[-_]DE$/i.test(s.lang)) ||
    alle.find((s) => /^de/i.test(s.lang)) ||
    null
}

export function stimmenVorbereiten() {
  if (typeof window === 'undefined' || !window.speechSynthesis || stimmenGesucht) return
  stimmenGesucht = true
  stimmeWaehlen()
  window.speechSynthesis.addEventListener('voiceschanged', stimmeWaehlen)
}

export function sprich(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
  const synth = window.speechSynthesis
  // Kinder druecken schnell hintereinander – die neueste Ansage gewinnt.
  if (synth.speaking || synth.pending) synth.cancel()
  const ansage = new SpeechSynthesisUtterance(text)
  ansage.lang = 'de-DE'
  if (stimme) ansage.voice = stimme
  ansage.rate = 0.85
  ansage.pitch = 1.15
  ansage.volume = 1
  synth.speak(ansage)
}

export function sprachePausieren() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
}

// Gleiche Taste = gleicher Ton. Das merken sich Kinder erstaunlich schnell.
export function tonStufeFuer(text) {
  const code = String(text || '?').charCodeAt(0) || 0
  return code % PENTATONIK.length
}
