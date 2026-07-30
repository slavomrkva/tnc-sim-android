/* German runtime data ported from the web product. Klartext stays unchanged;
   only UI descriptions and demo comments are localized. */

var DEFAULT_CODE_DE = `BEGIN PGM PROGRAM MM
;==================================================
; TNC SIM - DEMOPROGRAMM
; Rohteil: 100 x 100 x 20 mm
; Enthält: Konturfräsen, Bohren, Reiben,
;           Kantenfasen und Gewindebohren
;==================================================
BLK FORM 0.1 Z X-50 Y-50 Z+0
BLK FORM 0.2 X+50 Y+50 Z+20
;
;--------------------------------------------------
; T1 - Schaftfräser D16 (Konturschruppen)
; Außenkontur bis 20mm Tiefe fräsen
;--------------------------------------------------
TOOL CALL 1 Z S18000 F3500
TOOL DEF 3 ; Werkzeug fürs nächste TOOL CALL ins Magazin vorladen
M3 ; Spindel EIN — im Uhrzeigersinn
M8 ; Kühlmittel EIN — Flutung
L X+0 Y+90 Z+50 FMAX R0
L X+0 Y+90 Z+0 F2000
L Y+100 RL ; linke Radiuskorrektur aktivieren
CC X+0 Y+75 ; Kreismittelpunkt für tangentialen Einfahrbogen
C X+0 Y+50 DR+ ; fährt tangential auf die Kontur (vermeidet eine Werkzeugmarke durch direktes Eintauchen)
L X+50
RND R20 ; Eckenverrundung
L Y-50
RND R20
L X-50
RND R20
L Y+50
RND R20
L X+10
CC X+10 Y+75 ; Kreismittelpunkt für tangentialen Ausfahrbogen
C X+10 Y+100 DR+ ; fährt tangential von der Kontur weg
L Z+100 FMAX R0
; Mittlere Kreistasche D20 fräsen
CYCL DEF 208 ;Bohrfräsen
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-20 ;Tiefe [mm]
  Q206 FAUTO ;Vorschub Zustellung [mm/min]
  Q334=+2 ;Zustellung pro Schnitt [mm]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
  Q335=+20 ;SOLL-Durchmesser [mm]
  Q342=+0 ;Vorbohrdurchmesser [mm]
  Q351=+1 ;Frässtrategie
  Q370=+1 ;Bahnüberlappungsfaktor
L X+0 Y+0 FMAX M99
M5 ; Spindel AUS
M9 ; Kühlmittel AUS
;
;--------------------------------------------------
; T3 - Zentrierbohrer D8 (Bohrungsmitten ankörnen)
; LBL 1 = rechte Bohrungen, LBL 2 = linke Bohrungen
;--------------------------------------------------
TOOL CALL 3 Z S18000 F300
TOOL DEF 4 ; Werkzeug fürs nächste TOOL CALL ins Magazin vorladen
M3 ; Spindel EIN — im Uhrzeigersinn
M8 ; Kühlmittel EIN — Flutung
CYCL DEF 200 ;Bohren
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-1 ;Tiefe [mm]
  Q206=+150 ;Vorschub Zustellung [mm/min]
  Q202=+1 ;Zustelltiefe [mm]
  Q210=+0 ;Verweilzeit oben [s]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
  Q211=+0 ;Verweilzeit unten [s]
LBL 1
; Bohrungspositionen für Reiben 7H7
L X+30 Y+30 FMAX R0 M99
L X+30 Y-30 FMAX R0 M99
LBL 0
LBL 2
; Bohrungspositionen für M8-Gewinde
L X-30 Y-30 FMAX R0 M99
L X-30 Y+30 FMAX R0 M99
LBL 0
M5 ; Spindel AUS
M9 ; Kühlmittel AUS
;
;--------------------------------------------------
; T4 - Bohrer D7 (Bohren vor Reiben und Gewindebohren)
; Tiefe 24mm durch das gesamte Rohteil + Durchbruch
;--------------------------------------------------
TOOL CALL 4 Z S14000 F300
TOOL DEF 5 ; Werkzeug fürs nächste TOOL CALL ins Magazin vorladen
M3 ; Spindel EIN — im Uhrzeigersinn
M8 ; Kühlmittel EIN — Flutung
CYCL DEF 200 ;Bohren
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-24 ;Tiefe [mm]
  Q206 FAUTO ;Vorschub Zustellung [mm/min]
  Q202=+11.5 ;Zustelltiefe [mm]
  Q210=+0 ;Verweilzeit oben [s]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
  Q211=+0 ;Verweilzeit unten [s]
CALL LBL 1 ; rechte Bohrungen bohren
CALL LBL 2 ; linke Bohrungen bohren
M5 ; Spindel AUS
M9 ; Kühlmittel AUS
;
;--------------------------------------------------
; T5 - Fase / Senker 90° D8
; DL-2 DR+2 = Spitzen-Offset für 1x45°-Fase
; Alle Bohrungskanten mit Zyklus 208 fasen
;--------------------------------------------------
TOOL CALL 5 Z S18000 F1000 DL-2 DR+2
TOOL DEF 6 ; Werkzeug fürs nächste TOOL CALL ins Magazin vorladen
M3 ; Spindel EIN — im Uhrzeigersinn
M8 ; Kühlmittel EIN — Flutung
L X+0 Y+90 Z+50 FMAX R0
L X+0 Y+90 Z+19 F2000
L Y+100 RL
CC X+0 Y+75 ; Kreismittelpunkt für tangentialen Einfahrbogen
C X+0 Y+50 DR+ ; fährt tangential auf die Kontur (vermeidet eine Werkzeugmarke durch direktes Eintauchen)
L X+50
RND R20
L Y-50
RND R20
L X-50
RND R20
L Y+50
RND R20
L X+10
CC X+10 Y+75 ; Kreismittelpunkt für tangentialen Ausfahrbogen
C X+10 Y+100 DR+ ; fährt tangential von der Kontur weg
L Z+100 FMAX R0
; Kante der mittleren Bohrung D20 fasen
CYCL DEF 208 ;Bohrfräsen
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-1 ;Tiefe [mm]
  Q206 FAUTO ;Vorschub Zustellung [mm/min]
  Q334=+0 ;Zustellung pro Schnitt [mm]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
  Q335=+20 ;SOLL-Durchmesser [mm]
  Q342=+19.9999 ;Vorbohrdurchmesser [mm]
  Q351=+1 ;Frässtrategie
  Q370=+1 ;Bahnüberlappungsfaktor
L X+0 Y+0 FMAX M99
; Kanten der D7-Bohrungen fasen (Reiben)
CYCL DEF 208 ;Bohrfräsen
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-1 ;Tiefe [mm]
  Q206=+150 ;Vorschub Zustellung [mm/min]
  Q334=+0 ;Zustellung pro Schnitt [mm]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
  Q335=+7 ;SOLL-Durchmesser [mm]
  Q342=+6.999 ;Vorbohrdurchmesser [mm]
  Q351=+1 ;Frässtrategie
  Q370=+1 ;Bahnüberlappungsfaktor
CALL LBL 1
; Kanten der D8-Bohrungen fasen (Gewinde)
CYCL DEF 208 ;Bohrfräsen
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-1 ;Tiefe [mm]
  Q206=+150 ;Vorschub Zustellung [mm/min]
  Q334=+0 ;Zustellung pro Schnitt [mm]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
  Q335=+8 ;SOLL-Durchmesser [mm]
  Q342=+7.999 ;Vorbohrdurchmesser [mm]
  Q351=+1 ;Frässtrategie
  Q370=+1 ;Bahnüberlappungsfaktor
CALL LBL 2
M5 ; Spindel AUS
M9 ; Kühlmittel AUS
;
;--------------------------------------------------
; T6 - Reibahle D7 H7 (Präzisionsreiben der Bohrungen)
; nur rechte Bohrungen (LBL 1)
;--------------------------------------------------
TOOL CALL 6 Z S12200 F300
TOOL DEF 7 ; Werkzeug fürs nächste TOOL CALL ins Magazin vorladen
M3 ; Spindel EIN — im Uhrzeigersinn
M8 ; Kühlmittel EIN — Flutung
CYCL DEF 201 ;Reiben
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-22 ;Tiefe [mm]
  Q206 FAUTO ;Vorschub Reiben [mm/min]
  Q211=+0 ;Verweilzeit unten [s]
  Q208=+0 ;Vorschub Rückzug [mm/min]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
CALL LBL 1
M5 ; Spindel AUS
M9 ; Kühlmittel AUS
;
;--------------------------------------------------
; T7 - Gewindebohrer M8 (Gewindebohren mit Spanbruch)
; Q257=11 Zustelltiefe, Q256=0 vollständiger Rückzug aus der Bohrung
; nur linke Bohrungen (LBL 2)
;--------------------------------------------------
TOOL CALL 7 Z S350
M3 ; Spindel EIN — im Uhrzeigersinn
M8 ; Kühlmittel EIN — Flutung
CYCL DEF 209 ;Gewindebohren mit Spanbruch
  Q200=+2 ;Sicherheits-Abstand [mm]
  Q201=-22 ;Gewindetiefe [mm]
  Q239=+1.25 ;Gewindesteigung [mm]
  Q203=+20 ;Oberflächen-Koordinate [mm]
  Q204=+50 ;2. Sicherheits-Abstand [mm]
  Q257=+11 ;Zustelltiefe für Spanbruch [mm]
  Q256=+0 ;Rückzugsfaktor (x Steigung; 0 = voller Rückzug)
  Q336=+0 ;Spindelwinkel [deg]
CALL LBL 2
M5 ; Spindel AUS
M9 ; Kühlmittel AUS
END PGM PROGRAM MM`;

