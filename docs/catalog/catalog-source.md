# Reinhausen in-tank resistor OLTC — source citations

Extracted 2026-09-20 from public Reinhausen PDFs and product pages. Numbers below are only those that appear in a fetched source. If a PDF and a web snippet disagree, the PDF wins.

## Citation table

| Family | Document | ID | Date / rev | URL | Local extract |
|--------|----------|----|------------|-----|---------------|
| (all) | Technical Data TD 61 General Section | 1800061/04 EN | 2021 | https://www.reinhausen.com/fileadmin/downloadcenter/products/overview/technical_data/1800061_en.pdf | `docs/brochure-extracts/1800061_en_overview.txt` |
| (all) | OLTC technical overview (1-page table) | — | live site 2026-09-20 | https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/overview/oltc_technical_overview.pdf | `docs/brochure-extracts/oltc_technical_overview.txt` |
| (all) | Portfolio page | — | live site 2026-09-20 | https://www.reinhausen.com/portfolio/on-load-tap-changers | (HTML fetch) |
| VACUTAP VI | Operating instructions | 7993270/03 EN | — | https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/vacutap_vi/ba/ba_vi/bal_7993270_en.pdf | `docs/brochure-extracts/7993270_en_VI.txt` |
| VACUTAP VI | Product page | — | live site 2026-09-20 | https://www.reinhausen.com/productdetail/on-load-tap-changers/vacutap-vi | (HTML fetch) |
| VACUTAP VV | Technical Data TD 203 | 1800203/09 EN | — | https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/vv/td/1800203_en.pdf | `docs/brochure-extracts/1800203_en_VV.txt` |
| VACUTAP VV | Compact flyer | F0053808 | older than TD 203 | https://www.reinhausen.com/fileadmin/downloadcenter/oltc/vv/f0053808_en_vacutapvv_compact_oltc.pdf | `docs/brochure-extracts/f0053808_en_VV_compact.txt` |
| VACUTAP VV | Product page | — | live site 2026-09-20 | https://www.reinhausen.com/productdetail/on-load-tap-changers/vacutap-vv | (HTML fetch) |
| VACUTAP VM | Technical Data | 2332907/07 EN | — | https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/vm/technical_data/2332907_en.pdf | `docs/brochure-extracts/2332907_en_VM.txt` |
| VACUTAP VM | Product page | — | live site 2026-09-20 | https://www.reinhausen.com/productdetail/on-load-tap-changers/vacutap-vm | (HTML fetch) |
| VACUTAP VRS/VRM/VRL/VRH/VRX | Current VR flyer | IN5062036/04 EN | 03/2026 (F0340004) | https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/vr/flyer/in5062036_en.pdf | `docs/brochure-extracts/in5062036_en_VR.txt` |
| VACUTAP VR | Product page | — | live site 2026-09-20 | https://www.reinhausen.com/productdetail/on-load-tap-changers/vacutap-vr | (HTML fetch) |
| OILTAP V | Technical Data TD 82 | TD 82/03 EN | — | https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/oiltap_v/technical_data/082_03en.pdf | `docs/brochure-extracts/082_03en_OILTAP_V.txt` |
| OILTAP V | Product page | — | live site 2026-09-20 | https://www.reinhausen.com/productdetail/on-load-tap-changers/oiltap-v | (HTML fetch) |
| OILTAP G | Technical Data TD 48 | 1800048/03 EN | 2018 | https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/oiltap_g/technical_data/td_g_1800048_03_en.pdf | `docs/brochure-extracts/1800048_03_en_OILTAP_G.txt` |
| OILTAP G | Product page | — | live site 2026-09-20 | https://www.reinhausen.com/productdetail/on-load-tap-changers/oiltap-g | (HTML fetch) |

DE/PT copies of TD 48 also downloaded (`1800048_03_de_OILTAP_G.pdf`, `1800048_03_pt_OILTAP_G.pdf`). Axes use the EN file.

## Failed URLs

| URL | Result |
|-----|--------|
| https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/vr/technical_data/2188029_en.pdf | FAIL HTTP 404 |
| https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/vr/td/2188029_en.pdf | FAIL HTTP 404 |
| https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/vr/technical_data/td_vr_2188029_en.pdf | FAIL HTTP 404 |
| https://www.reinhausen.com/fileadmin/downloadcenter/products/oltc/oiltap_g/technical_data/48_en.pdf | FAIL HTTP 404 (EN TD 48 is `td_g_1800048_03_en.pdf`) |

