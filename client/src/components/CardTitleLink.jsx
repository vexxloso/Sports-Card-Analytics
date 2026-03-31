import { Link } from "react-router-dom";

const isHttpUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);

/**
 * Opens latest sample listing on eBay when URL exists; otherwise internal card detail.
 */
export default function CardTitleLink({ cardKey, text, previewListingUrl, maxLen }) {
  const full = text || cardKey || "";
  const cap = maxLen ?? 88;
  const label = full.length > cap ? `${full.slice(0, cap)}…` : full;
  if (isHttpUrl(previewListingUrl)) {
    return (
      <a
        href={previewListingUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Open listing on eBay"
      >
        {label}
      </a>
    );
  }
  return <Link to={`/cards/${encodeURIComponent(cardKey)}`}>{label}</Link>;
}
