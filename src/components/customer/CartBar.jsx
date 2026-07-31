import { useState } from "react";
import {
  ShoppingBag,
  MessageCircle,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

export default function CartBar({
  cartItems,
  total,
  cartCount,
  whatsapp,
  restaurantName,
  onUpdateCart, // دالة استقبال تحديث السلة من المكون الرئيسي
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (cartCount === 0) return null;

  // دالة زيادة أو نقص الكمية لمنتج معين داخل السلة
  const handleQuantityChange = (productId, delta) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      })
      .filter(Boolean); // إزالة المنتجات التي أصبحت كميتها صفر

    onUpdateCart(updatedCart);
  };

  // دالة إرسال الطلب عبر الواتساب
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
      {/* نافذة تفاصيل السلة المنبثقة */}
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
                <div key={product.id} style={styles.cartItemRow}>
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

                  {/* أزرار التحكم بالكمية داخل السلة */}
                  <div style={styles.stepper}>
                    <button
                      style={styles.stepBtn}
                      onClick={() => handleQuantityChange(product.id, -1)}
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
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      <Plus size={12} />
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

      {/* شريط السلة العائم أسفل الشاشة */}
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

// الاستايلات
const styles = {
  cartBarContainer: {
    position: "fixed",
    bottom: "16px",
    left: "16px",
    right: "16px",
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
