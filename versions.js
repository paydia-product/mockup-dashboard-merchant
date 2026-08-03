/* versions.js
 * ------------------------------------------------------------------
 * Mock in-app version picker. Mounts into <div id="versionPicker"></div>
 * inside .dev-bar. View-only — "Muat versi ini" never changes app state,
 * it only shows a toast (see CHANGELOG.md for the real release ritual).
 *
 * Inlined verbatim into index.html by build_protected.js (see task 7),
 * since .vercelignore serves only index.html publicly.
 */
(function () {
    var CURRENT = '1.7.1';

    var VERSIONS = [
        {
            v: '1.7.1',
            date: '2026-08-03',
            deployed: true,
            title: 'Settings dropdown auto-close, Rincian Akun permission sync',
            changes: [
                'Dropdown Settings kini menutup diri saat item diklik (closeSettingsMenu())',
                'Lihat Detail Akun kini menampilkan permission Riwayat Transaksi yang benar-benar tersimpan, bukan default View Only',
                'resetTrxFilter() dijaga agar tidak no-op memanggil renderTrxTable saat tabel aktif adalah Mutasi Saldo',
                'Tag v1.7.0 yang sempat tidak ter-push ke remote sudah didorong'
            ]
        },
        {
            v: '1.7.0',
            date: '2026-08-03',
            deployed: true,
            title: 'Settings menu, Mutasi Saldo, Riwayat Transaksi permission',
            changes: [
                'Dropdown Settings (gear): Profil Saya, Manajemen Akun, Mutasi Saldo, Import Merchant, Transaksi Sub-Merchant, Log Aktivitas, Logout',
                'Halaman baru Mutasi Saldo (10 baris mock, saldo berjalan konsisten)',
                'Manajemen Akun & Transaksi Sub-Merchant dipindah dari tab bar ke menu settings',
                'Grup permission baru "Riwayat Transaksi" (View Only/Export) di Tambah Akun & Lihat Detail Akun'
            ]
        },
        {
            v: '1.6.0',
            date: '2026-07-31',
            deployed: true,
            title: 'Riwayat Transaksi + Manajemen Akun',
            changes: [
                'Tab Riwayat Transaksi: sub-tab Pay-in, Payout, Account Linkage',
                'Modal filter transaksi (tanggal + tipe transaksi)',
                'Tab Manajemen Akun: daftar akun, toggle aktif/nonaktif',
                'Modal Lihat Detail Akun & Tambah Akun (permission checklist)'
            ]
        },
        {
            v: '1.5.0',
            date: '2026-07-31',
            deployed: false,
            title: 'Versioning: VERSION, CHANGELOG, version picker',
            changes: [
                'VERSION + CHANGELOG.md + README.md ditambahkan',
                'Version picker mock di dev-bar (file ini)',
                'switchMerchantTab digeneralisasi agar scalable ke >3 tab'
            ]
        },
        {
            v: '1.4.0',
            date: '2026-07-31',
            deployed: true,
            title: 'Baseline mockup (pre-versioning)',
            changes: [
                'Login + registrasi manual merchant (Perorangan/Badan Usaha)',
                'Web Merchant: Import Perorangan, Import Badan Usaha, Riwayat Import',
                'Dashboard Admin Internal: tabel merchant, detail, export simulator',
                'Build pipeline terenkripsi AES-256-GCM'
            ]
        }
    ];

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function toast(msg, type) {
        if (typeof window.alertToast === 'function') {
            window.alertToast(msg, type || 'info');
        } else {
            console.info('[versionPicker] ' + msg);
        }
    }

    function loadVersion(v) {
        toast('Mock: pemilihan versi hanya tampilan. Build aktif tetap v' + CURRENT + '.', 'info');
    }

    function renderList(root, query) {
        var listEl = root.querySelector('.vp-list');
        var q = (query || '').toLowerCase().trim();
        var items = VERSIONS.filter(function (entry) {
            if (!q) return true;
            var haystack = (entry.v + ' ' + entry.title + ' ' + entry.changes.join(' ')).toLowerCase();
            return haystack.indexOf(q) !== -1;
        });

        listEl.innerHTML = items.map(function (entry, idx) {
            var badges = '';
            if (idx === 0 && !q) badges += '<span class="vp-badge vp-badge-latest">Latest</span>';
            if (entry.deployed) badges += '<span class="vp-badge vp-badge-deployed">Deployed</span>';
            var changesHtml = entry.changes.map(function (c) {
                return '<li>' + escapeHtml(c) + '</li>';
            }).join('');
            return (
                '<div class="vp-item">' +
                    '<div class="vp-item-head">' +
                        '<span class="vp-item-v">v' + escapeHtml(entry.v) + '</span>' +
                        badges +
                        '<span class="vp-item-date">' + escapeHtml(entry.date) + '</span>' +
                    '</div>' +
                    '<div class="vp-item-title">' + escapeHtml(entry.title) + '</div>' +
                    '<ul class="vp-item-changes">' + changesHtml + '</ul>' +
                    '<button type="button" class="vp-load-btn" data-v="' + escapeHtml(entry.v) + '">Muat versi ini</button>' +
                '</div>'
            );
        }).join('') || '<div class="vp-empty">Tidak ada versi cocok.</div>';
    }

    function injectStyles() {
        if (document.getElementById('vp-styles')) return;
        var style = document.createElement('style');
        style.id = 'vp-styles';
        style.textContent = [
            '.vp-root{position:relative;display:inline-flex;align-items:center;}',
            '.vp-trigger{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:6px;font-size:0.72rem;font-weight:600;font-family:var(--font-main,inherit);cursor:pointer;text-transform:uppercase;letter-spacing:0.3px;}',
            '.vp-trigger:hover{background:rgba(255,255,255,0.16);}',
            '.vp-trigger .vp-current{color:#93c5fd;}',
            '.vp-panel{display:none;position:absolute;top:calc(100% + 8px);right:0;width:320px;max-height:420px;overflow-y:auto;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 12px 32px rgba(15,23,42,0.18);z-index:9999;padding:12px;}',
            '.vp-panel.vp-open{display:block;}',
            '.vp-search{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:0.78rem;font-family:var(--font-main,inherit);margin-bottom:10px;outline:none;}',
            '.vp-search:focus{border-color:#2563eb;}',
            '.vp-item{border:1px solid #eef2f7;border-radius:8px;padding:10px 12px;margin-bottom:8px;}',
            '.vp-item-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;}',
            '.vp-item-v{font-weight:800;font-size:0.82rem;color:#1e3a8a;font-family:var(--font-brand,inherit);}',
            '.vp-item-date{margin-left:auto;font-size:0.68rem;color:#94a3b8;}',
            '.vp-badge{font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;padding:2px 6px;border-radius:99px;}',
            '.vp-badge-latest{background:#fef3c7;color:#92400e;}',
            '.vp-badge-deployed{background:#dcfce7;color:#166534;}',
            '.vp-item-title{font-size:0.78rem;font-weight:600;color:#0f172a;margin-bottom:6px;}',
            '.vp-item-changes{margin:0 0 8px 18px;padding:0;font-size:0.72rem;color:#475569;}',
            '.vp-item-changes li{margin-bottom:2px;}',
            '.vp-load-btn{width:100%;padding:6px 0;border:1px solid #1e56d7;background:#fff;color:#1e56d7;border-radius:6px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;cursor:pointer;}',
            '.vp-load-btn:hover{background:#eff6ff;}',
            '.vp-footer{padding-top:6px;text-align:center;}',
            '.vp-footer-link{font-size:0.68rem;color:#94a3b8;font-style:italic;}',
            '.vp-empty{font-size:0.75rem;color:#94a3b8;text-align:center;padding:16px 0;}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function mount() {
        var host = document.getElementById('versionPicker');
        if (!host) return;

        injectStyles();

        host.innerHTML =
            '<div class="vp-root">' +
                '<button type="button" class="vp-trigger" id="vp-trigger-btn">' +
                    '<i class="fas fa-code-branch"></i> <span class="vp-current">v' + escapeHtml(CURRENT) + '</span>' +
                '</button>' +
                '<div class="vp-panel" id="vp-panel">' +
                    '<input type="text" class="vp-search" id="vp-search" placeholder="Cari versi, judul, atau perubahan...">' +
                    '<div class="vp-list"></div>' +
                    '<div class="vp-footer"><span class="vp-footer-link">Lihat changelog lengkap: CHANGELOG.md di repo</span></div>' +
                '</div>' +
            '</div>';

        var root = host.querySelector('.vp-root');
        var trigger = host.querySelector('#vp-trigger-btn');
        var panel = host.querySelector('#vp-panel');
        var search = host.querySelector('#vp-search');

        renderList(root, '');

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            panel.classList.toggle('vp-open');
        });

        search.addEventListener('input', function () {
            renderList(root, search.value);
        });

        root.addEventListener('click', function (e) {
            var btn = e.target.closest('.vp-load-btn');
            if (btn) loadVersion(btn.getAttribute('data-v'));
        });

        document.addEventListener('click', function (e) {
            if (!root.contains(e.target)) panel.classList.remove('vp-open');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
