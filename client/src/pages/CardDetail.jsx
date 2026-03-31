import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCard, fetchCardListings } from "../api.js";

export default function CardDetail() {
  const { cardKey } = useParams();
  const [card, setCard] = useState(null);
  const [listings, setListings] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, l] = await Promise.all([
          fetchCard(cardKey),
          fetchCardListings(cardKey, 25),
        ]);
        if (!cancelled) {
          setCard(c);
          setListings(l);
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) setErr(String(e.message || e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cardKey]);

  const trendRows = [...(card?.trend || [])].sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );

  return (
    <>
      <p>
        <Link to="/cards">← Cards</Link>
      </p>
      {err && <p className="err">{err}</p>}
      {!card && !err && <p className="muted">Loading…</p>}
      {card && (
        <>
          <div className="disclaimer">{card.disclaimer}</div>
          <div className="panel">
            <h2>
              {card.preview_listing_url &&
              typeof card.preview_listing_url === "string" &&
              /^https?:\/\//i.test(card.preview_listing_url) ? (
                <a
                  href={card.preview_listing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card.title}
                </a>
              ) : (
                card.title
              )}
            </h2>
            <p className="muted">card_key: {card.card_key}</p>
            <table>
              <tbody>
                <tr>
                  <th>Currency</th>
                  <td>{card.price_currency || "—"}</td>
                </tr>
                <tr>
                  <th>Last seen</th>
                  <td>
                    {card.last_seen_at
                      ? new Date(card.last_seen_at).toISOString()
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="panel">
            <h2>Daily trend (median ask, N listings)</h2>
            {trendRows.length === 0 && (
              <p className="muted">No trend points yet.</p>
            )}
            {trendRows.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Date (UTC)</th>
                    <th>Median ask</th>
                    <th>N</th>
                  </tr>
                </thead>
                <tbody>
                  {trendRows.map((p) => (
                    <tr key={p.date}>
                      <td>{p.date}</td>
                      <td>{p.price}</td>
                      <td>{p.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="panel">
            <h2>Recent matching listings (sample)</h2>
            {!listings && <p className="muted">Loading…</p>}
            {listings?.listings?.length === 0 && (
              <p className="muted">No recent rows matched this card_key.</p>
            )}
            {listings?.listings?.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Title</th>
                    <th>Image URL</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.listings.map((li) => (
                    <tr key={li.item_id || li._id}>
                      <td>
                        {li.image_url ? (
                          <img
                            src={li.image_url}
                            alt={li.title || "card listing"}
                            style={{
                              width: 72,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {li.price_value} {li.price_currency || ""}
                      </td>
                      <td>{(li.title || "").slice(0, 70)}</td>
                      <td style={{ maxWidth: 260, wordBreak: "break-all" }}>
                        {li.image_url || "—"}
                      </td>
                      <td>
                        {li.item_web_url ? (
                          <a
                            href={li.item_web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="panel">
            <h2>Raw card document (all data)</h2>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "0.8rem",
                color: "#cdd6e9",
              }}
            >
              {JSON.stringify(card.all_data || card, null, 2)}
            </pre>
          </div>
        </>
      )}
    </>
  );
}
