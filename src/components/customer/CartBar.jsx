import { ShoppingBag, MessageCircle, ChevronRight } from "lucide-react";

export default function CartBar({ cartItems, total, cartCount, whatsapp, restaurantName }) {
  if (cartCount === 0) return null;

  const orderViaWhatsapp = () => {
    const lines = cartItems.map((i) => `• ${i.product.name} × ${i.qty} = ${i.product.price * i.qty} ج.م`);
    const msg = `طلب جديد من قائمة ${restaurantName}:\n\n${lines.join("\n")}\n\nالإجمالي: ${total} ج.م`;
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="cart-bar">
      <div className="cart-bar-inner">
        <div className="cart-summary">
          <ShoppingBag size={16} />
          <span>{cartCount} صنف</span>
          <span className="dot">•</span>
          <span className="price-mono">{total} ج.م</span>
        </div>
        <button className="whatsapp-btn" onClick={orderViaWhatsapp}>
          <MessageCircle size={16} /> اطلب عبر واتساب <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
