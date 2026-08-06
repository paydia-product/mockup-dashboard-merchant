# Changelog

All notable changes to this mockup are documented here, following
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## The release ritual (read before you ship anything)

Every unit of work in this project — no matter how small — follows the same
ritual, in this order:

1. Add a `CHANGELOG.md` entry (this file) under a new `## [x.y.z]` heading.
2. Bump `VERSION` (the single-line file at the repo root) to match.
3. Add a matching entry to `versions.js` (`VERSIONS[0]`, newest-first).
4. Rebuild: `node build_protected.js` (regenerates `index.html`).
5. Commit the change.
6. Tag the commit: `git tag vX.Y.Z`.
7. Push with tags: `git push --follow-tags`.
8. Deploy (`vercel --prod`), then — only once the deploy actually succeeds —
   flip that version's `deployed` flag to `true` in `versions.js`, rebuild,
   and commit that as a small follow-up.

Skipping a step is how `index.html`, `VERSION`, and `versions.js` drift out of
sync with each other and with what's actually deployed. Don't skip steps.

**Version bump rules (SemVer):**
- **MAJOR** — a breaking change in direction or scope (e.g. dropping a
  platform, replacing the auth/build model).
- **MINOR** — a new feature (e.g. a new tab, a new modal, a new dashboard
  page).
- **PATCH** — a bugfix, a copy fix, a docs-only change, or trivial metadata
  (like flipping `deployed: true` after a successful deploy).

---

## [Unreleased]

## [2.2.0] - 2026-08-06

### Added
- Riwayat Transaksi (Pay-in/Payout/Account Linkage) dan Mutasi Saldo kini membatasi
  baris yang ditampilkan hanya untuk 31 hari ke belakang, aktif otomatis terlepas
  dari filter yang dipilih pengguna. Paginasi mengikuti data yang sudah dibatasi ini.
- Catatan yang selalu terlihat "Pengguna bisa melihat data 31 hari ke belakang" pada
  modal filter dan modal permintaan ekspor.

### Changed
- submitExportRequest() kini memvalidasi ulang tanggal yang dipilih terhadap
  jendela 31 hari saat submit, tidak hanya saat memilih tanggal di kalender.

## [2.1.0] - 2026-08-06

### Added
- Export Request modal: optional "Status" checklist (Sukses / Dalam Proses / Gagal, multi-select) shown only for Riwayat Transaksi exports (Pay-in/Payout/Account Linkage); hidden for Mutasi Saldo exports. Informational only, stored on the request row but not rendered anywhere, matching the existing "Tipe Transaksi" filter precedent.
- Mutasi Saldo table: new "Nama Produk" column (e-wallet product name, positioned after Keterangan and before Ref ID Merchant).

### Changed
- Both date-picker calendars (the shared filter modal used by Riwayat Transaksi/Mutasi Saldo/Account Linkage, and the Export Request modal) now enforce a 31-day look-back window (today and the 30 days before it). Dates outside the window render disabled with no click handler; month navigation is bounded and the prev/next arrows visually grey out at the boundary.

## [2.0.0] - 2026-08-06

### Removed
- Standalone "Riwayat Ekspor" page (`#tab-riwayat-ekspor`) and its settings-menu entry.

### Added
- Riwayat Ekspor tab on the Riwayat Transaksi page (Pay-in/Payout/Account Linkage requests, with a Tipe column) and a new Riwayat Ekspor sub-tab on the Mutasi Saldo page (Mutasi Saldo requests only, no Tipe column since every row there is the same type).
- Mutasi Saldo now has a 2-tab structure ("Mutasi Saldo" | "Riwayat Ekspor").
- "Lihat Rincian Transaksi" action (toast placeholder) and real pagination (page-size 5 default) on Riwayat Transaksi's Pay-in/Payout/Account Linkage history tables.
- Riwayat Transaksi restored as a 4th visible button in the top-level blue navigation bar (previously reachable only via the settings gear menu; that entry is kept as a secondary route).

