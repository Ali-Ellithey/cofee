import { useState } from "react";
import { Plus, Pencil, Trash2, Coffee } from "lucide-react";
import { uid } from "../../lib/id.js";
import "./CategoriesTab.css";

export default function CategoriesTab({ data, persist, showToast }) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);

  const add = () => {
    if (!newName.trim()) return;
    persist({
      ...data,
      categories: [...data.categories, { id: uid(), name: newName.trim() }],
    });
    setNewName("");
    showToast("تمت إضافة قسم المشروبات بنجاح");
  };

  const remove = (id) => {
    const inUse = data.products.some((p) => p.categoryId === id);
    if (inUse) {
      showToast(
        "عذراً، لا يمكن حذف قسم يحتوي على أصناف. يرجى مسح أو نقل الأصناف أولاً.",
      );
      return;
    }
    persist({
      ...data,
      categories: data.categories.filter((c) => c.id !== id),
    });
    showToast("تم حذف القسم");
  };

  const rename = (id, name) => {
    if (!name.trim()) return;
    persist({
      ...data,
      categories: data.categories.map((c) =>
        c.id === id ? { ...c, name: name.trim() } : c,
      ),
    });
    setEditing(null);
    showToast("تم تعديل اسم القسم");
  };

  return (
    <div className="categories-panel" dir="rtl">
      <div className="cp-eyebrow">الكافيه · إدارة القائمة</div>
      <h2>أقسام المنيو</h2>

      <svg
        className="cp-flourish"
        viewBox="0 0 560 18"
        preserveAspectRatio="none"
      >
        <path d="M0 9 H240" />
        <circle cx="252" cy="9" r="2.4" />
        <path d="M262 9 L280 9 L280 3 L280 15 L280 9 L298 9" />
        <circle cx="308" cy="9" r="2.4" />
        <path d="M320 9 H560" />
      </svg>

      <p className="panel-sub">
        رتب أقسام المشروبات والأصناف لتسهيل تصفح الزبائن داخل الكافيه
      </p>

      <div className="add-row">
        <input
          placeholder="اسم قسم جديد، مثلاً: مشروبات ساخنة، عصائر..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn-primary" onClick={add}>
          <Plus size={15} /> إضافة قسم
        </button>
      </div>

      <ul className="list">
        {data.categories.map((c, i) => (
          <li key={c.id} className="list-row" style={{ "--i": i }}>
            <div className="row-label">
              <span className="row-index">{i + 1}</span>
              {editing === c.id ? (
                <input
                  className="edit-input"
                  autoFocus
                  defaultValue={c.name}
                  onBlur={(e) => rename(c.id, e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && rename(c.id, e.target.value)
                  }
                />
              ) : (
                <span className="cat-name">{c.name}</span>
              )}
            </div>
            <div className="row-actions">
              <button onClick={() => setEditing(c.id)} title="تعديل اسم القسم">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(c.id)} title="حذف القسم">
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {data.categories.length === 0 && (
          <li className="empty-row">
            <div className="empty-icon">
              <Coffee size={26} strokeWidth={1.5} />
            </div>
            لا توجد أقسام مضافة بعد، ابدأ بإضافة أول قسم للكافيه بالأعلى.
          </li>
        )}
      </ul>
    </div>
  );
}
