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
