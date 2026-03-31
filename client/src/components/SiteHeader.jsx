import { NavLink } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <NavLink to="/" className="site-header__logo" end>
          Sports Card Analytics
        </NavLink>
        <p className="site-header__tagline">Dashboard from your eBay ingest sample</p>
      </div>
      <nav className="site-nav" aria-label="Main">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "site-nav__link is-active" : "site-nav__link")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/cards"
          className={({ isActive }) => (isActive ? "site-nav__link is-active" : "site-nav__link")}
        >
          Cards
        </NavLink>
      </nav>
    </header>
  );
}
