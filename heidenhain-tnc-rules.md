# Heidenhain TNC 640 — Kompletné programovacie pravidlá

Referenčný dokument pre TNC Sim validátor. Zdroj: oficiálna dokumentácia TNC 640.

---

## 1. ŠTRUKTÚRA PROGRAMU

### 1.1 Povinné bloky
- `BEGIN PGM <name> MM` — prvý riadok, definuje názov a jednotky (MM/INCH)
- `END PGM <name> MM` — posledný riadok, názov sa MUSÍ zhodovať s BEGIN PGM
- Každý program musí mať oba bloky

### 1.2 BLK FORM (definícia obrobku)
- `BLK FORM 0.1 Z X+0 Y+0 Z+0` — minimálny bod (musí obsahovať X, Y, Z)
- `BLK FORM 0.2 X+100 Y+100 Z+20` — maximálny bod (musí obsahovať X, Y, Z)
- Musí byť na začiatku programu, pred akýmkoľvek pohybom
- 0.2 musí byť väčšie ako 0.1 vo všetkých osiach
- Z os v BLK FORM definuje os vretena

### 1.3 Poradie blokov
1. BEGIN PGM
2. BLK FORM 0.1 + 0.2
3. TOOL CALL (pred prvým pohybom)
4. Pohyby a operácie
5. END PGM

---

## 2. NÁSTROJE

### 2.1 TOOL DEF (definícia nástroja v programe)
```
TOOL DEF <n> L+<length> R+<radius>
```
- `n` — číslo nástroja (1-32767)
- L — dĺžka nástroja (voliteľné v programe, berie sa z tabuľky)
- R — polomer nástroja (voliteľné v programe, berie sa z tabuľky)
- TOOL DEF sa píše za TOOL CALL — pripraví nasledujúci nástroj v zásobníku
- Len číslo nástroja je povinné: `TOOL DEF 2`

### 2.2 TOOL CALL (volanie nástroja)
```
TOOL CALL <n> Z S<rpm> F<feed>
```
- `n` — číslo nástroja
- `Z` — os vretena (povinné pre 3-osové stroje)
- `S` — otáčky vretena v RPM (voliteľné ale bežné)
- `F` — default feed rate mm/min (voliteľné)
- Pred prvým pohybom MUSÍ byť TOOL CALL
- Pri TOOL CALL sa rádiusová korekcia (RL/RR) MUSÍ byť vypnutá (R0)
- Zablokovaný nástroj (TL=locked) nesmie byť volaný — chyba

### 2.3 Tabuľka nástrojov TOOL.T — kompletné stĺpce

| Stĺpec | Popis | Rozsah | Poznámka |
|---------|-------|--------|----------|
| T | Číslo nástroja | 1-32767 | Povinné, unikátne |
| NAME | Názov nástroja | max 32 znakov | Bez medzier, veľké písmená |
| L | Dĺžka nástroja (mm) | 0-9999.9999 | Od vretena po špičku |
| R | Polomer nástroja (mm) | 0-9999.9999 | Priemer / 2 |
| R2 | Polomer rohu (mm) | 0 až R | 0=flat, R2=R → ball nose |
| DL | Delta dĺžka (mm) | -9999 až +9999 | Kompenzácia opotrebenia |
| DR | Delta polomer (mm) | -9999 až +9999 | Kompenzácia opotrebenia |
| DR2 | Delta R2 (mm) | -9999 až +9999 | Kompenzácia opotrebenia R2 |
| TL | Tool Locked | Y/N | Zablokovaný nástroj |
| RT | Replacement Tool | 0-32767 | Číslo náhradného nástroja, 0=žiadny |
| TIME1 | Max životnosť (min) | 0-9999 | Pri M6 — blokuje pri prekročení |
| TIME2 | Max životnosť pri TOOL CALL (min) | 0-9999 | Blokuje pri ďalšom TOOL CALL |
| CUR.TIME | Aktuálny čas (min) | 0-9999 | Automaticky sa napočítava |
| CUT | Počet zubov | 1-99 | Pre výpočet posuvu na zub |
| LCUTS | Dĺžka reznej hrany (mm) | 0-9999 | Cycle 22/208 — max infeed |
| ANGLE | Max uhol ponoru (°) | 0-90 | Cycle 22/208 — rampovanie |
| T-ANGLE | Uhol hrotu nástroja (°) | 0-180 | Celý uhol kužeľa |
| NMAX | Max otáčky vretena | 0-99999 | Limit RPM pre nástroj |
| LTOL | Tolerancia dĺžky (mm) | 0-9999 | Pre automatické meranie |
| RTOL | Tolerancia polomeru (mm) | 0-9999 | Pre automatické meranie |
| DIRECT | Smer rezania | — | CW/CCW |
| PITCH | Stúpanie závitu (mm) | 0-9999 | Pre závitovanie |
| DOC | Komentár | text | Voľný text |

