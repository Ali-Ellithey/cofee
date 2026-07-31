import { Plus } from "lucide-react";

export default function ProductGrid({
  products,
  cart,
  addToCart,
  removeFromCart,
}) {
  if (products.length === 0) {
    return (
      <div className="empty-row">مفيش أصناف متاحة في القسم ده دلوقتي.</div>
    );
  }

  return (
    <div className="menu-grid">
      {products.map((p) => {
        const onSale = p.oldPrice > p.price;
        const qty = cart[p.id] || 0;
        return (
          <div key={p.id} className="menu-card">
            {p.image && (
              <div className="menu-card-media">
                <img src={p.image} alt={p.name} />
                {onSale && (
                  <span className="menu-card-badge menu-card-badge-media">
                    عرض
                  </span>
                )}
              </div>
            )}
            <div className="menu-card-top">
              <span className="menu-card-name">{p.name}</span>
              {!p.image && onSale && (
                <span className="menu-card-badge">عرض</span>
              )}
            </div>
            <p className="menu-card-desc">{p.desc}</p>
            <div className="menu-card-bottom">
              <div className="menu-card-price">
                <span className="price-mono">{p.price} ج.م</span>
                {onSale && <span className="price-old-mono">{p.oldPrice}</span>}
              </div>
              {qty === 0 ? (
                <button className="add-btn" onClick={() => addToCart(p.id)}>
                  <Plus size={15} />
                </button>
              ) : (
                <div className="qty-stepper">
                  <button onClick={() => removeFromCart(p.id)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => addToCart(p.id)}>+</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