var ANGLE_MILL_DE = `BEGIN PGM PROGRAM MM
; Schrägenfräsen - 30°-Rampe, zwei Durchgänge
; T1: Schaftfräser schruppt eine 22-stufige Treppe als Annäherung an die Rampe (X=Q2 0..21, Z=Q1),
;     DL+0.2 lässt 0,2mm Aufmaß auf der Fläche für die Schlichtbearbeitung.
; T2: Kugelfräser (R2=4) nutzt dasselbe Treppen-Makro erneut. DL-0.536 DR-2 verschieben die Kugel-
;     spitze/den Mittelpunkt so, dass sie an jeder Stufe exakt tangential zur idealen 30°-Ebene liegt
;     (kein Übermaß, kein Restaufmaß) - siehe DL=-R2*(1-cos A), DR=-R2*(1-sin A).
; Hinweis: Die gefräste Fläche wirkt in der 3D-Ansicht weiterhin gestuft/treppig, wegen
;     der Auflösungsgrenze der Simulation (Voxelgittergröße), nicht wegen der Werkzeugbahn selbst.
BLK FORM 0.1 Z X+0.5 Y+0 Z+0
BLK FORM 0.2 X+50 Y+50 Z+20
TOOL CALL 1 Z S10000 F5000 DL+0.2 ; T1 Schaftfräser - Schrupp-Durchgang
M8
M3
Q1=+10 ; Z-Starttiefe
Q2=+0 ; X-Startposition
L X-10 Y-10 Z+40 FMAX R0
LBL 1 ; eine Rampenstufe: eintauchen, über Y schneiden, zurückziehen, zurückfahren
L X+Q2 Y-10 Z+Q1 FMAX RL
L Y+60
L Z+40 FMAX R0
L Y-10 FMAX
Q1 = Q1+0,5774 ; tan(30°) Z-Schritt -> exakte 30°-Steigung
Q2 = Q2+1 ; 1mm X-Schritt
LBL 0
CALL LBL 1 REP 21 ; 22 Stufen insgesamt (X=0..21)
TOOL CALL 2 Z S2000 F5000 DL-0.536 DR-2 ; T2 Kugelfräser - kontaktpunktkorrigierter Schlicht-Durchgang
M3
M8
L X-10 Y-10 Z+40 FMAX R0
Q1=+10
Q2=+0
CALL LBL 1 REP 22
END PGM PROGRAM MM`;

