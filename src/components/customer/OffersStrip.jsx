import { Percent } from "lucide-react";

export default function OffersStrip({ offers }) {
  const activeOffers = offers.filter((o) => o.active);
  if (activeOffers.length === 0) return null;

  return (
    <div className="offers-strip">
      {activeOffers.map((o) => (
        <div key={o.id} className="offer-chip">
          <Percent size={13} /> {o.title} — خصم {o.discount}%
        </div>
      ))}
    </div>
  );
}
