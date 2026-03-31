export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">
          © {year} Sports Card Analytics · median asks from sampled listings, not sold FMV
        </p>
        <p className="site-footer__note">
          Data depends on your ingest schedule and search query. Not affiliated with eBay.
        </p>
      </div>
    </footer>
  );
}