var M_DEFS_DE = {
  M0:  'Programm-Halt; Spindel und Kühlmittel AUS',
  M1:  'Wahlweiser Programm-Halt (maschinenabhängig)',
  M2:  'Programm-Ende; Spindel und Kühlmittel AUS — wie M30',
  M3:  'Spindel EIN — im Uhrzeigersinn',
  M4:  'Spindel EIN — gegen den Uhrzeigersinn',
  M5:  'Spindel AUS',
  M6:  'Werkzeugwechsel / Programm-Halt / Spindel AUS (maschinenabhängig)',
  M7:  'Kühlmittel EIN — Sprühnebel (maschinenspezifisch; keine Standardfunktion der TNC 640)',
  M8:  'Kühlmittel EIN — Flutung',
  M9:  'Kühlmittel AUS',
  M13: 'Spindel EIN im Uhrzeigersinn + Kühlmittel EIN',
  M14: 'Spindel EIN gegen den Uhrzeigersinn + Kühlmittel EIN',
  M30: 'Programm-Ende',
  M89: 'Freie Funktion / modaler Zyklusaufruf (maschinenabhängig)',
  M91: 'Koordinaten bezogen auf Maschinen-Nullpunkt, nicht auf Werkstück-Nullpunkt',
  M92: 'Koordinaten bezogen auf den vom Maschinenhersteller festgelegten Bezugspunkt (z. B. Werkzeugwechselposition)',
  M94: 'Anzeige der Rundachse auf einen Wert unter 360° reduzieren',
  M97: 'Kleine Konturstufen sauber bearbeiten',
  M98: 'Offene Konturecken vollständig bearbeiten',
  M99: 'Satzweiser (nicht modaler) Zyklusaufruf',
  M101:'Automatischer Werkzeugwechsel mit Schwesterwerkzeug bei Ablauf der Standzeit',
  M102:'M101 zurücksetzen',
  M103:'Vorschub beim Eintauchen um den Faktor F (%) reduzieren',
  M107:'Fehlermeldung bei übergroßen Schwesterwerkzeugen unterdrücken',
  M108:'M107 zurücksetzen',
  M109:'Konstante Bahngeschwindigkeit an der Werkzeugschneide — Vorschub erhöhen & verringern',
  M110:'Konstante Bahngeschwindigkeit an der Werkzeugschneide — nur Vorschub verringern',
  M111:'M109/M110 zurücksetzen',
  M116:'Vorschub der Rundachse in mm/min statt °/min',
  M117:'M116 zurücksetzen',
  M118:'Handrad-Positionierung während des Programmlaufs überlagern',
  M120:'Vorausschau — radiuskorrigierte Kontur vorausberechnen',
  M126:'Rundachsen auf kürzestem Weg verfahren',
  M127:'M126 zurücksetzen',
  M128:'TCPM — Werkzeugspitzenposition beim Schwenken beibehalten',
  M129:'M128 zurücksetzen',
  M130:'Verfahren zur Position im ungeschwenkten System bei geschwenkter Bearbeitungsebene',
  M134:'Genauhalt an nicht-tangentialen Konturübergängen mit Rundachsen',
  M135:'M134 zurücksetzen',
  M136:'Vorschub F in mm pro Spindelumdrehung',
  M137:'M136 zurücksetzen',
  M138:'Auswahl der Achsen, auf die M128/M114 wirken',
  M140:'Rückzug von der Kontur in Richtung Werkzeugachse',
  M141:'Tastsystem-Überwachung unterdrücken',
  M143:'Grunddrehung löschen',
  M144:'Maschinenkinematik in IST/SOLL-Position am Satzende kompensieren',
  M145:'M144 zurücksetzen',
  M148:'Werkzeug bei NC-Stopp automatisch von der Kontur abheben',
  M149:'M148 zurücksetzen',
  M197:'Eckenrundung mit satzweiser DL-Verlängerung reduzieren'
};