### 2.4 Pravidlá pre nástroje
- R2 nesmie byť väčšie ako R
- Ak TL=Y, TOOL CALL vyhodí chybu
- Ak CUR.TIME >= TIME2, TNC zablokuje nástroj pri ďalšom TOOL CALL a zavolá RT
- Ak CUR.TIME >= TIME1, TNC zablokuje nástroj pri najbližšom M6
- LCUTS sa kontroluje pri CYCL DEF — infeed (Q334) nesmie prekročiť LCUTS
- ANGLE sa kontroluje pri CYCL DEF 22/208 — uhol rampovania
- NMAX — ak S v TOOL CALL > NMAX, chyba

---

## 3. POHYBY

### 3.1 Lineárny pohyb L
```
L X+50 Y+30 Z-5 F800 M3
L IX+10 IY+5        ; inkrementálne
L Z+50 FMAX         ; maximálna rýchlosť (rapid)
L X+30 RL F500      ; s rádiusovou korekciou
```

**Pravidlá:**
- Musí mať aspoň jednu súradnicu (X, Y, Z, A, B, C) alebo F
- Inkrementálne: prefix `I` (IX, IY, IZ)
- Feed: `F<číslo>` alebo `FMAX` (rapid)
- FMAX len pre pohyby bez rezu (pozičné)
- RL/RR/R0 — voliteľné, rádiusová korekcia
- M funkcie: M3, M4, M5, M6, M8, M9, M30, M99 atď.

### 3.2 Oblúk C okolo stredu CC
```
CC X+50 Y+50        ; definícia stredu
C X+80 Y+50 DR+ F500
C X+20 Y+50 DR- R25
```

**Pravidlá:**
- CC MUSÍ byť definované pred C
- DR+ (CCW) alebo DR- (CW) je povinné
- R je voliteľné — polomer oblúku
- RL/RR NESMIE byť aktivované na oblúku C — musí byť na predchádzajúcom L
- Polomer oblúku musí byť >= polomer nástroja pri aktívnej RL/RR

### 3.3 Oblúk CR s polomerom
```
CR X+80 Y+50 R+25 DR+
CR X+80 Y+50 R-25 DR-   ; väčší oblúk (>180°)
```

**Pravidlá:**
- R je povinné (polomer oblúku)
- R+ → oblúk < 180°, R- → oblúk > 180°
- DR+ alebo DR- je povinné
- RL/RR NESMIE byť na tomto riadku
- R musí byť >= polomer nástroja pri aktívnej RL/RR
- R musí byť dostatočne veľký aby oblúk bol geometricky možný

### 3.4 Tangenciálny oblúk CT
```
CT X+80 Y+50 F500
```

**Pravidlá:**
- Musí nasledovať po inom pohybe (L alebo C) — tangenciálny nájazd
- X a/alebo Y sú povinné (koncový bod)
- RL/RR NESMIE byť na tomto riadku

### 3.5 Polárne súradnice

#### Pól CC (rovnaký ako stred oblúku)
```
CC X+50 Y+50
```

#### Lineárny LP
```
LP PR+30 PA+45 F500
```
- PR (polárny polomer) — povinný
- PA (polárny uhol) — povinný

#### Kruhový CP
```
CP PA+180 DR+ F500
```
- PA — povinný (koncový uhol)
- DR+ alebo DR- — povinný
- RL/RR NESMIE byť na oblúku

### 3.6 Zaoblenie RND a skosenie CHF
```
RND R5              ; zaoblenie rohov
CHF 3               ; skosenie
```

**Pravidlá:**
- RND R musí byť >= polomer nástroja pri aktívnej RL/RR
- CHF hodnota musí byť kladná
- RND/CHF sa vkladá medzi dva L bloky
- Nesmie byť prvý ani posledný pohyb v kontúre

---

## 4. RÁDIUSOVÁ KOREKCIA (RL/RR/R0)

### 4.1 Aktivácia
```
L X+50 Y+1 RL F800   ; ľavá korekcia
L X+50 Y+1 RR F800   ; pravá korekcia
```

