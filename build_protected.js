#!/usr/bin/env node
/*
 * build_protected.js
 * ------------------------------------------------------------------
 * Produces an ENCRYPTED index.html from the plaintext dev copy mockup.html.
 *
 * Security model (fixes the client-side-gate pentest findings):
 *   - The page content is AES-256-GCM encrypted. The password is NOT stored
 *     anywhere in the output — it is only the PBKDF2 input used to derive the
 *     AES key at runtime in the browser (Web Crypto).
 *   - Without the correct password the content cannot be decrypted, is never
 *     in the DOM, and is not present in plaintext in the network response.
 *   - JS disabled => only the password box renders (fail-closed).
 *
 * Usage:  node build_protected.js
 * Re-run this after editing mockup.html, then deploy index.html.
 */

const fs = require('fs');
const path = require('path');

const PASSWORD = '!Paydia6';            // kept the same, by request
const ITERATIONS = 250000;              // PBKDF2 rounds (must match wrapper)
const SRC = path.join(__dirname, 'mockup.html');
const OUT = path.join(__dirname, 'index.html');
const VERSIONS_SRC = path.join(__dirname, 'versions.js');
const VERSION_FILE = path.join(__dirname, 'VERSION');

const subtle = globalThis.crypto.subtle;

/* Remove the old insecure client-side gate from the source so it is not
 * re-introduced inside the encrypted payload. */
function stripGate(html) {
  let out = html;

  // 1) <head> FOUC script (the IIFE that hides body / sets title)
  out = out.replace(
    /<script>\s*\(function\(\)\s*\{\s*if \(sessionStorage\.getItem\('mockup_auth'\)[\s\S]*?\}\)\(\);\s*<\/script>/,
    ''
  );

  // 2) The gate markup + its handler script (comment -> first </script>)
  out = out.replace(
    /<!--\s*──+\s*Login Gate HTML\s*──+\s*-->[\s\S]*?<\/script>/,
    ''
  );

  return out;
}

/* .vercelignore serves ONLY index.html publicly, so versions.js (linked as
 * <script src="versions.js">) would 404 in production. Inline its source
 * directly into the cleaned HTML before encryption. */
function inlineVersionsScript(html) {
  const versionsSrc = fs.readFileSync(VERSIONS_SRC, 'utf8');
  const tag = '<script src="versions.js"></script>';
  if (!html.includes(tag)) {
    throw new Error('inlineVersionsScript: <script src="versions.js"></script> tag not found in mockup.html.');
  }
  if (versionsSrc.includes('</script')) {
    throw new Error('inlineVersionsScript: versions.js contains a literal "</script" substring, which would prematurely close the inlined <script> tag.');
  }
  return html.replace(tag, () => '<script>\n' + versionsSrc + '\n</script>');
}

async function deriveKey(password, salt, usages) {
  const km = await subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    false,
    usages
  );
}

function buildWrapper(payloadB64) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title> </title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f3f4f6;min-height:100vh;display:flex;align-items:center;justify-content:center}
  #gate{width:100%;max-width:360px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:36px 32px;box-shadow:0 4px 24px rgba(0,0,0,.06);text-align:center}
  #gate .lock{width:48px;height:48px;border-radius:50%;background:#eef2ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:20px}
  #gate h1{font-size:1rem;font-weight:700;color:#111827;margin-bottom:4px}
  #gate p{font-size:.8rem;color:#6b7280;margin-bottom:22px}
  #gate input{width:100%;border:1.5px solid #d1d5db;border-radius:8px;padding:11px 12px;font-size:.9rem;outline:none;transition:border-color .15s}
  #gate input:focus{border-color:#4f46e5}
  #gate button{width:100%;margin-top:14px;border:none;border-radius:8px;padding:11px;background:#4f46e5;color:#fff;font-weight:600;font-size:.9rem;cursor:pointer;transition:background .15s}
  #gate button:hover{background:#4338ca}
  #gate button:disabled{background:#a5b4fc;cursor:wait}
  #err{display:none;color:#dc2626;font-size:.78rem;margin-top:12px}
  .shake{animation:shake .3s ease-in-out}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
