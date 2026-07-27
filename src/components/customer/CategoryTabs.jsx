export default function CategoryTabs({ categories, activeCat, setActiveCat }) {
  return (
    <div className="cat-tabs">
      <button className={activeCat === "all" ? "active" : ""} onClick={() => setActiveCat("all")}>
        الكل
      </button>
      {categories.map((c) => (
        <button key={c.id} className={activeCat === c.id ? "active" : ""} onClick={() => setActiveCat(c.id)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
