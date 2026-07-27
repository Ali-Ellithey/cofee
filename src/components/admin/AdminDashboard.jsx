import { useState } from "react";
import { Store, Tags, Package, Percent, QrCode, ShoppingBag, RefreshCw } from "lucide-react";
import ProfileTab from "./ProfileTab.jsx";
import CategoriesTab from "./CategoriesTab.jsx";
import ProductsTab from "./ProductsTab.jsx";
import OffersTab from "./OffersTab.jsx";
import QrTab from "./QrTab.jsx";

const TABS = [
  { key: "profile", label: "بيانات المطعم", icon: Store },
  { key: "categories", label: "الأقسام", icon: Tags },
  { key: "products", label: "المنتجات", icon: Package },
  { key: "offers", label: "العروض", icon: Percent },
  { key: "qr", label: "QR والرابط", icon: QrCode },
];

export default function AdminDashboard({ data, persist, slug, setSlug, showToast }) {
  const [tab, setTab] = useState("profile");
  const [slugInput, setSlugInput] = useState(slug);

  return (
    <div className="admin-layout">
      <aside className="admin-side">
        <div className="admin-logo">
          <ShoppingBag size={18} />
          <span>Menu OS</span>
        </div>

        <nav>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`side-link ${tab === t.key ? "side-link-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <t.icon size={16} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="tenant-box">
          <label>معرّف المطعم (Slug)</label>
          <div className="tenant-row">
            <input value={slugInput} onChange={(e) => setSlugInput(e.target.value.trim())} />
            <button onClick={() => setSlug(slugInput || "default")} title="تحميل بيانات المطعم ده">
              <RefreshCw size={14} />
            </button>
          </div>
          <p className="tenant-hint">كل مطعم بيبقى ليه Slug مختلف = بيانات وقائمة منفصلة تمامًا</p>
        </div>
      </aside>

      <main className="admin-main">
        {tab === "profile" && <ProfileTab data={data} persist={persist} showToast={showToast} />}
        {tab === "categories" && <CategoriesTab data={data} persist={persist} showToast={showToast} />}
        {tab === "products" && <ProductsTab data={data} persist={persist} showToast={showToast} />}
        {tab === "offers" && <OffersTab data={data} persist={persist} showToast={showToast} />}
        {tab === "qr" && <QrTab slug={slug} data={data} />}
      </main>
    </div>
  );
}
