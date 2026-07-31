import { useState, useEffect } from "react";
import RoleSwitch from "./components/shared/RoleSwitch";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import CartBar from "./components/customer/CartBar.jsx";
import { storageGet, storageSet } from "../src/lib/storage.js";

const getSlugFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug") || "my-cafe";
};

export default function App() {
  const [role, setRole] = useState("admin");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const slug = getSlugFromUrl();

  // القسم النشط حالياً للتنقل السريع في منيو العميل
  const [activeCategory, setActiveCategory] = useState(null);

  const [menuData, setMenuData] = useState({
    restaurantName: "كافيه السعادة",
    tagline: "قهوتك المفضلة، مصنعة بحب ☕",
    address: "القاهرة، مدينة السلام",
    whatsapp: "+201234567890",
    facebook: "",
    instagram: "",
    tiktok: "",
    logo: "",
    categories: [
      {
        id: 1,
        name: "المشروبات الساخنة",
        products: [
          {
            id: 101,
            name: "إسبريسو",
            price: 40,
            description: "شوت مركز وغني",
            image: "",
          },
          {
            id: 102,
            name: "كابتشينو",
            price: 65,
            description: "إسبريسو مع حليب رغوي",
            image: "",
          },
        ],
      },
      {
        id: 2,
        name: "المشروبات الباردة",
        products: [
          {
            id: 201,
            name: "آيس كوفي كراميل",
            price: 75,
            description: "قهوة مثلجة بصوص الكراميل",
            image: "",
          },
        ],
      },
    ],
    offers: [],
  });

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const savedData = await storageGet(slug);
        if (savedData) {
          const parsed =
            typeof savedData === "string" ? JSON.parse(savedData) : savedData;
          setMenuData(parsed);
          if (parsed.categories?.[0]) {
            setActiveCategory(parsed.categories[0].id);
          }
        } else if (menuData.categories?.[0]) {
          setActiveCategory(menuData.categories[0].id);
        }
      } catch (err) {
        console.error("Error loading:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleUpdateMenu = async (updatedData) => {
    setSaving(true);
    setMenuData(updatedData);
    try {
      await storageSet(slug, updatedData);
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setTimeout(() => setSaving(false), 600);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "120px",
          fontFamily: "Cairo, sans-serif",
          color: "#d4a373",
        }}
      >
        <h2>جاري تحضير المنيو... ☕</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#f8f9fa",
        paddingBottom: "110px",
        fontFamily: "Cairo, sans-serif",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* حقن ستايلات الأنيميشن والـ CSS الاحترافي وتجنب الخروج عن حدود الشاشة */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fadeIn 0.4s ease-in-out forwards;
        }
        .category-tab::-webkit-scrollbar {
          display: none;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <RoleSwitch role={role} setRole={setRole} saving={saving} />

      {role === "admin" ? (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            color: "#222",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <AdminDashboard menuData={menuData} onUpdateMenu={handleUpdateMenu} />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "12px",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          {/* الهيدر الاحترافي للعميل */}
          <header
            className="animate-fade"
            style={{
              textAlign: "center",
              marginBottom: "18px",
              background: "linear-gradient(145deg, #1e1e1e, #181818)",
              padding: "18px 12px",
              borderRadius: "16px",
              border: "1px solid #2a2a2a",
              boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
            }}
          >
            {menuData.logo && (
              <img
                src={menuData.logo}
                alt={menuData.restaurantName}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "10px",
                  border: "3px solid #d4a373",
                  boxShadow: "0 4px 12px rgba(212,163,115,0.3)",
                }}
              />
            )}
            <h1
              style={{
                margin: "0 0 4px 0",
                fontSize: "22px",
                color: "#fff",
                fontWeight: "750",
                wordBreak: "break-word",
              }}
            >
              {menuData.restaurantName}
            </h1>
            {menuData.tagline && (
              <p
                style={{
                  color: "#d4a373",
                  fontSize: "13px",
                  margin: "0 0 6px 0",
                  wordBreak: "break-word",
                }}
              >
                {menuData.tagline}
              </p>
            )}
            {menuData.address && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#aaa",
                  marginBottom: "14px",
                  wordBreak: "break-word",
                }}
              >
                📍 {menuData.address}
              </div>
            )}

            {/* أيقونات التواصل الاجتماعي */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {menuData.whatsapp && (
                <a
                  href={`https://wa.me/${menuData.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#25d366",
                    color: "#fff",
                    padding: "5px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  واتساب 💬
                </a>
              )}
              {menuData.facebook && (
                <a
                  href={menuData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#1877f2",
                    color: "#fff",
                    padding: "5px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  فيسبوك 👤
                </a>
              )}
              {menuData.instagram && (
                <a
                  href={menuData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                    color: "#fff",
                    padding: "5px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  انستجرام 📸
                </a>
              )}
              {menuData.tiktok && (
                <a
                  href={menuData.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#000",
                    border: "1px solid #444",
                    color: "#fff",
                    padding: "5px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  تيك توك 🎬
                </a>
              )}
            </div>
          </header>

          {/* شريط الأقسام المتحرك (Category Tabs) متوافق مع الموبايل */}
          <div
            className="category-tab"
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "10px",
              marginBottom: "16px",
              whiteSpace: "nowrap",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {menuData.categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: activeCategory === cat.id ? "#d4a373" : "#1e1e1e",
                  color: activeCategory === cat.id ? "#121212" : "#ccc",
                  border: "1px solid #333",
                  padding: "7px 15px",
                  borderRadius: "18px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "13px",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* عرض المنتجات التابعة للقسم النشط فقط */}
          <div className="animate-fade">
            {menuData.categories
              ?.filter((cat) => cat.id === activeCategory)
              ?.map((cat) => (
                <div key={cat.id}>
                  <h3
                    style={{
                      color: "#d4a373",
                      marginBottom: "12px",
                      fontSize: "18px",
                      borderBottom: "2px solid #2a2a2a",
                      paddingBottom: "5px",
                      wordBreak: "break-word",
                    }}
                  >
                    {cat.name}
                  </h3>
                  {cat.products?.length === 0 ? (
                    <p
                      style={{
                        color: "#777",
                        textAlign: "center",
                        padding: "16px",
                        fontSize: "13px",
                      }}
                    >
                      لا توجد منتجات متاحة في هذا القسم حالياً.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {cat.products?.map((product) => (
                        <div
                          key={product.id}
                          style={{
                            background: "#1a1a1a",
                            padding: "12px",
                            borderRadius: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            border: "1px solid #282828",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                  border: "1px solid #333",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                  color: "#fff",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {product.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#999",
                                  marginTop: "2px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {product.description}
                              </div>
                              <div
                                style={{
                                  color: "#d4a373",
                                  fontWeight: "bold",
                                  marginTop: "4px",
                                  fontSize: "13px",
                                }}
                              >
                                {product.price} ج.م
                              </div>
                            </div>
                          </div>
                          <button
                            style={{
                              background: "#d4a373",
                              color: "#121212",
                              border: "none",
                              padding: "7px 12px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                              boxShadow: "0 2px 6px rgba(212,163,115,0.3)",
                            }}
                            onClick={() => {
                              setCartItems((prev) => {
                                const existing = prev.find(
                                  (i) => i.product.id === product.id,
                                );
                                if (existing) {
                                  return prev.map((i) =>
                                    i.product.id === product.id
                                      ? { ...i, qty: i.qty + 1 }
                                      : i,
                                  );
                                }
                                return [...prev, { product, qty: 1 }];
                              });
                            }}
                          >
                            + إضافة
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <CartBar
            cartItems={cartItems}
            total={total}
            cartCount={cartCount}
            whatsapp={menuData.whatsapp}
            restaurantName={menuData.restaurantName}
            onUpdateCart={setCartItems}
          />
        </div>
      )}
    </div>
  );
}
