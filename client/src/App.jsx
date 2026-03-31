import { Route, Routes } from "react-router-dom";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Cards from "./pages/Cards.jsx";
import CardDetail from "./pages/CardDetail.jsx";

export default function App() {
  return (
    <div className="layout">
      <SiteHeader />
      <main className="site-main" id="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/cards/:cardKey" element={<CardDetail />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
