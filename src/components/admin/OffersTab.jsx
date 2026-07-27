import { useState } from "react";
import { Plus, Check, X, Pencil, Trash2 } from "lucide-react";
import { uid } from "../../lib/id.js";
import Field from "../shared/Field.jsx";

export default function OffersTab({ data, persist, showToast }) {
  const emptyForm = { title: "", desc: "", discount: "", active: true };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const startEdit = (o) => {
    setEditingId(o.id);
    setForm({ ...o, discount: String(o.discount) });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = () => {
    if (!form.title.trim()) {
      showToast("عنوان العرض مطلوب");
      return;
    }
    const payload = { ...form, discount: Number(form.discount || 0) };
    if (editingId) {
      persist({ ...data, offers: data.offers.map((o) => (o.id === editingId ? { ...payload, id: editingId } : o)) });
    } else {
      persist({ ...data, offers: [...data.offers, { ...payload, id: uid() }] });
    }
    showToast("اتحفظ العرض");
    cancelEdit();
  };
  const remove = (id) => persist({ ...data, offers: data.offers.filter((o) => o.id !== id) });
  const toggleActive = (id) =>
    persist({ ...data, offers: data.offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o)) });

  return (
    <div className="panel">
      <h2>العروض</h2>
      <p className="panel-sub">عروض تظهر في أعلى قائمة العميل مباشرة عشان تلفت نظره</p>

      <div className="product-form">
        <div className="form-grid">
          <Field label="عنوان العرض">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="نسبة الخصم %">
            <input type="number" value={form.discount} onChange={(e) => set("discount", e.target.value)} />
          </Field>
          <Field label="وصف قصير">
            <input value={form.desc} onChange={(e) => set("desc", e.target.value)} />
          </Field>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={save}>
            {editingId ? (
              <>
                <Check size={15} /> حفظ التعديل
              </>
            ) : (
              <>
                <Plus size={15} /> إضافة عرض
              </>
            )}
          </button>
          {editingId && (
            <button className="btn-ghost" onClick={cancelEdit}>
              <X size={15} /> إلغاء
            </button>
          )}
        </div>
      </div>

      <ul className="list">
        {data.offers.map((o) => (
          <li key={o.id} className="list-row product-row">
            <div className="product-row-main">
              <span className="product-row-name">{o.title}</span>
              <span className="product-row-cat">خصم {o.discount}%</span>
              <label className="tiny-toggle">
                <input type="checkbox" checked={o.active} onChange={() => toggleActive(o.id)} />
                فعّال
              </label>
            </div>
            <div className="row-actions">
              <button onClick={() => startEdit(o)}>
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(o.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {data.offers.length === 0 && <li className="empty-row">مفيش عروض حاليًا.</li>}
      </ul>
    </div>
  );
}
