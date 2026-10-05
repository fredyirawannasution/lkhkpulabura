# Cloudflare Pages — LHK

Upload/deploy folder ini sebagai Cloudflare Pages project. `_worker.js` menjadi Advanced Mode Worker dan `index.html` menjadi frontend.

## Environment Variables / Secrets

Set pada Cloudflare:

- `GAS_URL`: URL Web App Apps Script berakhiran `/exec`
- `API_TOKEN`: token yang sama dengan Script Property `API_TOKEN` di Apps Script
- `OWNER_EMAIL_MAP`: JSON mapping email Cloudflare Access ke profile key, contoh:

```json
{"fredy@contoh.go.id":"fredy"}
```

Jangan masukkan API token ke `index.html`.

## Cloudflare Access

Lindungi URL Pages dengan Cloudflare Access. Worker membaca header email akun yang sudah diautentikasi, kemudian menentukan `profileKey`. Pengguna tidak dapat memilih nama Sheet atau Spreadsheet.


### GAS URL
Configured URL: `https://script.google.com/macros/s/AKfycbwAl77M63KGmY5CQU1MmbQB2dvWZ-QK9Tydtbrycek8vDLfm4amJ9cPEgUP1msdQvB98g/exec`

Cloudflare Environment Variable `GAS_URL` may still be set explicitly in production; it overrides the built-in fallback.
