# OLTC selector

Indicative on-load tap-changer type helper. Not an official manufacturer tool.

Fill duty (Imax or MVA+kV, Um, Y/D, reversing/coarse/linear, vacuum/oil, in-tank) and get a commercial type that exists on public VACUTAP / OILTAP axes.

- Web: https://erict16.github.io/mr-oltc-selector/
- CLI: `npx -y mr-oltc-selector@1.0.3 --iu 350 --um 72.5 --conn Y --reg W --pm 8`

No prices. Pin a version; do not `npm i -g`. `--iu` is Imax and is never multiplied by `--k` (`k` is capacity-path only).

Minimum-adequate ranking: compact vacuum (VI, VV) before VM before VRS / VRM / VRL / VRH / VRX. Oil families only when oil is requested. If nothing covers, the result is out of catalogue.

Star-point 110/132 kV class Y maps switch Um to 72.5 (covering then uses 76 on VI/VV). Combined III is Y-only; delta uses 3× I when that row exists.
