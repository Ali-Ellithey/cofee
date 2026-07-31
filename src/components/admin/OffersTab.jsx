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
      showToast("برجاء إدخال عنوان العرض أو الخصم");
      return;
    }
    const payload = { ...form, discount: Number(form.discount || 0) };
    if (editingId) {
      persist({
        ...data,
        offers: data.offers.map((o) =>
          o.id === editingId ? { ...payload, id: editingId } : o,
        ),
      });
      showToast("تم تحديث العرض بنجاح");
    } else {
      persist({ ...data, offers: [...data.offers, { ...payload, id: uid() }] });
      showToast("تمت إضافة العرض للكافيه");
    }
    cancelEdit();
  };

  const remove = (id) => {
    persist({ ...data, offers: data.offers.filter((o) => o.id !== id) });
    showToast("تم حذف العرض");
  };

  const toggleActive = (id) => {
    persist({
      ...data,
      offers: data.offers.map((o) =>
        o.id === id ? { ...o, active: !o.active } : o,
      ),
    });
    showToast("تم تغيير حالة العرض");
  };

  return (
    <div className="panel">
      <h2>عروض وخصومات الكافيه</h2>
      <p className="panel-sub">
        عروض ترويجية ومشروبات خاصة تظهر أعلى قائمة المنيو لجذب زوار الكافيه
      </p>

      <div className="product-form">
        <div className="form-grid">
          <Field label="عنوان العرض (مثال: عرض الهابي آوير / خصم المشروبات الساخنة)">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="اكتب عنوان العرض..."
            />
          </Field>
          <Field label="نسبة الخصم % (اختياري)">
            <input
              type="number"
              value={form.discount}
              onChange={(e) => set("discount", e.target.value)}
              placeholder="مثال: 15"
            />
          </Field>
          <Field label="وصف قصير للعرض">
            <input
              value={form.desc}
              onChange={(e) => set("desc", e.target.value)}
              placeholder="مثال: اشتري قهوة واخذ التانية بنصف السعر..."
            />
          </Field>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={save}>
            {editingId ? (
              <>
                <Check size={15} /> حفظ تعديل العرض
              </>
            ) : (
              <>
                <Plus size={15} /> إضافة عرض للكافيه
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
              {o.discount > 0 && (
                <span className="product-row-cat">خصم {o.discount}%</span>
              )}
              <label className="tiny-toggle">
                <input
                  type="checkbox"
                  checked={o.active}
                  onChange={() => toggleActive(o.id)}
                />
                فعّال بالمنيو
              </label>
            </div>
            <div className="row-actions">
              <button onClick={() => startEdit(o)} title="تعديل العرض">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(o.id)} title="حذف العرض">
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {data.offers.length === 0 && (
          <li className="empty-row">لا توجد عروض مضافة حالياً للكافيه.</li>
        )}
      </ul>
    </div>
  );
}
