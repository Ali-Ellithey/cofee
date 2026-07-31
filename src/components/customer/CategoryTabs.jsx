export default function CategoryTabs({ categories, activeCat, setActiveCat }) {
  return (
    <div style={styles.container}>
      {/* حقن الأنيمشن الناعم للتفاعل */}
      <style>{`
        @keyframes tabFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-tab {
          animation: tabFadeIn 0.3s ease forwards;
        }
      `}</style>

      <div className="animate-tab" style={styles.tabsWrapper}>
        <button
          style={{
            ...styles.tabBtn,
            ...(activeCat === "all" ? styles.activeBtn : styles.inactiveBtn),
          }}
          onClick={() => setActiveCat("all")}
        >
          ✨ الكل
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            style={{
              ...styles.tabBtn,
              ...(activeCat === c.id ? styles.activeBtn : styles.inactiveBtn),
            }}
            onClick={() => setActiveCat(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// التنسیقات لترتيب الأقسام بجانب بعضها مع الالتفاف التلقائي للأسفل
const styles = {
  container: {
    width: "100%",
    padding: "0 16px",
    marginBottom: "16px",
  },
  tabsWrapper: {
    display: "flex",
    flexWrap: "wrap", // السماح للأقسام بالنزول لسطر جديد إذا لم تكفي المساحة
    gap: "8px", // مسافة متساوية ومنسقة بين الأزرار أفقياً وعمودياً
    justifyContent: "flex-start",
  },
  tabBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    outline: "none",
  },
  activeBtn: {
    backgroundColor: "#d4a373",
    color: "#121212",
    border: "1px solid #d4a373",
    boxShadow: "0 3px 10px rgba(212, 163, 115, 0.3)",
    transform: "scale(1.02)",
  },
  inactiveBtn: {
    backgroundColor: "#1c1c1c",
    color: "#b0b0b0",
    border: "1px solid #2d2d2d",
  },
};