TD 61 table 1 still names VACUTAP VR as **TD 2188029**. That PDF is not on the public fileadmin paths tried above. Current public electrical rows for VRS/VRM/VRL/VRH/VRX therefore come from flyer IN5062036/04, not from a type-data book.

## Deferred / out of scope

Do not invent rows for:

- DEETAP, ECOTAP, AVT/VT dry, VBO bolt-on, RMV-II reactor, VVS
- VACUTAP VMS (in VM TD 2332907; not in the in-scope family list)
- Previous-generation VR letter codes VRC/VRD/VRE/VRF/VRG (TD 61 still lists them; current flyer does not)
- OILTAP MS/M/RM/R (oil, but not in the in-scope list)

## Um mapping (Reinhausen, not Huaming)

Reinhausen publishes Um as **40, 76, 123, 145, 72.5, 170, 245, 300, 362, 420** kV. Not Huaming 40.5 / 126 / 252 / 363.

| Reinhausen Um | Typical use in these TDs |
|---------------|--------------------------|
| 40 | VI / VV / OILTAP V low series. TD notes test voltages of IEC type series 36 kV. |
| 76 | VI / VV / OILTAP V. TD notes test voltages of IEC type series 72.5 kV. Star-point 110/132 kV class Y often sits here on VV/VI/OILTAP V. |
| 72.5 | VM / VR / OILTAP G. Star-point 110/132 kV class Y maps here on VM/VR, **not** to 123. |
| 123 | VM / VR / OILTAP G; VV III Y; VI / OILTAP V Y. **Do not map 110 Y to 123.** |
| 123/76 | VI III 400 D and OILTAP V III … D at the 123 series (diverter insulation 123, some distances 76). |
| 145 | VV III D and VV I. TD 203: 132 kV + 15 % = 151.8 kV admissible if 145 kV test voltages are not exceeded. |
| 170, 245, 300 | VM / VR / OILTAP G. VM 300 kV is I-only (2332907 table 14 note 3). |
| 362 | VR flyer + OILTAP G product/overview range. OILTAP G TD 48 type-designation table lists 72.5/123/170/245/300 and “higher values on request”. |
| 420 | VR flyer I-types (VRL high current, VRH/VRX columns). |

## Contradictions (PDF of the family TD wins)

| Topic | Family TD | Overview / product page | Used in axes.json |
|-------|-----------|-------------------------|-------------------|
| VM positions without COS | 2332907 table 9: **18** (35 with COS, 107 with multiple coarse) | TD 61 table 4 and VM product page: **22** / 35 | **18 / 35** from VM TD |
| OILTAP V 1-/3-phase current | TD 82: III 200 / 350 standard, III 250 and III 400 special; I 350 | Product page 200 / 400 A; TD 61 III 350 / I 350; overview PDF 350 / 350 A | TD 82 rows. **No III 500** in TD 82. |
| OILTAP G 1-phase current | TD 48: G I 1600 / 3000 A | Product page and overview PDF: **4500** / 2000 A | Currents from TD 48 only. 4500 A is a published max without a type code in TD 48. |
| OILTAP G positions | TD 48: 16 (18) / 31 (35); pitch 18 not for all types | Product page 18 / 35; TD 61 16 / 31 | Maxima 18 / 35, with the pitch-18 caveat |
| OILTAP G Um 362 | TD 48 designation: 72.5…300, higher on request | Product page and overview PDF 72.5–362 | 72.5, 123, 170, 245, 300 from TD 48; 362 cited as published range max |
| VV step capacity | TD 203: see diagram | Overview PDF / portfolio: **700 kVA** 1- and 3-phase | 700 kVA as published max; derate from the TD diagram |
| VR type codes | Flyer: VRS/VRM/VRL/VRH/VRX | TD 61 still VRC/VRD/VRE/VRF/VRG | Flyer codes. No invented “VR III 400”. |

## Family notes used for axes

### VACUTAP VI — 7993270/03 table 7–8

- III 400 Y (neutral point) and III 400 D (any point in the winding)
- Irm 400 A; Ust 1500 V; Pst 600 kVA
- Um Y: 40 / 76 / 123; D: 40 / 76 / 123/76
- Positions 14 / 27
- No selector size letter
- No I-phase type in the BA table

