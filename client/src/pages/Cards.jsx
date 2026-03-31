import { useEffect, useState } from "react";
import { fetchCards } from "../api.js";
import CardTitleLink from "../components/CardTitleLink.jsx";

export default function Cards() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [sort, setSort] = useState("recency");
  const [page, setPage] = useState(1);
  const [autograph, setAutograph] = useState(false);
  const [graded, setGraded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const params = { page, limit: 25, sort };
    if (autograph) params.autograph = "true";
    if (graded) params.graded = "true";
    (async () => {
      try {
        const body = await fetchCards(params);
        if (!cancelled) {
          setData(body);
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) setErr(String(e.message || e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sort, page, autograph, graded]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <>
      <div className="row-tools">
        <label>
          Sort{" "}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recency">Last seen</option>
            <option value="activity">Activity (count)</option>
            <option value="price">Price</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={autograph}
            onChange={(e) => {
              setAutograph(e.target.checked);
              setPage(1);
            }}
          />{" "}
          Autograph (from titles)
        </label>
        <label>
          <input
            type="checkbox"
            checked={graded}
            onChange={(e) => {
              setGraded(e.target.checked);
              setPage(1);
            }}
          />{" "}
          Grade/auth keywords
        </label>
        <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span className="muted">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
      {err && <p className="err">{err}</p>}
      {!data && !err && <p className="muted">Loading…</p>}
      {data && (
        <div className="panel">
          <h2>Cards ({data.total})</h2>
          <div className="cards-grid">
            {data.items.map((c) => (
              <article className="card-tile" key={c.card_key}>
                <div className="card-media">
                  {c.preview_image_url ? (
                    <img
                      src={c.preview_image_url}
                      alt={c.title || c.card_key}
                      loading="lazy"
                    />
                  ) : (
                    <div className="card-placeholder">No image</div>
                  )}
                </div>
                <div className="card-body">
                  <h3>
                    <CardTitleLink
                      cardKey={c.card_key}
                      text={c.title || c.card_key}
                      previewListingUrl={c.preview_listing_url}
                      maxLen={88}
                    />
                  </h3>
                  <p className="muted card-key">{c.card_key}</p>
                  <div className="badge-row">
                    {c.flags?.has_autograph && <span className="pill">Autograph</span>}
                    {c.flags?.has_grade_or_auth && <span className="pill">Grade/Auth</span>}
                    {c.flags?.has_psa && <span className="pill">PSA</span>}
                    {c.flags?.has_bgs && <span className="pill">BGS</span>}
                    {c.flags?.has_jsa && <span className="pill">JSA</span>}
                    {c.flags?.has_beckett && <span className="pill">Beckett</span>}
                    {c.flags?.has_coa && <span className="pill">COA</span>}
                  </div>
                  <div className="card-stats">
                    <div>
                      <span className="muted">Latest median ask</span>
                      <strong>
                        {c.latest_trend?.price != null
                          ? `${c.latest_trend.price} ${c.price_currency || ""}`
                          : "—"}
                      </strong>
                    </div>
                    <div>
                      <span className="muted">Listings (N)</span>
                      <strong>{c.latest_trend?.count ?? "—"}</strong>
                    </div>
                    <div>
                      <span className="muted">7d %</span>
                      <strong>{c.change_7d_pct != null ? `${c.change_7d_pct}%` : "—"}</strong>
                    </div>
                    <div>
                      <span className="muted">Trend date</span>
                      <strong>{c.latest_trend?.date || "—"}</strong>
                    </div>
                    <div>
                      <span className="muted">First seen</span>
                      <strong>
                        {c.first_seen_at ? new Date(c.first_seen_at).toISOString().slice(0, 10) : "—"}
                      </strong>
                    </div>
                    <div>
                      <span className="muted">Last seen</span>
                      <strong>
                        {c.last_seen_at ? new Date(c.last_seen_at).toISOString().slice(0, 10) : "—"}
                      </strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
