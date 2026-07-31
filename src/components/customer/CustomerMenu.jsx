import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingBag,
  MessageCircle,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

// ==========================================
// API Functions
// ==========================================
const API_URL = "http://localhost:5000/api";

async function getRestaurantData(slug) {
  try {
    const response = await fetch(`${API_URL}/restaurants/${slug}`);
    if (!response.ok) throw new Error("المطعم غير موجود");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// ==========================================
// CartBar Component (شريط السلة)
// ==========================================
function CartBar({
  cartItems,
  total,
  cartCount,
  whatsapp,
  restaurantName,
  updateQty,
  removeFromCart,
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (cartCount === 0) return null;

  const handleWhatsAppCheckout = () => {
    if (!whatsapp) {
      alert("عذراً، رقم الواتساب غير متوفر حالياً.");
      return;
    }

    let message = `🛒 *طلب جديد من متجر: ${restaurantName}*\n\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} (×${item.qty}) - ${item.product.price * item.qty} ج.م\n`;
    });
    message += `\n💰 *الإجمالي الكلي: ${total} ج.م*`;

    const cleanPhone = whatsapp.replace(/\D/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {isOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#222",
                }}
              >
                <ShoppingBag size={18} /> سلة الطلبات ({cartCount})
              </h3>
              <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.itemsList}>
              {cartItems.map(({ product, qty }) => (
                <div key={product.id || product._id} style={styles.cartItemRow}>
                  <div style={{ flex: 1, minWidth: 0, paddingLeft: "8px" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#222",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {product.price * qty} ج.م
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={styles.stepper}>
                      <button
                        style={styles.stepBtn}
                        onClick={() =>
                          updateQty(product.id || product._id, qty - 1)
                        }
                      >
                        {qty === 1 ? (
                          <Trash2 size={12} color="#e74c3c" />
                        ) : (
                          <Minus size={12} />
                        )}
                      </button>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          minWidth: "20px",
                          textAlign: "center",
                          color: "#222",
                        }}
                      >
                        {qty}
                      </span>
                      <button
                        style={styles.stepBtn}
                        onClick={() =>
                          updateQty(product.id || product._id, qty + 1)
                        }
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => removeFromCart(product.id || product._id)}
                      title="حذف الصنف"
                    >
                      <Trash2 size={14} color="#e74c3c" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.modalFooter}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#222",
                }}
              >
                <span>الإجمالي:</span>
                <span style={{ color: "#27ae60" }}>{total} ج.م</span>
              </div>
              <button
                style={styles.whatsappBtn}
                onClick={handleWhatsAppCheckout}
              >
                <MessageCircle size={18} /> إرسال الطلب عبر الواتساب
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.cartBarContainer}>
        <div style={styles.cartBarContent} onClick={() => setIsOpen(true)}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={styles.badge}>{cartCount}</span>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>
              عرض السلة
            </span>
          </div>
          <div style={{ fontSize: "15px", fontWeight: "bold" }}>
            {total} ج.م
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// CustomerMenu Component (صفحة العميل الرئيسية)
// ==========================================
export default function CustomerMenu() {
  const { slug } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function fetchMenu() {
      const data = await getRestaurantData(slug);
      if (data) {
        setMenuData(data);
      }
      setLoading(false);
    }
    fetchMenu();
  }, [slug]);

  // دوال إدارة السلة
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const productId = product.id || product._id;
      const existingIndex = prevItems.findIndex(
        (item) => (item.product.id || item.product._id) === productId,
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].qty += 1;
        return updated;
      } else {
        return [...prevItems, { product: product, qty: 1 }];
      }
    });
  };

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.product.id || item.product._id) === productId
          ? { ...item, qty: newQty }
          : item,
      ),
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => (item.product.id || item.product._id) !== productId,
      ),
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );

  if (loading)
    return <div style={styles.centerMessage}>جاري تحميل القائمة...</div>;
  if (!menuData)
    return (
      <div style={styles.centerMessage}>عذراً، القائمة أو المطعم غير موجود</div>
    );

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1>{menuData.name || "قائمة الطعام"}</h1>
        {menuData.description && (
          <p style={styles.description}>{menuData.description}</p>
        )}
      </header>

      <div style={styles.productsGrid}>
        {menuData.products && menuData.products.length > 0 ? (
          menuData.products.map((product, index) => (
            <div
              key={product.id || product._id || index}
              style={styles.productCard}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={styles.productImage}
                />
              )}
              <div style={styles.productInfo}>
                <h3>{product.name}</h3>
                <p style={styles.productDesc}>{product.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.price}>{product.price} ج.م</span>
                  <button
                    style={styles.addBtn}
                    onClick={() => addToCart(product)}
                  >
                    <Plus size={16} /> إضافة للسلة
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{ textAlign: "center", gridColumn: "1 / -1", color: "#666" }}
          >
            لا توجد منتجات مضافة حالياً.
          </p>
        )}
      </div>

      {/* شريط السلة العائم */}
      <CartBar
        cartItems={cartItems}
        total={total}
        cartCount={cartCount}
        whatsapp={menuData.whatsapp || "01000000000"}
        restaurantName={menuData.name || "المطعم"}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}

// ==========================================
// Styles
// ==========================================
const styles = {
  pageContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "16px",
    fontFamily: "Cairo, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    paddingBottom: "90px",
  },
  centerMessage: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "18px",
    color: "#555",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  description: {
    color: "#666",
    fontSize: "14px",
    marginTop: "8px",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
  },
  productImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },
  productInfo: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  productDesc: {
    color: "#666",
    fontSize: "13px",
    margin: "8px 0 16px 0",
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  price: {
    fontWeight: "bold",
    color: "#27ae60",
    fontSize: "15px",
  },
  addBtn: {
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  cartBarContainer: {
    position: "fixed",
    bottom: "16px",
    left: "16px",
    right: "16px",
    maxWidth: "768px",
    margin: "0 auto",
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: "12px",
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1000,
    cursor: "pointer",
  },
  cartBarContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#27ae60",
    color: "#fff",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "flex-end",
    zIndex: 1100,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    maxHeight: "75vh",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "12px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
  },
  itemsList: {
    overflowY: "auto",
    maxHeight: "45vh",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "12px",
  },
  cartItemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f9f9f9",
  },
  stepper: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#f1f1f1",
    borderRadius: "6px",
    padding: "2px",
  },
  stepBtn: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalFooter: {
    borderTop: "1px solid #eee",
    paddingTop: "12px",
  },
  whatsappBtn: {
    width: "100%",
    backgroundColor: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },
};
