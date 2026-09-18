import { useEffect, useRef } from 'react'
import { FARBEN, zufall } from '../data/inhalte.js'

const PAPIER = '#fffdf7'

// Malmodus: Maus/Finger ziehen bunte Spuren, Tasten setzen Kleckse.
// Alte Striche verblassen langsam, damit das Blatt nie ganz zulaeuft.
export default function Malflaeche({ tastenImpuls, leerenZaehler, aufKlecks }) {
  const leinwandRef = useRef(null)
  const pinsel = useRef({ malt: false, x: 0, y: 0, ton: Math.random() * 360 })
  const aufKlecksRef = useRef(aufKlecks)
  aufKlecksRef.current = aufKlecks

  // Groesse (inkl. Bildschirmschaerfe) einrichten und bei Groessenaenderung erhalten.
  useEffect(() => {
    const leinwand = leinwandRef.current
    const ctx = leinwand.getContext('2d')

    const anpassen = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const alt = document.createElement('canvas')
      const hatInhalt = leinwand.width > 0 && leinwand.height > 0
      if (hatInhalt) {
        alt.width = leinwand.width
        alt.height = leinwand.height
        alt.getContext('2d').drawImage(leinwand, 0, 0)
      }
      leinwand.width = Math.floor(window.innerWidth * dpr)
      leinwand.height = Math.floor(window.innerHeight * dpr)
      leinwand.style.width = '100%'
      leinwand.style.height = '100%'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = PAPIER
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      if (hatInhalt) {
        ctx.drawImage(alt, 0, 0, window.innerWidth, window.innerHeight)
      }
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }

    anpassen()
    window.addEventListener('resize', anpassen)
    return () => window.removeEventListener('resize', anpassen)
  }, [])

  // Langsames Verblassen
  useEffect(() => {
    const takt = setInterval(() => {
      const ctx = leinwandRef.current?.getContext('2d')
      if (!ctx) return
      ctx.save()
      ctx.globalAlpha = 0.03
      ctx.fillStyle = PAPIER
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.restore()
    }, 220)
    return () => clearInterval(takt)
  }, [])

  // Blatt leeren (Knopf im Elternmenue)
  useEffect(() => {
    if (!leerenZaehler) return
    const ctx = leinwandRef.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = PAPIER
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
  }, [leerenZaehler])

  // Tastendruck -> bunter Klecks mit Ringen
  useEffect(() => {
    if (!tastenImpuls) return
    const ctx = leinwandRef.current?.getContext('2d')
    if (!ctx) return
    const farbe = zufall(FARBEN)
    const x = 80 + Math.random() * (window.innerWidth - 160)
    const y = 80 + Math.random() * (window.innerHeight - 160)
    const r = 35 + Math.random() * 55

    ctx.save()
    ctx.globalAlpha = 0.85
    ctx.fillStyle = farbe.hex
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(x, y, r + 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    aufKlecksRef.current?.(farbe.name)
  }, [tastenImpuls])

  const punktAus = (e) => ({ x: e.clientX, y: e.clientY })

  const beginnen = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const p = punktAus(e)
    pinsel.current = { malt: true, x: p.x, y: p.y, ton: Math.random() * 360 }
    const ctx = leinwandRef.current.getContext('2d')
    ctx.fillStyle = `hsl(${pinsel.current.ton} 85% 60%)`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
    ctx.fill()
    aufKlecksRef.current?.(null)
  }

  const ziehen = (e) => {
    if (!pinsel.current.malt) return
    const ctx = leinwandRef.current.getContext('2d')
    const p = punktAus(e)
    const dx = p.x - pinsel.current.x
    const dy = p.y - pinsel.current.y
    const strecke = Math.hypot(dx, dy)
    pinsel.current.ton = (pinsel.current.ton + 3 + strecke * 0.15) % 360

    ctx.strokeStyle = `hsl(${pinsel.current.ton} 85% 58%)`
    ctx.lineWidth = Math.max(10, 34 - strecke * 0.5)
    ctx.beginPath()
    ctx.moveTo(pinsel.current.x, pinsel.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()

    // Glitzer neben der Spur
    if (Math.random() < 0.3) {
      ctx.fillStyle = `hsl(${(pinsel.current.ton + 40) % 360} 95% 70%)`
      ctx.beginPath()
      ctx.arc(p.x + (Math.random() - 0.5) * 60, p.y + (Math.random() - 0.5) * 60, 2 + Math.random() * 5, 0, Math.PI * 2)
      ctx.fill()
    }

    pinsel.current.x = p.x
    pinsel.current.y = p.y
  }

  const beenden = () => {
    pinsel.current.malt = false
  }

  return (
    <canvas
      ref={leinwandRef}
      className="malflaeche"
      onPointerDown={beginnen}
      onPointerMove={ziehen}
      onPointerUp={beenden}
      onPointerCancel={beenden}
      onPointerLeave={beenden}
    />
  )
}