</style>
</head>
<body>
  <div id="gate">
    <form id="f" autocomplete="off">
      <input type="password" id="pw" autocomplete="current-password" autofocus placeholder="Password" />
      <button type="submit" id="go">Buka</button>
      <div id="err">Password salah.</div>
    </form>
  </div>

  <script id="payload" type="application/octet-stream">${payloadB64}</script>
  <script>
  (function(){
    var ITER = ${ITERATIONS};
    function b64ToBytes(b64){var bin=atob(b64),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u;}
    var raw  = b64ToBytes(document.getElementById('payload').textContent.trim());
    var salt = raw.slice(0,16), iv = raw.slice(16,28), ct = raw.slice(28);

    function deriveKey(pw){
      return crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey'])
        .then(function(km){
          return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:ITER,hash:'SHA-256'},
            km, {name:'AES-GCM',length:256}, false, ['decrypt']);
        });
    }
    function decrypt(pw){
      return deriveKey(pw).then(function(key){
        return crypto.subtle.decrypt({name:'AES-GCM',iv:iv}, key, ct);
      }).then(function(buf){ return new TextDecoder().decode(buf); });
    }
    function reveal(html){
      document.open(); document.write(html); document.close();
    }

    var f   = document.getElementById('f');
    var pw  = document.getElementById('pw');
    var go  = document.getElementById('go');
    var err = document.getElementById('err');

    f.addEventListener('submit', function(e){
      e.preventDefault();
      err.style.display='none'; go.disabled=true; go.textContent='Membuka...';
      decrypt(pw.value).then(function(html){
        try{ sessionStorage.setItem('sm_k', pw.value); }catch(_){}
        reveal(html);
      }).catch(function(){
        go.disabled=false; go.textContent='Buka';
        pw.classList.add('shake'); pw.value=''; err.style.display='block';
        setTimeout(function(){ pw.classList.remove('shake'); }, 300);
        pw.focus();
      });
    });

    // Per-tab convenience: if already unlocked in this tab, auto-open.
    try{
      var k = sessionStorage.getItem('sm_k');
      if(k){ decrypt(k).then(reveal).catch(function(){ sessionStorage.removeItem('sm_k'); }); }
    }catch(_){}
  })();
  </script>
</body>
</html>
`;
}

(async function main() {
  const currentVersion = fs.readFileSync(VERSION_FILE, 'utf8').trim();
  console.log('     VERSION file     : ' + currentVersion);

  const srcRaw = fs.readFileSync(SRC, 'utf8');
  let clean = stripGate(srcRaw);
  clean = inlineVersionsScript(clean);

  // sanity: gate logic gone, app still present
  if (/mockup_auth|handleGateSubmit/.test(clean)) {
    throw new Error('Gate strip failed — gate logic still present.');
  }
  if (!/function switchPlatform/.test(clean)) {
    throw new Error('Clean content missing app logic (switchPlatform).');
  }
  if (!/var VERSIONS/.test(clean)) {
    throw new Error('Clean content missing versions.js payload (var VERSIONS).');
  }

  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv   = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encKey = await deriveKey(PASSWORD, salt, ['encrypt']);
  const ctBuf = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    encKey,
    new TextEncoder().encode(clean)
  );

  const payload = Buffer.concat([Buffer.from(salt), Buffer.from(iv), Buffer.from(ctBuf)]);
  const payloadB64 = payload.toString('base64');

  // round-trip verification before writing
  const decKey = await deriveKey(PASSWORD, salt, ['decrypt']);
  const back = new TextDecoder().decode(
    await subtle.decrypt({ name: 'AES-GCM', iv }, decKey, ctBuf)
  );
  if (back !== clean) throw new Error('Round-trip verification FAILED.');

  const wrapper = buildWrapper(payloadB64);
  fs.writeFileSync(OUT, wrapper, 'utf8');

  console.log('[OK] Encrypted build written to index.html');
  console.log('     plaintext bytes : ' + Buffer.byteLength(clean));
  console.log('     payload (b64)   : ' + payloadB64.length + ' chars');
  console.log('     PBKDF2 rounds   : ' + ITERATIONS + ' (AES-256-GCM)');
})().catch(function (e) {
  console.error('[FAIL] ' + (e.stack || e));
  process.exit(1);
});