var HELP_MAP_DE = {
  'run':      {title:'▶ Start', desc:'Startet die Simulation ab der aktuellen Position. Das Werkzeug durchläuft alle Sätze fortlaufend. Mit der Tempo-Steuerung (− / +) passt du die Abspielgeschwindigkeit an.'},
  'step':     {title:'▶▶ Schritt', desc:'Führt jeweils einen Satz aus. Jeder Klick springt zum nächsten NC-Satz. Nützlich, um einzelne Bewegungen zu prüfen.'},
  'stop':     {title:'⏸ Stopp', desc:'Hält die Simulation an der aktuellen Position an. Zum Fortsetzen Start drücken. Nach dem Anhalten kannst du auch Verfeinern auslösen, um das hochauflösende Netz zu sehen.'},
  'reset':    {title:'↺ Reset', desc:'Setzt die Simulation an den Anfang zurück. Das Werkstück nimmt wieder seine Ausgangsform an und das Werkzeug fährt auf die Startposition.'},
  'q-low':    {title:'Qualität: Niedrig (100 vox)', desc:'Zielt auf Zellen bis 1 mm. Schnellste Option für schwächere Geräte und rasche Bahnprüfungen. Feine Details unter ~1 mm erscheinen evtl. nicht. Bei sehr großen Rohteilen passt sich das Gitter an das Speicherbudget an.'},
  'q-med':    {title:'Qualität: Standard (150 vox)', desc:'Zielt auf ausgewogene 0,7-mm-Zellen und bis zu 150 Voxel an der längsten Seite. Empfohlen für die normale Simulation. Bei sehr großen Rohteilen passt sich das Gitter an das Speicherbudget an.'},
  'q-high':   {title:'Qualität: Hoch (200 vox)', desc:'Zielt auf 0,5-mm-Zellen und bis zu 200 Voxel an der längsten Seite. Braucht mehr Speicher und Rechenzeit. Bei sehr großen Rohteilen passt sich das Gitter an das Speicherbudget an.'},
  'view-3d':  {title:'3D-Ansicht', desc:'Interaktive 3D-Darstellung von Werkstück und Werkzeug. Ziehen zum Drehen, Scrollen zum Zoomen, Rechtsziehen zum Verschieben. Nach der Simulation Verfeinern für ein hochauflösendes Netz nutzen.'},
  'view-2d':  {title:'XY-Werkzeugbahn', desc:'Draufsicht (2D) der Werkzeugbahn. Orange = Vorschubwege, Blau = Eilgangwege. Nützlich, um die Bahngeometrie vor der vollen Simulation zu prüfen.'},
  'view-tools':{title:'Werkzeugtabelle', desc:'Werkzeuge mit ihrer Geometrie definieren: Radius R, Länge L, Schneidenlänge, Spitzenwinkel, Kugelradius R2, DL/DR-Aufmaße. Werkzeuge werden im TOOL CALL über die Nummer aufgerufen.'},
  'path':     {title:'Bahn — Werkzeugbahn-Anzeige', desc:'Schaltet die 3D-Werkzeugbahnlinien ein/aus. Orange Linien = Zerspanungswege (Vorschub), blaue Linien = Eilgangbewegungen (FMAX).'},
  'P':        {title:'P — Polarkoordinaten', desc:'Schaltet in den Polarmodus. PR ist der Radius, PA der absolute Winkel; I auf PA erzeugt den inkrementalen Winkel IPA. Zuerst CC setzen.'},
  'I':        {title:'I — Inkremental umschalten', desc:'Schaltet den gewählten Koordinaten-Token zwischen absolut (X+50) und inkremental (IX+50) um. Inkrementale Werte beziehen sich auf die aktuelle Position.'},
  'L':        {title:'L — Gerade', desc:'Verfährt das Werkzeug geradlinig zu den angegebenen Koordinaten. Weggelassene Achsen behalten ihre Position. F setzt den Vorschub in mm/min, FMAX ist Eilgang.'},
  'C':        {title:'C — Kreisbahn (um CC)', desc:'Kreisbewegung um den zuletzt gesetzten CC-Mittelpunkt zum Endpunkt. DR+ = gegen den Uhrzeigersinn, DR− = im Uhrzeigersinn.'},
  'CC':       {title:'CC — Kreismittelpunkt', desc:'Legt Mittelpunkt bzw. Pol fest. IX/IY beziehen sich auf die letzte Werkzeugposition; CC ohne Koordinaten übernimmt diese Position.'},
  'CR':       {title:'CR — Kreisbahn (Radius)', desc:'Kreisbahn über den Radius R definiert. DR+ = gegen den Uhrzeigersinn, DR− = im Uhrzeigersinn. R+ wählt einen Bogen bis 180°, R− einen Bogen über 180°.'},
  'CT':       {title:'CT — Tangentiale Kreisbahn', desc:'Kreisbahn, die tangential an das unmittelbar vorhergehende Konturelement anschließt. LIN_Z überlagert eine lineare Z-Bewegung; die Tangentialität bleibt in der XY-Ebene.'},
  'RND':      {title:'RND — Ecken-Runden', desc:'Fügt einen Rundungsbogen mit Radius R zwischen die benachbarten Kontursätze ein. Ein optionales F gilt nur im RND-Satz.'},
  'CHF':      {title:'CHF — Fase', desc:'Fügt eine gerade Fase der angegebenen Länge zwischen zwei Kontursätze ein. Ein optionales F gilt nur im CHF-Satz.'},
  'APPR/DEP': {title:'APPR/DEP — Anfahren und Wegfahren', desc:'Ersetzt die Bedienleiste des Editors durch die APPR/DEP-Funktionsfamilie, während der Programmtext sichtbar bleibt. APPR oder DEP und danach LT, LN, CT oder LCT wählen; erneutes Drücken von APPR/DEP schließt die Auswahl.'},
  'APPR LT':  {title:'APPR LT — Tangentiales Anfahren auf einer Geraden', desc:'Fährt von PS über PH und nähert PA tangential auf einer Geraden der Länge LEN. R0, RL und RR sind erlaubt.'},
  'APPR LN':  {title:'APPR LN — Senkrechtes Anfahren auf einer Geraden', desc:'Nähert PA auf einer Geraden der Länge LEN senkrecht zum ersten Konturelement. Erfordert RL oder RR.'},
  'APPR CT':  {title:'APPR CT — Tangentiales Anfahren auf einer Kreisbahn', desc:'Nähert PA tangential auf einer Kreisbahn mit vorzeichenbehaftetem R und Zentriwinkel CCA. Erfordert RL oder RR.'},
  'APPR LCT': {title:'APPR LCT — Anfahren auf Gerade und Kreisbahn', desc:'Fährt von PS nach PH auf einer Geraden und von PH nach PA auf einem Kreis, der an Gerade und erstes Konturelement tangiert. R muss positiv sein.'},
  'DEP LT':   {title:'DEP LT — Tangentiales Wegfahren auf einer Geraden', desc:'Verlässt PE tangential auf einer Geraden der Länge LEN und hebt die Radiuskorrektur automatisch auf.'},
  'DEP LN':   {title:'DEP LN — Senkrechtes Wegfahren auf einer Geraden', desc:'Verlässt PE auf einer Geraden der Länge LEN senkrecht zum letzten Konturelement und hebt die Radiuskorrektur automatisch auf.'},
  'DEP CT':   {title:'DEP CT — Tangentiales Wegfahren auf einer Kreisbahn', desc:'Verlässt PE tangential auf einer Kreisbahn mit vorzeichenbehaftetem R und Zentriwinkel CCA und hebt die Radiuskorrektur automatisch auf.'},
  'DEP LCT':  {title:'DEP LCT — Wegfahren auf Kreisbahn und Gerade', desc:'Verlässt PE auf einer tangentialen Kreisbahn und fährt anschließend tangential zum programmierten Endpunkt PN. R muss positiv sein; die Radiuskorrektur wird automatisch aufgehoben.'},
  'LP':       {title:'LP — Gerade polar', desc:'Polare Gerade. Ohne PR bleibt der aktuelle Radius erhalten; IPA inkrementiert den Winkel.'},
  'CP':       {title:'CP — Kreisbahn polar', desc:'Polare Kreisbahn um CC. PA ist absolut, IPA inkremental; IZ erzeugt zusammen mit IPA eine Helix. IPA und DR brauchen dasselbe Vorzeichen.'},
  'BLK FORM': {title:'BLK FORM — Rohteil', desc:'Definiert das Rohteil als rechteckigen Quader. 0.1 ist die MIN-Ecke, 0.2 die MAX-Ecke. Z+ ist die Oberfläche.'},
  'TOOL CALL':{title:'TOOL CALL — Werkzeug-Aufruf', desc:'Ruft ein Werkzeug über die Nummer auf. Z = Spindelachse. S = Spindeldrehzahl in U/min. F = Vorschub in mm/min.'},
  'TOOL DEF': {title:'TOOL DEF — Werkzeug vordefinieren', desc:'Lädt ein Werkzeug ins Magazin vor, damit es ohne vollen Werkzeugwechsel für den nächsten TOOL CALL bereitsteht.'},
  'CYCL DEF': {title:'CYCL DEF — Zyklus definieren', desc:'Definiert einen festen Bohr-/Fräszyklus mit Q-Parametern. Der Zyklus läuft, wenn er mit CYCL CALL an jeder Bohrposition aufgerufen wird.'},
  'CYCL CALL':{title:'CYCL CALL — Zyklus aufrufen', desc:'Führt den zuletzt definierten CYCL DEF an der aktuellen X/Y-Position aus. Vor dem Aufruf mit FMAX auf die Bohrposition fahren.'},
  'LBL':      {title:'LBL — Label (Unterprogramm)', desc:'Markiert den Beginn eines Unterprogramms. LBL 0 markiert das Ende. Labels lassen sich mit CALL LBL aufrufen und wiederholen.'},
  'CALL LBL': {title:'CALL LBL — Label aufrufen', desc:'Führt ein Unterprogramm mit Label aus. REP N wiederholt es N-mal (1 REP = insgesamt 2 Ausführungen).'},
  'M0':       {title:'M0 — Programm-Halt', desc:'Hält das Programm an. Zum Fortsetzen Start drücken. Nützlich zum Prüfen der Werkzeugposition oder für einen Spannmittelwechsel.'},
  'M3':       {title:'M3 — Spindel EIN im Uhrzeigersinn', desc:'Startet die Spindel im Uhrzeigersinn (Standard für rechtsschneidende Werkzeuge). Nach TOOL CALL verwenden.'},
  'M4':       {title:'M4 — Spindel EIN gegen den Uhrzeigersinn', desc:'Startet die Spindel gegen den Uhrzeigersinn. Für linksschneidende Werkzeuge.'},
  'M5':       {title:'M5 — Spindel STOPP', desc:'Hält die Spindel an. Vor dem Werkzeugwechsel verwenden.'},
  'M7':       {title:'M7 — Kühlmittel EIN (Sprühnebel)', desc:'Schaltet die Sprühnebel-Kühlung ein.'},
  'M8':       {title:'M8 — Kühlmittel EIN (Flutung)', desc:'Schaltet die Flutkühlung ein. Nach TOOL CALL verwenden.'},
  'M9':       {title:'M9 — Kühlmittel AUS', desc:'Schaltet alle Kühlmittel aus. Vor dem Werkzeugwechsel verwenden.'},
  'M30':      {title:'M30 — Programm-Ende', desc:'Beendet das Programm und setzt es an den Anfang zurück. Entspricht END PGM.'},
  'M':        {title:'M — Zusatzfunktion', desc:'M-Funktionen steuern Maschinen-Zusatzfunktionen: Spindel (M3/M4/M5), Kühlmittel (M7/M8/M9), Programm-Halt (M0), Programm-Ende (M30). Nach TOOL CALL immer M3 und M8, vor dem Werkzeugwechsel M5 und M9.'},
  'Q':        {title:'Q — Parameterzuweisung', desc:'Weist einer Q-Variablen einen Wert oder Ausdruck zu. Q-Variablen lassen sich überall statt Zahlenwerten verwenden. Unterstützt SIN, COS, TAN, SQRT, ABS und Arithmetik.'},
  'Q200':     {title:'Q200 — Sicherheits-Abstand', desc:'Inkrementaler Abstand über der Werkstück-Oberfläche, in dem das Werkzeug im Eilgang anfährt, bevor es auf Tiefe zustellt.'},
  'Q201':     {title:'Q201 — Tiefe', desc:'Bearbeitungstiefe als negativer inkrementaler Wert ab Q203 (Werkstück-Oberfläche). Z. B. −20 = 20 mm unter der Oberfläche.'},
  'Q206':     {title:'Q206 — Vorschub Tiefenzustellung', desc:'Vorschub für die zustellende Abwärtsbewegung. FAUTO nutzt den im TOOL CALL definierten Vorschub.'},
  'Q202':     {title:'Q202 — Zustell-Tiefe', desc:'Tiefe je Zustellung (Zustellung pro Schnitt). Auf 0 oder ≥ |Q201| setzen für einschrittiges Bohren.'},
  'Q203':     {title:'Q203 — Koord. Werkstück-Oberfläche', desc:'Absolute Z-Koordinate der Werkstück-Oberfläche. Meist der obere Z-Wert von BLK FORM 0.2.'},
  'Q204':     {title:'Q204 — 2. Sicherheits-Abstand', desc:'Inkrementale Höhe über der Oberfläche für den Endrückzug nach dem Zyklus. Das Werkzeug fährt im Eilgang hierher zurück.'},
  'Q208':     {title:'Q208 — Vorschub Rückzug', desc:'Vorschub für den Rückzug aus der Bohrung. 0 nutzt denselben Vorschub wie Q206.'},
  'Q239':     {title:'Q239 — Gewindesteigung', desc:'Gewindesteigung in mm. Positiv = Rechtsgewinde, negativ = Linksgewinde. Vorschub = Steigung × Drehzahl.'},
  'Q257':     {title:'Q257 — Bohrtiefe Spanbruch', desc:'Tiefe, die der Gewindebohrer vorrückt, bevor er zum Spanbruch leicht zurückzieht. 0 = kein Spanbruch.'},
  'Q256':     {title:'Q256 — Rückzugsfaktor bei Spanbruch', desc:'Faktor der Gewindesteigung Q239 für den kurzen Spanbruch-Rückzug (Rückzug = Q256 × Q239). 0 bewirkt den vollständigen Rückzug aus der Bohrung.'},
  'measure':  {title:'◎ Messen', desc:'Klick zum Aktivieren des Messmodus. Klicke einen Punkt auf der Werkstück-Oberfläche, um seine X/Y/Z-Koordinaten zu erfassen. Zwei Punkte messen den Abstand dazwischen. Erneut klicken zum Verlassen.'},
  'bug-report':{title:'🐛 Fehlerbericht', desc:'Öffnet den Fehlerbericht-Dialog. Beschreibe, was schiefging; dein Programm wird automatisch mitgeschickt. Mit „Bild in die Zwischenablage kopieren“ einen Screenshot der 3D-Ansicht erfassen und ihn (Strg+V) in das GitHub-Issue oder die E-Mail einfügen.'},
  'editor':   {title:'NC-Programm-Editor', desc:'Schreibe hier dein Heidenhain-Klartext-NC-Programm. Klicke eine Zeile für den Inline-Feldeditor. Nutze die Tastenfeld-Schaltflächen oben zum Einfügen von Befehlen. Zeilen, die mit ; beginnen, sind Kommentare.'},
  'export':   {title:'↓ Export', desc:'Lädt das aktuelle NC-Programm als .H-Datei (Heidenhain-Format) herunter. Du kannst sie in eine echte TNC-Steuerung laden oder als Sicherung behalten.'},
  'speed':    {title:'Simulationsgeschwindigkeit', desc:'Steuert das Abspieltempo der Simulation. − verlangsamt, + beschleunigt. Bereich 0,1× (sehr langsam, für schrittweise Prüfung) bis 8× (schnelle Vorschau). Das Tempo beeinflusst die Genauigkeit nicht.'},
  'line-nums':{title:'Satznummern', desc:'Zeigt die Satznummer jeder NC-Zeile. Orange = gerade laufender Satz. Rot = Fehler, Gelb = Warnung. Zeige mit der Maus darauf, um die Löschen-Schaltfläche (✕) der Zeile einzublenden. Klick auf eine Satznummer springt dorthin.'},

  // ── Werkzeugtabelle-Spalten ──
  'tt-T':       {title:'T — Werkzeug-Nummer', desc:'Werkzeugnummer, die im TOOL CALL verwendet wird. Das aktive Werkzeug (durch den letzten TOOL CALL im Programm gewählt) ist mit ▶ hervorgehoben.'},
  'tt-TYPE':    {title:'TYPE — Werkzeugtyp', desc:'Fräser (Schaft- oder Kugelfräser, schneidet mit R/R2), Bohrer (Spiralbohrer oder Reibahle, fester Radius = R) oder Senker (Fase/Entgraten, beliebiger Winkel, R≈0,001 spitzenbezogen — Durchmesser über DR im TOOL CALL). Legt fest, welche Felder zählen und wie der Simulator zerspant.'},
  'tt-NAME':    {title:'NAME — Werkzeugname', desc:'Kurzer Bezeichner für das Werkzeug, z. B. END_MILL_D10. Max. 16 Zeichen, keine Leerzeichen. Rein beschreibend — vom NC-Programm selbst nicht genutzt.'},
  'tt-L':       {title:'L — Werkzeug-Länge (mm)', desc:'Abstand von der Spindel-Bezugsebene bis zur Werkzeugspitze. Für die Längenkorrektur in der Z-Achse.'},
  'tt-R':       {title:'R — Werkzeug-Radius (mm)', desc:'FRÄSER: Schneidenradius = Durchmesser / 2, für die RL/RR-Korrektur. BOHRER/REIBAHLE: der reale, feste Schneidenradius — der größte Radius außerhalb der Spitze; DR/RR/RL werden nicht angewandt. SENKER: meist ≈0,001 (scharfe Spitze); ein realer R ergibt eine flache/abgeschnittene Spitze dieses Radius — der Kegel weitet sich darüber weiter bis zum LCUTS/T-ANGLE-Maximaldurchmesser. Ändert sich nicht durch DR (DR ist nur Bahnversatz).'},
  'tt-R2':      {title:'R2 — Eckenradius (mm)', desc:'Radius der gerundeten Schneidenecke (Torus-/Kugelfräser). 0 = Schaftfräser mit flacher Stirn. R2 = R ergibt einen vollen Kugelfräser.'},
  'tt-DL':      {title:'DL — Aufmaß Länge (mm)', desc:'Delta-Wert, der zur Werkzeug-Länge L addiert wird. Positiv = Werkzeug schneidet flacher, negativ = tiefer. Für Verschleiß-/Längenkorrektur im TOOL CALL.'},
  'tt-DR':      {title:'DR — Aufmaß Radius (mm)', desc:'Tabellen-DR = physisches Aufmaß des realen FRÄSERS (schneidet breiter). DR im TOOL CALL = programmiertes Aufmaß, ADDIERT zum Tabellenwert; es versetzt nur die Werkzeug-BAHN (RL/RR, Zyklen), der physische Schnitt bleibt gleich — z. B. TOOL CALL DR+0.2 lässt 0,2 mm Schlichtaufmaß an der Wand stehen, genau wie an der echten Steuerung. BOHRER/REIBAHLE: verändert den Schnitt nie. SENKER: verformt den Kegel NICHT — nur Bahnversatz (RL/RR, CYCL DEF 208). Kombiniere mit DL = −DR/tan(T-ANGLE/2), damit die Kegelkante genau auf diese versetzte Bahn trifft.'},
  'tt-DR2':     {title:'DR2 — Aufmaß R2 (mm)', desc:'Delta-Wert, der zum Eckenradius R2 addiert wird — dasselbe Prinzip wie DR, aber für die gerundete Ecke eines Torus-/Kugelfräsers.'},
  'tt-CUT':     {title:'CUT — Anzahl der Schneiden', desc:'Referenzzahl der Schneiden. Wird gespeichert und exportiert, ändert im Simulator aber weder Berechnungen noch Schnittgeometrie.'},
  'tt-RCUTS':   {title:'RCUTS — über Mitte schneidende Schneiden', desc:'Anzahl der Schneiden, die bis zur Werkzeugmitte reichen. Zyklus 208 erlaubt direktes axiales Eintauchen nur, wenn RCUTS größer als 0 ist.'},
  'tt-LCUTS':   {title:'LCUTS — Schneidenlänge (mm)', desc:'FRÄSER: Schneidenlänge entlang der Werkzeugachse — wie weit die Schneiden hochschneiden (voller Kugelfräser nutzt automatisch R2). BOHRER/REIBAHLE: die reale Schneiden-/Nuthöhe — rein informativ, ohne Bezug zu R oder T-ANGLE (Faustregel: ~6× Durchmesser bei einem Standardbohrer). SENKER: erforderlich, zusammen mit T-ANGLE — legt den Maximaldurchmesser für die Simulation fest: Ø = 2×LCUTS×tan(T-ANGLE/2), gemessen ab der gedachten scharfen Spitze (unabhängig von R).'},
  'tt-ANGLE':   {title:'ANGLE — Max. Eintauchwinkel (°)', desc:'Maximaler Winkel für helikales Eintauchen / Rampen. In Zyklus 208 begrenzt ein Wert ≠ 0 die programmierte Q334-Zustellung pro Umdrehung.'},
  'tt-TANGLE':  {title:'T-ANGLE — Spitzenwinkel (°)', desc:'Voller Spitzenwinkel eines spitzen Werkzeugs — Bohrer 118° (Standard für neue BOHRER), Zentrierbohrer 142°, Senker/Fase — beliebiger Winkel (erforderlich, zusammen mit LCUTS). 0 deaktiviert die kegelige Spitze (Schaftfräser / Kugelfräser). BOHRER: Spitze weitet sich bis zum realen R, dann konstanter Schaft-R. SENKER: weitet sich von R (meist ≈0,001) bis zum aus LCUTS abgeleiteten Maximaldurchmesser.'},
  'tt-PITCH':   {title:'PITCH — Gewindesteigung (mm)', desc:'Optionale Gewindesteigung der Werkzeugtabelle für Gewindebohrer. Bei einem Wert ≠ 0 verlangt Zyklus 209, dass |Q239| damit übereinstimmt, bevor eine synchronisierte Gewindebohrbahn erzeugt wird.'},
  'tt-TL':      {title:'TL — Werkzeug gesperrt', desc:'Wenn gesetzt, kann TOOL CALL dieses Werkzeug nicht verwenden. Nennt RT ein entsperrtes Ersatzwerkzeug, nutzt der Simulator es automatisch; sonst stoppt die Prüfung den Ablauf.'},
  'tt-RT':      {title:'RT — Schwester-Werkzeug', desc:'Werkzeugnummer eines entsperrten Schwester-Werkzeugs, das automatisch verwendet wird, wenn dieses Werkzeug gesperrt ist. 0 = kein Ersatz.'},
  'tt-TIME2':   {title:'TIME2 — Standzeit-Grenze (min)', desc:'Standzeit-Grenze für die abgeschlossene Simulation. Beim Erreichen wird das Werkzeug für den nächsten Ablauf gesperrt. 0 = keine Grenze.'},
  'tt-CURTIME': {title:'CUR.TIME — Aktuelle Standzeit', desc:'Für die zuletzt abgeschlossene Simulation berechnete Zerspanungszeit, angezeigt gegen TIME2. Bei erneutem Ablauf desselben Programms wird sie neu berechnet, nicht erneut addiert.'},
  'tt-DOC':     {title:'DOC — Dokumentationshinweis', desc:'Freitext-Notiz zum Werkzeug (z. B. Hersteller, Teilenummer, Besonderheiten). Rein informativ.'},
  'undo':       {title:'↺ Rückgängig', desc:'Macht die letzte Editieränderung rückgängig. Vor destruktiven Änderungen (neue Zeile tippen, Löschen, Einfügen, Feldmodus einer Zeile) werden Schnappschüsse angelegt. Die Zahl in Klammern zeigt die Anzahl der verfügbaren Rückgängig-Schritte.'},
  'redo':       {title:'↻ Wiederholen', desc:'Wendet eine gerade rückgängig gemachte Änderung erneut an. Nur direkt nach einem Rückgängig verfügbar — jede neue Änderung leert den Wiederholen-Speicher.'},
  'editor-reset':{title:'↺ Reset', desc:'Verwirft alle Änderungen und stellt das Standard-Startprogramm wieder her. Fragt zuerst nach Bestätigung.'},
  'editor-clear':{title:'✕ Leeren', desc:'Löscht den Programmkörper, behält aber die Zeilen BEGIN PGM / END PGM, damit die Prüfung zufrieden bleibt. Fragt zuerst nach Bestätigung.'},
  'editor-zoom':{title:'A− / A+ — Editor-Textgröße', desc:'Verkleinert oder vergrößert die Schriftgröße von Code-Editor und Satznummern. Reine Anzeigeeinstellung — ohne Wirkung auf das Programm selbst.'},
};
function applyAndroidGermanRuntime(){
  if(!(window.I18N && I18N.getLang() === 'de')) return;
  if(typeof M_DEFS !== 'undefined'){
    for(var mi=0;mi<M_DEFS.length;mi++){
      if(M_DEFS_DE[M_DEFS[mi].m]) M_DEFS[mi].desc=M_DEFS_DE[M_DEFS[mi].m];
    }
  }
  if(typeof HELP_MAP !== 'undefined'){
    for(var key in HELP_MAP_DE){
      if(HELP_MAP[key]){
        HELP_MAP[key].title=HELP_MAP_DE[key].title;
        HELP_MAP[key].desc=HELP_MAP_DE[key].desc;
      }
    }
  }
}