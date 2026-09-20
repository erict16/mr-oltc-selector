# Commercial type string (Reinhausen)

This is the string the selector will emit. It follows public Reinhausen designation examples in TD 61, TD 203, TD 2332907, TD 48, and flyer IN5062036. It is **not** a Huaming SERIES string.

## Two shapes

**Compound (no selector-size letter)** — VI, VV, OILTAP V:

```
VV III 250 Y-76-10 19 3W
```

TD 203 prints the same idea as `VACUTAP VV III 250 Y–76 / 10 19 1W R` (slash after Um, optional trailing potential-connection letter R/S/P). The commercial form drops VACUTAP®, the slash, and the potential letter unless a later rule asks for it.

**Combined (selector-size letter)** — VM, VR families, OILTAP G:

```
VM III 500 Y-123/B-10 19 3W
```

TD 61 selection example: `VACUTAP VM III 500 Y – 123 / B – 10 19 1 W`.
VM TD example: `VACUTAP VM III 650 Y–72,5 / C–10 19 1W R`.
OILTAP G TD example: `OILTAP G III 1602 Y – 72,5 / D – 10 19 1 WR`.

Size letter sits after Um: `123/B`, `72.5/C`, `72.5/D`.

## Fields

| Slot | Meaning | Source |
|------|---------|--------|
| Family code | VV, VM, VI, VRS, VRM, VRL, VRH, VRX, V, G | Family TD / VR flyer |
| Phases | I, II, III | Same |
| Current token | III: 250, 400, 500, 650, 700, … (Ium, no sector digit). I/II: 401, 501, 651, 701, … (Ium + sector count as last digit) | TD type tables |
| Connection | Y or D | Y = star-point; D = any point / delta |
| Um | Reinhausen 40, 76, 123, 145, 72.5, 170, 245, 300, 362, 420 | Family TD. Not Huaming 40.5/126/252/363 |
| Size letter | B, C, D, DE (VM); D, E (G); B/C/D/DE or RC/RD/RDE/RE/RF/RES (VR) | Combined families only |
| Basic connection | e.g. `10 19 3W` | Pitch, max positions, mid-positions, W or G |

`3W` vs `1W` is the mid-position count in the basic-connection diagram, not a third winding.

## When III D does not exist

VM III, VRS/VRM/VRL/VRH III, and OILTAP G III are **Y-only** in the public TDs. Do not print a fake `VM III 500 D`.

For a three-phase delta / line-end application:

```
3x VM I 501-123/B-10 19 3W
```

VM TD 2332907 §3.2 also describes a two-column **VM III K** = VM I + VM II for delta. That is a special combination, not a III D type.

VV III and VI III and OILTAP V III **do** have D types, so a single three-phase unit is the commercial string.

## Family-specific tokens

| Family | Current token examples | Size letter | III D |
|--------|------------------------|-------------|-------|
| VI | III 400 | none | yes (`VI III 400 D`) |
| VV | III 250/400/600; I 401 | none | yes |
| VM | III 350/500/650 Y; I 351/501/651/802/1002/1203/1503 | B/C/D/DE | no → `3x VM I …` |
| VRS | III 700/1000/1300 Y; I 701/1001/1301/2622 | yes | no |
| VRM | same pattern as VRS | yes | no |
| VRL | III 1300/1600 Y; I 1301/1601/1801/2001/2401/2601/3001/3201/3222 | yes | no |
| VRH | III 650/1300 Y; I 651/1301/2622 | yes | no |
| VRX | I 652 / 1302 only | yes | no III |
| OILTAP V | III 200/250/350/400 Y or D; I 350 | none | yes |
| OILTAP G | III 1602/2002 Y; I 1612/1622/1602/3022/3002 | D/E | no |

Do not emit `VR III 400`. That code is not on the current flyer.

## Um for 110 kV star-point

- VM / VR / OILTAP G → **72.5**, not 123
- VV / VI / OILTAP V → **76**, not 123