### 4.2 Pravidlá
- RL/RR sa aktivuje LEN na L riadku — nikdy na oblúku (C, CR, CT, CP)
- Prvý pohyb s RL/RR musí byť L (nie oblúk)
- Nájazd do kontúry musí byť MIMO materiálu — tangenciálny alebo kolmý
- Zmena RL → RR (alebo naopak) MUSÍ ísť cez R0
- Priama zmena RL ↔ RR je chyba
- R0 musí byť pred END PGM
- R0 musí byť pred TOOL CALL (zmena nástroja)
- R0 by mala byť na pohybe MIMO materiálu
- Dva po sebe nasledujúce pohyby s RL/RR nesmú byť kratšie ako priemer nástroja
- Pri aktívnej RL/RR sa nástroj posúva kolmo na dráhu o polomer R
- Vnútorný roh: TNC automaticky vloží oblúk
- Vonkajší roh: TNC predĺži dráhy do priesečníku

### 4.3 Nájazd a výjazd z kontúry
- APPR LT — nájazd lineárny tangenciálny
- APPR LN — nájazd lineárny normálový (kolmý)
- APPR CT — nájazd oblúkom tangenciálne
- APPR LCT — nájazd línia + oblúk tangenciálne
- DEP LT — výjazd lineárny tangenciálny
- DEP LN — výjazd lineárny normálový
- DEP CT — výjazd oblúkom tangenciálne
- DEP LCT — výjazd línia + oblúk tangenciálne

---

## 5. CYKLY

### 5.1 Všeobecné pravidlá pre všetky cykly
- CYCL DEF definuje cyklus, CYCL CALL alebo M99 ho zavolá
- Q201 (Depth) — musí byť záporný (smer do materiálu). Ak kladný → warning/error
- Q201 = 0 → cyklus sa NEVYKONÁ
- Q200 (Safety clearance) — musí byť kladný, > 0
- Q204 (2nd Safety clearance) — musí byť >= Q200
- Q203 (Surface coordinate) — súradnica povrchu obrobku
- Pred CYCL CALL musí byť R0 (žiadna rádiusová korekcia)
- Pozícia nástroja pred CYCL CALL/M99 definuje bod obrábania

### 5.2 Vŕtacie cykly

#### CYCL DEF 200 — DRILLING (vŕtanie)
- Q200: Safety clearance (> 0)
- Q201: Depth (záporný!)
- Q206: Feed rate plunging (> 0)
- Q202: Infeed depth per pass (> 0, <= |Q201|)
- Q210: Dwell time at top (>= 0)
- Q203: Surface coordinate
- Q204: 2nd safety clearance (>= Q200)
- Q211: Dwell time at bottom (>= 0)
- **Pravidlá:** Pozičný blok s R0 pred M99/CYCL CALL

#### CYCL DEF 201 — REAMING (vystružovanie)
- Rovnaké Q parametre ako 200
- Q206: Feed rate — musí byť nižší ako pri vŕtaní
- **Pravidlá:** Vystružovanie len do predvŕtanej diery

#### CYCL DEF 202 — BORING (vyvŕtavanie)
- Q200, Q201, Q206, Q211, Q203, Q204
- Q214: Retract direction (smer odtiahnutia)
- **Pravidlá:** Orientácia vretena cez M19 pred retractom

#### CYCL DEF 203 — UNIVERSAL DRILLING (univerzálne vŕtanie)
- Q200, Q201, Q206, Q202, Q210, Q203, Q204, Q211
- Q395: Depth reference (0=tool tip, 1=cutting edge)
- **Pravidlá:** Ako CYCL 200 ale s pecking (lámanie triesok)

#### CYCL DEF 205 — UNIVERSAL PECKING (univerzálne hlbinné vŕtanie)
- Q200, Q201, Q206, Q202, Q203, Q204, Q211
- Q208: Feed retract
- Q395: Depth reference
- **Pravidlá:** Pre hlboké diery s vyťahovaním na Q200

#### CYCL DEF 208 — BORE MILLING (frézovanie otvoru)
- Q200: Safety clearance
- Q201: Depth (záporný!)
- Q206: Feed rate plunging
- Q334: Infeed per pass (> 0, <= LCUTS nástroja)
- Q203: Surface coordinate
- Q204: 2nd safety clearance
- Q335: Nominal diameter (priemer otvoru, > priemer nástroja)
- Q342: Pre-drilled diameter (>= 0)
- Q351: Milling mode (+1 = climb/CCW, -1 = conventional/CW)
- **Pravidlá:**
  - Q335 (priemer otvoru) MUSÍ byť > priemer nástroja (2×R)
  - Q334 (infeed) MUSÍ byť <= LCUTS nástroja
  - Q342 (predvŕtaný priemer) musí byť < Q335
  - Ak Q342 > 0, cyklus začne šroubovicovým ponorem od Q342

