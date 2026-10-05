# LHK KPU Labuhanbatu Utara — GitHub → Cloudflare Pages

Repository ini **langsung siap dipasang sebagai Cloudflare Pages melalui GitHub**.

## PENTING: jangan pakai `npx wrangler deploy`

Deployment sebelumnya gagal karena Cloudflare menjalankan `npx wrangler deploy` sebagai Worker Static. Itu membuat `_worker.js` dianggap sebagai asset dan ditolak.

Untuk repository ini gunakan **Cloudflare Pages → Connect to Git** dan biarkan Cloudflare Pages yang menangani `_worker.js` sebagai Pages Advanced Mode.

### Cloudflare Pages Build settings

- Framework preset: **None**
- Production branch: **main**
- Build command: **kosong / none**
- Build output directory: **`.`** (root repository)
- Root directory: **kosong / root**

Jangan masukkan `npx wrangler deploy` sebagai Build command.

## Struktur repository

```text
/
├── index.html
├── _worker.js
├── _headers
├── backend-apps-script/
│   ├── Code.gs
│   └── README.md
└── README.md
```

## Environment Variables / Secrets Cloudflare

Di Pages project → Settings → Environment variables tambahkan:

`GAS_URL`

```text
https://script.google.com/macros/s/AKfycbwAl77M63KGmY5CQU1MmbQB2dvWZ-QK9Tydtbrycek8vDLfm4amJ9cPEgUP1msdQvB98g/exec
```

`API_TOKEN`

Harus sama persis dengan Script Property `API_TOKEN` pada Apps Script.

`OWNER_EMAIL_MAP`

Contoh:

```json
{"emailanda@example.com":"fredy"}
```

Untuk beberapa pemilik:

```json
{"fredy@example.com":"fredy","riduan@example.com":"muhammad_riduan"}
```

## Cloudflare Access

Lindungi Pages site dengan Cloudflare Access. Worker membaca header:

`Cf-Access-Authenticated-User-Email`

Email tersebut dicocokkan dengan `OWNER_EMAIL_MAP`. Pengguna yang tidak terdaftar mendapat HTTP 403.

## Google Apps Script

Backend ada di `backend-apps-script/Code.gs`.

Identitas pemilik dikunci di `OWNER_PROFILES`. Browser tidak mengirim `spreadsheetId` atau `sheetName` sebagai sumber kebenaran.

## Fitur

- Tambah kegiatan = menambah baris fisik sebelum footer.
- Edit dan hapus kegiatan.
- Pilih bulan laporan.
- Bahasa Indonesia dan timezone Asia/Jakarta.
- Tanggal tanda tangan otomatis = hari terakhir bulan terpilih.
- Kanan = pemilik Sheet.
- Kiri = Kasubbag sesuai SubBagian.
- Sekretaris = satu tanda tangan di kanan.
- Mobile friendly.