### Changed
- Export Request modal: single mandatory date field + optional "Tipe Transaksi" filter, replacing the previous Tanggal Mulai/Tanggal Akhir date-range picker.
- Riwayat Ekspor's Tanggal Mulai/Tanggal Akhir columns consolidated into a single Tanggal column.
- Riwayat Transaksi's in-progress status string "Diproses" renamed to "Menunggu".

## [1.9.1] - 2026-08-04

### Changed
- Riwayat Ekspor: kolom No sekarang nomor urut posisional yang berkelanjutan antar
  halaman (1, 2, 3, ...), menggantikan id sekuens internal yang membingungkan
  (id internal tetap dipakai untuk nama file CSV ekspor).
- Catatan masa simpan berkas (7 hari) kini selalu tampil sebagai teks biasa di bawah
  judul halaman, tidak lagi hanya muncul saat hover pada ikon info.
- Toast sukses permintaan ekspor: teks "Riwayat Ekspor" kini tebal dan menjadi tautan
  yang langsung membuka halaman Riwayat Ekspor.

### Added
- Kolom baru "Tipe" pada tabel Riwayat Ekspor menunjukkan asal permintaan ekspor:
  Mutasi Saldo atau Riwayat Transaksi. Diisi otomatis berdasarkan tombol Export yang
  digunakan.

## [1.9.0] - 2026-08-04

### Changed
- Riwayat Ekspor: header kolom diterjemahkan ke Bahasa Indonesia (No, Waktu Permintaan,
  Tanggal Mulai, Tanggal Akhir, Status, Aksi).
- Status kini punya 3 nilai: proses (kuning), selesai (hijau), gagal (merah). Unduh berkas
  hanya aktif saat status selesai — proses dan gagal keduanya memblokir unduhan.
- Seed data diperluas jadi 12 baris mencakup ketiga status.

### Added
- Pagination di halaman Riwayat Ekspor kini benar-benar fungsional (10 baris per halaman,
  page-slicing nyata) — sebelumnya markup statis dekoratif. Selector ukuran halaman
  (10/25/50) yang tidak fungsional dihapus karena batas 10 kini bersifat tetap.
- Tooltip masa simpan berkas pada judul halaman Riwayat Ekspor.

### Notes
- Verifikasi: tidak ada batasan jumlah permintaan export — sudah terpenuhi tanpa
  perubahan kode.
- Status "gagal" hanya muncul pada seed data; permintaan export baru selalu berakhir
  di status "selesai" setelah simulasi delay, tidak pernah "gagal".

## [1.8.0] - 2026-08-04

### Added
- New "Riwayat Ekspor" page (reachable from the Settings gear menu) showing a shared
  export request queue: columns NO / REQUEST TIME / START DATE / END DATE / STATUS / ACTION.
  Seeded with 3 pre-existing DONE rows on first load.
- New "Permintaan Ekspor" modal (`#modal-export-request`), reusing this codebase's
  established calendar-overlay date-picker pattern (`#modal-trx-filter`). Requires both
  a start date and an end date before Submit enables; validates end >= start and shows
  an inline error otherwise.
- All 4 export buttons — Mutasi Saldo, and Riwayat Transaksi's Pay-in / Payout /
  Account Linkage sub-tabs — now open this same modal via `openExportRequestModal()`.
  Submitting adds one row to the shared `exportHistoryData` queue: status starts as
  PROCESSING and flips to DONE after a simulated 5-second delay, at which point the
  row's download action button becomes enabled.
- By design, the Riwayat Ekspor table has no column or indicator distinguishing which
  button originated a given row — every request is treated identically regardless of
  source, matching the decision to drop a "TYPE" column.
- `downloadMockExport()` triggers a real browser file download (mock CSV via
  `Blob` + `URL.createObjectURL`, reusing the existing download pattern already used
  elsewhere in this file), rather than only showing a toast.

### Removed
- The v1.7.4 inline progress bar on Mutasi Saldo's Export button
  (`#mutasi-export-progress` markup and the `exportMutasiSaldo()` / `mutasiExportRunning`
  JS) is removed entirely, superseded by the modal + queue flow above.