### 5.3 Závitové cykly

#### CYCL DEF 206 — TAPPING (závitovanie s držiakom)
- Q200, Q201, Q206, Q203, Q204, Q211
- **Pravidlá:**
  - Feed = RPM × stúpanie závitu (PITCH z tabuľky)
  - Závitník musí byť v predvŕtanej diere
  - Vreteno musí byť synchrónne

#### CYCL DEF 207 — RIGID TAPPING (závitovanie bez kompenzácie)
- Rovnaké ako 206 ale bez axiálnej kompenzácie
- **Pravidlá:** Stroj musí mať encoder na vretene

#### CYCL DEF 209 — THREAD MILLING (frézovanie závitu)
- Q200, Q201, Q203, Q204
- Q335: Nominal diameter
- Q239: Pitch (stúpanie)
- Q351: Milling mode
- **Pravidlá:**
  - Priemer frézy < priemer závitu
  - Fréza musí mať správny profil pre stúpanie

### 5.4 Vrecko / kontúrne cykly

#### CYCL DEF 22 — POCKET ROUGHING (hrubovanie vrecka)
- Q200, Q201, Q206, Q202, Q203, Q204
- Q207: Feed milling
- Q209: Side infeed per pass
- **Pravidlá:**
  - Q334 (infeed) <= LCUTS
  - ANGLE z tool table definuje max uhol rampovania
  - Q209 (side infeed) <= priemer nástroja
  - Nesmie byť aktívna RL/RR

#### CYCL DEF 23 — POCKET FINISHING (dokončenie vrecka)
- Rovnaké Q parametre
- **Pravidlá:** Musí nasledovať po CYCL DEF 22

### 5.5 Vzory dier

#### CYCL DEF 220 — POLAR PATTERN (polárny vzor)
- Q216: Center 1st axis
- Q217: Center 2nd axis
- Q244: Starting angle
- Q245: Ending angle
- Q241: Number of repetitions
- Q200, Q203, Q204
- **Pravidlá:** Pred tým musí byť definovaný vŕtací cyklus (200, 201, atď.)

#### CYCL DEF 221 — LINEAR PATTERN (lineárny vzor)
- Q225: Starting point 1st axis
- Q226: Starting point 2nd axis
- Q237: Pitch 1st axis
- Q238: Pitch 2nd axis
- Q242: Number of rows
- Q243: Number of columns
- **Pravidlá:** Pred tým musí byť definovaný vŕtací cyklus

---

## 6. LBL / CALL LBL (podprogramy)

### 6.1 Syntax
```
LBL 1                    ; začiatok podprogramu
  L X+10 Y+10 F500
LBL 0                    ; koniec podprogramu

CALL LBL 1               ; zavolanie
CALL LBL 1 REP 5         ; zavolanie 5× opakované
```

### 6.2 Pravidlá
- LBL 0 je vždy koniec — nemôže byť použitý ako identifikátor
- LBL číslo musí byť unikátne v programe
- Maximálny počet vnorení: závisí od kontroléra (typicky 8)
- CALL LBL na neexistujúci LBL → chyba
- REP musí byť >= 1
- Rekurzia (LBL volá sám seba) → chyba

---

## 7. M FUNKCIE

### 7.1 Prehľad
| M | Funkcia | Vykonáva sa |
|---|---------|-------------|
| M0 | Programovaný stop | Na konci bloku |
| M1 | Podmienený stop | Na konci bloku |
| M2 | Koniec programu | Na konci bloku |
| M3 | Vreteno CW | Na začiatku bloku |
| M4 | Vreteno CCW | Na začiatku bloku |
| M5 | Stop vretena | Na konci bloku |
| M6 | Výmena nástroja | Na konci bloku |
| M8 | Chladenie ON | Na začiatku bloku |
| M9 | Chladenie OFF | Na konci bloku |
| M13 | Vreteno CW + chladenie | Na začiatku bloku |
| M14 | Vreteno CCW + chladenie | Na začiatku bloku |
| M19 | Orientácia vretena | — |
| M30 | Koniec programu (ako M2) | Na konci bloku |
| M89 | Volanie cyklu (ako M99) | — |
| M91 | Súradnice v strojovom systéme | — |
| M92 | Súradnice v strojovom systéme (pozícia zmeny) | — |
| M99 | Volanie cyklu na aktuálnej pozícii | Na konci bloku |

