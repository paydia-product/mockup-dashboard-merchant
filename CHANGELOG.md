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