### Notes
- This is a frontend-only mockup. There is no real backend, server, or database —
  "queue processing" is entirely simulated in the browser via `setTimeout` plus a
  status flip; nothing is actually queued, exported, or persisted server-side.

## [1.7.4] - 2026-08-04

### Added
- Progress bar simulasi saat klik Export di halaman Mutasi Saldo. Bar muncul di bawah
  baris tombol (di atas tabel), terisi 0%->100% dengan label persentase, lalu hilang.
- Tombol Export menampilkan spinner dan dinonaktifkan selama progress berjalan,
  mencegah animasi ganda dari klik beruntun.

### Notes
- Progress bersifat mock: tidak ada file yang benar-benar dibuat, sehingga persentase
  adalah animasi durasi tetap (~1,2 detik), bukan progress nyata.
- Toast "Mock: export mutasi saldo." tetap dipakai, kini muncul saat bar mencapai 100%.
- Tombol Export di Pay-in / Payout / Account Linkage tidak diubah pada rilis ini.

## [1.7.3] - 2026-08-04

### Changed
- Checkbox permission "Riwayat Transaksi" di modal Tambah Akun kini bisa dicentang/dilepas dan
  tidak aktif secara default — permission hanya diberikan bila dicentang.
- submitTambahAkun() hanya menambahkan "Riwayat Transaksi (View Only)" ke daftar fitur bila
  checkbox dicentang.
- openRincianAkun() kembali menampilkan status checkbox Riwayat Transaksi sesuai data akun
  (tetap read-only/disabled).

## [1.7.2] - 2026-08-03

### Changed
- Permission "Riwayat Transaksi" kini hanya View Only — opsi Export dihapus
  dari modal Tambah Akun dan Lihat Detail Akun.
- Kolom "Ref ID Partner" di Mutasi Saldo diubah namanya menjadi "Ref ID Merchant".

### Added
- Pencarian Ref ID Merchant di halaman Mutasi Saldo. Filter hanya berjalan
  saat tombol "Cari" ditekan (atau Enter) — bukan live search.

### Removed
- Logika sinkronisasi radio Export di openRincianAkun() dan pembacaan
  ta-perm-riwayat-transaksi di submitTambahAkun(), keduanya kini tidak ada
  state yang bisa dibaca.

## [1.7.1] - 2026-08-03

### Fixed
- Settings dropdown (`#m-settings-dropdown`) now closes itself when any of
  its 7 items is clicked, via a new `closeSettingsMenu()` helper — it no
  longer stays open on top of the destination page (was hiding the
  Mutasi (Rp) column and Filter/Export buttons on Mutasi Saldo).
- "Lihat detail" (Rincian Akun) now reads the account's actual saved
  Riwayat Transaksi permission (parsed from `fitur`) and checks the
  matching radio, instead of always showing "View Only" regardless of
  what was saved.
- `resetTrxFilter()` now no-ops for the Mutasi Saldo table the same way
  `applyTrxFilter()` already does, instead of calling `renderTrxTable`
  with no-op effect.
- Pushed the `v1.7.0` tag to `origin` (it was cut locally but never
  reached the remote — same class of mistake as a prior release).

## [1.7.0] - 2026-08-03

### Added
- Settings dropdown (gear icon) in the Web Merchant header, replacing the
  inert cog+chevron: Profil Saya and Log Aktivitas (placeholder toasts,
  "belum tersedia di mockup"), plus links to Manajemen Akun, Mutasi Saldo,
  Import Merchant, Transaksi Sub-Merchant, and Logout.
- **Mutasi Saldo** page: static balance-mutation table (Tanggal, ID Mutasi,
  Akun, Keterangan, Ref ID Partner, Mutasi (Rp), Saldo (Rp)) with 10 mock
  rows and an internally consistent running balance, filter icon (reuses
  the shared `#modal-trx-filter`), export button, and pagination footer.