### VACUTAP VV — 1800203/09 table 3–4

- III 250 Y/D, III 400 Y/D, III 600 Y/D, I 401 (400 A; 600 A on request)
- No selector size letter. Example: `VACUTAP VV III 250 Y–76 / 10 19 1W R`
- Ust 2000 V; 400/600 A derate (2000…1700 V / 2000…1000 V)
- Um series 40 / 76 / 123 / 145. Insulation table 7: III Y at 40/76/123; III D at 40/76/145. Table 8: I at 76 and 145 only.
- Positions 12 / 23
- Mechanical groups: VV III 40 kV, VV III 76/123 kV, VV III 145 kV

### VACUTAP VM — 2332907/07 tables 3–5, 9, 14

- I 351/501/651/802/1002/1203/1503 (350/500/650/800/1000/1200/1500 A)
- II 352/502/652 (and VM 300: I 301 / II 302 / III 300 Y)
- III 350 Y / 500 Y / 650 Y only. No III D type. Delta: 3× I, or VM III K = I + II (section 3.2)
- Selector sizes B, C, D, DE
- Example: `VACUTAP VM III 650 Y–72,5 / C–10 19 1W R`. TD 61 selection example: `VACUTAP VM III 500 Y – 123 / B – 10 19 1 W`
- Ust 3300 V
- Um 72.5 / 123 / 170 / 245 / 300 (300 = I only)
- Positions 18 / 35 (107 with multiple coarse). VM 300: 14 / 27, selector B only.

### VACUTAP VR current flyer — IN5062036/04

Public codes are **VRS, VRM, VRL, VRH, VRX**. III designations are Y.

| Code | I Irm (A) | II Irm (A) | III Irm (A) | Ust max (V) |
|------|-----------|------------|-------------|-------------|
| VRS | 700, 1000, 1300, 2600 | 700, 1000, 1300 | 700 Y, 1000 Y, 1300 Y | 4500 |
| VRM | 700, 1000, 1300, 2600 | 700, 1000, 1300 | 700 Y, 1000 Y, 1300 Y | 4500 |
| VRL | 1300, 1600, 1800, 2000, 2400, 2600, 3000, 3200 | 1300 | 1300 Y, 1600 Y | 4500…6000 (I 1601: 4600) |
| VRH | 650, 1300, 2600 | 650, 1300 | 650 Y, 1300 Y | 6000 |
| VRX | 650, 1300 | — | — | 12000 (footnote: see diagram) |

2600/3200 I types with last digit 22 need forced current splitting, not for arc-furnace.

Positions 18 / 35. Um 72.5 / 123 / 170 / 245 / 300 / 362 / 420 (variant-dependent). Selector: flyer says R-selector; product-page download titles also name B/C/D/DE and RC/RD/RDE/RE/RF/RES.

### OILTAP V — TD 82/03 table 1a + §2.2

- III 200 Y/D Ium 200 A; III 350 Y/D Ium 350 A; I 350 Ium 350 A
- Special designs III 250 Y/D (250 A) and III 400 Y/D (400 A); drawings on request
- **No III 500** in this TD
- Ust 1500 V (10 contacts); derates at 12/14 contacts
- Pst 300 kVA (III 200, 10 contacts) / 525 kVA (III 350, 10 contacts)
- Um Y 40/76/123; D 40/76/123/76; I 40/76
- Positions 14 / 27
- No selector size letter

### OILTAP G — 1800048/03 tables 1, 8, 9

- G III 1602 Y 1600 A; G III 2002 Y 2000 A (neutral point only)
- G I 1612 / 1622 / 1602 1600 A; G I 3022 / 3002 3000 A
- Ust 5000 V
- Pst III 5000 kVA; I 5000 / 6500 / 8000 kVA by type
- Um 72.5 / 123 / 170 / 245 / 300; higher on request
- Selector sizes D, E
- Example: `OILTAP G III 1602 Y – 72,5 / D – 10 19 1 WR`
- Positions without COS max 16 (18); with COS max 31 (35)

## Ranking used in axes.json

Minimum-adequate, vacuum first: VI 10, OILTAP V 15, VV 20, VM 40, VRS 60, VRM 61, VRL 62, VRH 63, VRX 64, OILTAP G 70. Never VR-by-default.
