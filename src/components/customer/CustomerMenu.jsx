import { useState, useMemo } from "react";
import MenuHeader from "./MenuHeader.jsx";
import OffersStrip from "./OffersStrip.jsx";
import CategoryTabs from "./CategoryTabs.jsx";
import ProductGrid from "./ProductGrid.jsx";
import CartBar from "./CartBar.jsx";

// الصفحة اللي بتفتح فعليًا لما العميل يمسح كود الـ QR
export default function CustomerMenu({ data }) {
  const { profile, categories, products, offers } = data;
  const [activeCat, setActiveCat] = useState(categories[0]?.id || "all");
  const [cart, setCart] = useState({});

  const visibleProducts = useMemo(
    () => products.filter((p) => p.available && (activeCat === "all" || p.categoryId === activeCat)),
    [products, activeCat]
  );

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return next;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
    .filter((i) => i.product);
  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="customer-view">
      <MenuHeader profile={profile} />
      <OffersStrip offers={offers} />
      <CategoryTabs categories={categories} activeCat={activeCat} setActiveCat={setActiveCat} />
      <ProductGrid products={visibleProducts} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
      <CartBar
        cartItems={cartItems}
        total={total}
        cartCount={cartCount}
        whatsapp={profile.whatsapp}
        restaurantName={profile.name}
      />
    </div>
  );
}
