# 👆 Kleine Finger

Eine bunte Tastatur- und Mausspielwiese für die Allerkleinsten – ganz auf
Deutsch, mit deutschen Wörtern, deutscher Sprachausgabe und richtigen
Artikeln.

Kinder dürfen wild auf der Tastatur herumhämmern und mit der Maus klicken:
Jeder Druck erzeugt etwas Buntes mit Ton und Ansage. Verstellen oder kaputt
machen können sie dabei nichts.

Der Ablauf: **Landingpage** (mit spielbarer Mini-Vorschau) → **Auswahl** von
Modus und Ton → **Spiel** im Vollbild.

## Modi

| Modus | Was passiert |
| --- | --- |
| **Buchstaben & Zahlen** | Die gedrückte Taste erscheint groß – mit Bild, Wort und Ansage („A wie Apfel“). Umlaute und ß sind dabei. Zahlen zeigen zusätzlich die passende Anzahl Punkte. |
| **Formen & Farben** | Sterne, Herzen, Wolken, Kleeblätter … in acht Farben, jeweils richtig gebeugt angesagt („roter Stern“, „orange Wolke“, „türkises Herz“). |
| **Tiere** | 36 Tiere mit deutschem Namen und Artikel („der Igel“, „die Schnecke“). |
| **Malen** | Maus oder Finger ziehen Regenbogenspuren über ein weißes Blatt, Tasten setzen bunte Kleckse. Alte Striche verblassen langsam, das Blatt läuft nie zu. |
| **Bunt gemischt** | Buchstaben, Formen und Tiere wechseln sich zufällig ab. |

## Für Eltern

* Das Spiel startet im **Vollbild**, alle Tastenkürzel werden abgefangen.
* **Elternmenü öffnen:** <kbd>Esc</kbd> zwei Sekunden lang gedrückt halten –
  oder die **rechte untere Ecke** ebenso lange (für Tablets ohne Tastatur).
  Ein Fortschrittsbalken zeigt das Halten an.
* Im Elternmenü lassen sich Modus, Klänge, Sprachausgabe und Vollbild
  umstellen, das Malblatt leeren und das Spiel beenden.
* Die Sprachausgabe nutzt die deutsche Stimme des Geräts (Web Speech API).
  Fehlt sie, bleibt es bei den Klängen – die Seite funktioniert trotzdem.
* Die Klänge liegen auf einer C-Dur-Pentatonik, klingen also immer harmonisch.
  Dieselbe Taste ergibt immer denselben Ton.
* Es werden **keine Daten gespeichert oder gesendet**. Nur die gewählten
  Einstellungen liegen lokal im Browser (`localStorage`).

## Entwicklung

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Produktionsbuild nach dist/
npm run preview  # Build lokal ansehen
```

Gebaut mit [Vite](https://vite.dev) und React, ohne weitere Abhängigkeiten.
Da `base: './'` gesetzt ist, läuft der Build auch aus einem Unterordner
(z. B. GitHub Pages).

## Aufbau

```
src/
  App.jsx                 Spielablauf, Eingaben, Elternschutz
  klang.js                Töne (Web Audio) und deutsche Sprachausgabe
  styles.css              gesamtes Aussehen
  data/inhalte.js         Buchstaben, Zahlen, Tiere, Formen, Farben
  data/modi.js            Beschreibung der Modi
  spiellogik.js           waehlt Buchstabe/Form/Tier fuer einen Druck
  components/
    Landung.jsx           Landingpage mit spielbarer Vorschau
    Startbildschirm.jsx   Auswahl vor dem Start
    Elternmenue.jsx       Pausen-Overlay
    Element.jsx           ein erscheinendes Element samt Funken
    Form.jsx              die SVG-Formen
    Malflaeche.jsx        Leinwand für den Malmodus
```
