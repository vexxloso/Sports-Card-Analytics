const BASE = import.meta.env.VITE_API_URL || "";

async function getJson(path) {
  const r = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`${r.status} ${t || r.statusText}`);
  }
  return r.json();
}

export function fetchMeta() {
  return getJson("/api/meta");
}

export function fetchCoverage() {
  return getJson("/api/coverage");
}

export function fetchCards(params) {
  const q = new URLSearchParams(params).toString();
  return getJson(`/api/cards?${q}`);
}

export function fetchCard(cardKey) {
  return getJson(`/api/cards/${encodeURIComponent(cardKey)}`);
}

export function fetchCardListings(cardKey, limit = 20) {
  return getJson(
    `/api/cards/${encodeURIComponent(cardKey)}/listings?limit=${limit}`
  );
}

export function fetchMovers(params = {}) {
  const q = new URLSearchParams(params).toString();
  return getJson(`/api/movers?${q}`);
}
