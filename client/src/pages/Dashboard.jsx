import { useEffect, useState } from "react";
import { fetchCoverage, fetchMeta, fetchMovers } from "../api.js";
import CardTitleLink from "../components/CardTitleLink.jsx";

export default function Dashboard() {
  const [meta, setMeta] = useState(null);
  const [coverage, setCoverage] = useState(null);
  const [movers, setMovers] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [m, c, mv] = await Promise.all([
          fetchMeta(),
          fetchCoverage(),
          fetchMovers({ limit: 15 }),
        ]);
        if (!cancelled) {
          setMeta(m);
          setCoverage(c);
          setMovers(mv);
        }
      } catch (e) {
        if (!cancelled) setErr(String(e.message || e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="disclaimer">
        {meta?.disclaimer ||
          "Median asking price from your ingest sample — not full market or sold FMV."}
        {coverage?.searchQueryUsed != null && coverage.searchQueryUsed !== "" && (
          <span className="muted">
            {" "}
            — Search query: <code>{coverage.searchQueryUsed}</code>
          </span>
        )}
        {coverage?.marketplaceId && (
          <span className="muted">
            {" "}
            · Marketplace: <code>{coverage.marketplaceId}</code>
          </span>
        )}
      </div>
      {err && <p className="err">{err}</p>}
      <div className="panel">
        <h2>Coverage</h2>
        {!coverage && !err && <p className="muted">Loading…</p>}
        {coverage && (
          <table>
            <tbody>
              <tr>
                <th>Cards (collection)</th>
                <td>{coverage.cardsTrackedApprox}</td>
              </tr>
              <tr>
                <th>Listings ingested today (UTC day)</th>
                <td>{coverage.listingsIngestedToday}</td>
              </tr>
              <tr>
                <th>Last listing fetch</th>
                <td>
                  {coverage.lastListingFetchedAt
                    ? new Date(coverage.lastListingFetchedAt).toISOString()
                    : "—"}
                </td>
              </tr>
              <tr>
                <th>Last card update</th>
                <td>
                  {coverage.lastCardSeenAt
                    ? new Date(coverage.lastCardSeenAt).toISOString()
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="panel">
        <h2>Top movers (7d % change, gated by listing count)</h2>
        <p className="muted">
          Uses trend points ≥ minCount listings on both endpoints.{" "}
          {movers && <>Default min: {movers.minCountDefault}.</>}
        </p>
        {!movers && !err && <p className="muted">Loading…</p>}
        {movers?.items?.length === 0 && (
          <p className="muted">Not enough history yet — run ingest on more days.</p>
        )}
        {movers?.items?.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Card</th>
                <th>Δ 7d %</th>
                <th>Latest (N)</th>
                <th>Prior (N)</th>
              </tr>
            </thead>
            <tbody>
              {movers.items.map((r) => (
                <tr key={r.card_key}>
                  <td>
                    <CardTitleLink
                      cardKey={r.card_key}
                      text={r.title || r.card_key}
                      previewListingUrl={r.preview_listing_url}
                      maxLen={80}
                    />
                  </td>
                  <td>{r.change_7d_pct}%</td>
                  <td>
                    {r.latest_price} ({r.latest_count})
                  </td>
                  <td>
                    {r.prior_price} ({r.prior_count})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
