# FDG Freight Quote Tool

Internal LTL quoting tool. Pulls live rates from Priority1 via API.

## What it does

- Select product → auto-fills origin zip, pallet dims, freight class
- Enter units or linear feet → shows pallet math + round-up suggestion
- Enter destination zip + accessorials → calls P1 API → returns all carrier rates
- Displays P1 rate + FDG price (P1 × 1.10)
- Copy button formats a quote line for pasting into Zoho / email

## Deploy (two steps)

### Step 1 — Cloudflare Worker (the proxy that holds the API key)

You need a free Cloudflare account. Install Wrangler once:

```bash
npm install -g wrangler
wrangler login
```

From the `fdg-quote-tool/` folder:

```bash
wrangler deploy
```

After deploy, Cloudflare gives you a URL like:
`https://fdg-p1-proxy.YOUR-SUBDOMAIN.workers.dev`

Then set the API key as a secret (key never touches any file):

```bash
wrangler secret put P1_API_KEY
# Paste the key when prompted. That's it.
```

### Step 2 — Set WORKER_URL in index.html

Open `index.html`. At the very top of the `<script>` block, find:

```js
const WORKER_URL = "";
```

Replace with your Worker URL:

```js
const WORKER_URL = "https://fdg-p1-proxy.YOUR-SUBDOMAIN.workers.dev";
```

Save the file.

### Step 3 — Push to GitHub Pages

1. Create a GitHub repo (e.g. `fdg-quote-tool`)
2. Push this folder to it
3. GitHub → Settings → Pages → Source: `main` branch, root `/`
4. Done. URL will be: `https://YOUR-ORG.github.io/fdg-quote-tool/`

Share that URL with Keith and Carlos. No login required.

---

## Product specs status

| SKU | Specs verified |
|---|---|
| HESCO Floodline (SL4836-2026) | ✅ |
| HESCO MIL 1–19 | ✅ (MIL 19 units/pallet — verify with Keith) |
| NOAQ BW52 | ⚠️ Pallet dims estimated — pending from mat@noaq.com |
| NOAQ BW102 | ⚠️ Pallet dims estimated — pending from mat@noaq.com |
| Muscle Wall 8′ | ⚠️ Pallet dims estimated |
| Muscle Wall 4′×6′ | ❌ Specs missing — cannot quote until received from vendor |

Tool flags unverified specs with a warning banner on the quote form.

---

## Reconciliation (Make.com — separate from this tool)

See `priority1_variance_2026-05-04.md` for the full variance analysis and Make.com scenario design.

Status: blocked on AJ Ram approving `GET /v2/admin/customerinvoices` API access.  
Fallback plan: manual `P1 BOL Ref` + `P1 Quote Amount` fields on Zoho vendor bills.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The tool UI + all JS. Single file, no build step. |
| `worker.js` | Cloudflare Worker proxy. Forwards requests to P1 API. API key stored as Cloudflare secret. |
| `wrangler.toml` | Worker config. |
| `README.md` | This file. |

*Last updated: 2026-05-09*
