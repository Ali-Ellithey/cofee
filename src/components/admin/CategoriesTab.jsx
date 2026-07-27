import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { uid } from "../../lib/id.js";

export default function CategoriesTab({ data, persist, showToast }) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);

  const add = () => {
    if (!newName.trim()) return;
    persist({ ...data, categories: [...data.categories, { id: uid(), name: newName.trim() }] });
    setNewName("");
    showToast("اتضاف القسم");
  };

  const remove = (id) => {
    const inUse = data.products.some((p) => p.categoryId === id);
    if (inUse) {
      showToast("مينفعش تمسح قسم فيه منتجات، امسح المنتجات الأول");
      return;
    }
    persist({ ...data, categories: data.categories.filter((c) => c.id !== id) });
  };

  const rename = (id, name) => {
    persist({ ...data, categories: data.categories.map((c) => (c.id === id ? { ...c, name } : c)) });
    setEditing(null);
  };

  return (
    <div className="panel">
      <h2>الأقسام</h2>
      <p className="panel-sub">قسّم القائمة بشكل يسهّل على العميل يلاقي طلبه بسرعة</p>

      <div className="add-row">
        <input
          placeholder="اسم قسم جديد، مثلاً: حلويات"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn-primary" onClick={add}>
          <Plus size={15} /> إضافة
        </button>
      </div>

      <ul className="list">
        {data.categories.map((c) => (
          <li key={c.id} className="list-row">
            {editing === c.id ? (
              <input
                autoFocus
                defaultValue={c.name}
                onBlur={(e) => rename(c.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && rename(c.id, e.target.value)}
              />
            ) : (
              <span>{c.name}</span>
            )}
            <div className="row-actions">
              <button onClick={() => setEditing(c.id)}>
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(c.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {data.categories.length === 0 && <li className="empty-row">مفيش أقسام لسه، ضيف أول قسم فوق.</li>}
      </ul>
    </div>
  );
}