- New **Riwayat Transaksi** permission group in the account permission
  checklist: radio-based View Only / Export selector in "Tambah Akun"
  (editable) and "Lihat Detail Akun" (disabled, read-only) modals.

### Changed
- Manajemen Akun and Transaksi Sub-Merchant (Riwayat Transaksi) are no
  longer top-level `.m-tabs` buttons — they're reachable only via the new
  settings dropdown. `merchantTabButtonMap` trimmed back to the 3 remaining
  tabs (Import Perorangan / Import Badan Usaha / Riwayat Import).
- `switchMerchantTab` now hides the `.m-tabs` bar entirely when navigating
  to Mutasi Saldo, Manajemen Akun, or Transaksi Sub-Merchant (settings-menu
  pages), and restores it for the 3 original tab-bar pages.
- `applyTrxFilter` gained an explicit no-op branch for
  `trxFilterActiveTable === 'mutasi'`: closes the shared filter modal and
  confirms via toast without attempting to re-render a transaction table
  (Mutasi Saldo's table is static markup with no render function).

## [1.6.0] - 2026-07-31

### Added
- **Riwayat Transaksi** tab in Web Merchant, with three sub-tabs: Pay-in,
  Payout, and Account Linkage. Pay-in and Payout each show a "Transaksi dalam
  Proses" table and a "Riwayat Transaksi" table (filterable, exportable).
  Account Linkage shows only the wide Riwayat Transaksi table with its own
  column set, in a horizontally scrollable container.
- Filter modal (`#modal-trx-filter`) for the Riwayat Transaksi tables: date
  range calendar picker and transaction-type select.
- **Manajemen Akun** tab in Web Merchant: account list with active/inactive
  toggle, per-row action buttons (Reset PIN / Reset Password / Lihat detail,
  conditional on a `canReset` flag), "Lihat detail" modal with a permission
  checklist (paydia / Kasbon / Payout), and a "Tambah Akun" modal with
  password + PIN fields and a per-permission View Only / Edit selector.

### Changed
- `switchMerchantTab` generalized to reset all `.m-tab-btn` elements via a
  `querySelectorAll` loop plus a tabId→buttonId map, instead of three
  hard-coded button IDs — needed so the tab bar can grow past 3 tabs.

## [1.5.0] - 2026-07-31

### Added
- `VERSION`, `CHANGELOG.md`, `README.md` — this file and its siblings.
- In-app version picker mounted in the `.dev-bar` (`versions.js`), showing
  version history, "Latest"/"Deployed" badges, and a mock "Muat versi ini"
  action (view-only, does not change app state).
- `build_protected.js` now inlines `versions.js` into the encrypted build
  output (since `.vercelignore` only serves `index.html`).

## [1.4.0] - 2026-07-31

Baseline: this mockup's feature scope as it existed before versioning was
introduced, reconstructed honestly from the actual file (not a fictitious
"1.0.0 from scratch").

### Added
- Portal login (`#platform-login`) and manual merchant registration
  (`#platform-register`) flows, with Perorangan / Badan Usaha type switching,
  a scroll-spy registration stepper, a mock reCAPTCHA, and live form
  validation.
- Perorangan registration: Swafoto and Swafoto-dengan-KTP upload fields.
- Web Merchant platform: Import Merchant Perorangan tab, Import Sub Merchant
  Badan Usaha tab (per-row and default supporting-document upload, template
  download, upload simulation with a validation modal).
- Web Merchant platform: Riwayat Import tab with status and jenis-usaha
  filters and pagination.
- Dashboard Admin Internal platform: merchant table with search/reset,
  merchant detail view with collapsible segments, masked-field reveal,
  document preview, export simulator, and a mobile-app preview simulator
  modal.
- Security: AES-256-GCM + PBKDF2 (250k iterations) encrypted build pipeline
  (`build_protected.js`) producing `index.html` from `mockup.html`, with
  `.vercelignore` restricted to serve only `index.html` (plus two sample
  images) publicly.