### 7.2 Pravidlá
- M99 vyžaduje predchádzajúci CYCL DEF
- M3/M4 pred prvým rezným pohybom
- M6 len na bezpečnej Z výške
- M91/M92 — súradnice sú v strojovom systéme, nie v obrobkovom
- M funkcie sa vykonávajú buď na ZAČIATKU alebo na KONCI bloku

---

## 8. Q PARAMETRE

### 8.1 Syntax
```
Q1 = 50               ; priradenie
Q2 = Q1 + 10          ; aritmetika
Q3 = SIN Q1           ; trigonometria
FN 0: Q10 = +100      ; FN príkaz
```

### 8.2 Rozsahy
- Q0 – Q99: voľne použiteľné
- Q100 – Q199: len čítanie (výsledky meracích cyklov)
- Q200 – Q399: cyklové parametre
- Q1000+: voľné rozšírené parametre

### 8.3 Pravidlá
- Q parameter v CYCL DEF musí mať formát `Q<číslo>=<hodnota>`
- Znamienko: `+` pre kladné, `-` pre záporné
- Desatinné čísla: bodka ako oddeľovač
- Q parametre v cykloch sa MUSIA zadať v správnom poradí

---

## 9. CHYBOVÉ HLÁŠKY — kedy TNC vyhodí chybu

### 9.1 Fatálne chyby (program sa nespustí)
- Chýba BEGIN PGM / END PGM
- BEGIN/END PGM mená sa nezhodujú
- TOOL CALL na zablokovaný nástroj (TL=Y)
- RL/RR na oblúku (C, CR, CT, CP)
- Zmena RL↔RR bez R0
- CYCL CALL/M99 bez predchádzajúceho CYCL DEF
- LBL volanie neexistujúceho podprogramu
- Q201 kladný (závisí od MP displayDepthErr)
- CR bez R alebo DR
- C bez predchádzajúceho CC

### 9.2 Varovania (program sa spustí ale upozorní)
- Chýba BLK FORM
- TOOL CALL bez S (otáčky)
- Pohyb pred TOOL CALL
- Q201 = 0 (cyklus sa nevykoná)
- Veľký uhol rampovania vs ANGLE
- CUR.TIME blízko TIME2

### 9.3 Runtime chyby (počas behu)
- Kolízia (rapid do materiálu)
- Prekročenie rozsahu osí
- S > NMAX (otáčky > max pre nástroj)
- Odchýlka polohy > tolerancia
- Tool breakage (ak je aktivovaná kontrola)

---

## 10. SYNTAX — všeobecné pravidlá

### 10.1 Formát riadku
- Každý blok na novom riadku
- Komentár: `; text` na konci riadku alebo samostatný riadok
- Medzery medzi tokenmi
- Veľké písmená (TNC je case-insensitive ale konvencia je uppercase)
- Čísla: voliteľné znamienko (+/-), desatinná bodka

### 10.2 Súradnice
- Absolútne: `X+50` alebo `X-10.5`
- Inkrementálne: `IX+10` alebo `IY-5`
- Znamienko je POVINNÉ: `X+0` nie `X0`
- Desatinné miesta: max 4 (0.0001 mm)

### 10.3 Feed rate
- `F<číslo>` — mm/min
- `FMAX` — maximálna rýchlosť (rapid)
- Feed ostáva aktívny až do ďalšieho F
- FMAX platí len pre daný blok

### 10.4 Postupnosť tokenov v L bloku
```
L [I]X±n [I]Y±n [I]Z±n [R<L|R|0>] [F<n>|FMAX] [M<n>]
```
Poradie: súradnice → korekcia → feed → M funkcia

---

## 11. ŠPECIFICKÉ PRAVIDLÁ PRE SIMULÁTOR

### 11.1 Voxelové frézovanie
- Valcový nástroj (R2=0, T-ANGLE=0): konštantný polomer na všetkých Z
- Guľová fréza (R2>0): polomer na Z = √(R2² - (R2-dz)²)
- Kužeľový nástroj (T-ANGLE>=90°): polomer na Z = dz × tan(angle/2)
- Flat end mill: plný polomer R na všetkých Z od špičky nahor

### 11.2 Rádiusová korekcia — look-ahead
- TNC číta 3 bloky dopredu pre výpočet korekcie
- Na rohoch: bisector (uhol pôlosa) dvoch normál
- Vnútorné rohy: vloží oblúk
- Vonkajšie rohy: predĺži dráhy

### 11.3 Odhadovaný čas obrábania
- Rezné pohyby: čas = dĺžka / feed
- Rapid pohyby: čas = dĺžka / 10000 mm/min (predpokladaná rapid rýchlosť)
- CUR.TIME sa počíta len z rezných pohybov (nie rapid)
