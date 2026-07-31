import { useState } from "react";
import {
  Plus,
  Check,
  X,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { uid } from "../../lib/id.js";
import Field from "../shared/Field.jsx";
import ImageUploadField from "../shared/ImageUploadField.jsx";

export default function ProductsTab({ data, persist, showToast }) {
  const emptyForm = {
    name: "",
    price: "",
    oldPrice: "",
    categoryId: data.categories[0]?.id || "",
    desc: "",
    available: true,
    image: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p, price: String(p.price), oldPrice: String(p.oldPrice) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = () => {
    if (!form.name.trim() || !form.price || !form.categoryId) {
      showToast("اسم الصنف، السعر، والقسم مطلوبين");
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice || form.price),
    };
    if (editingId) {
      persist({
        ...data,
        products: data.products.map((p) =>
          p.id === editingId ? { ...payload, id: editingId } : p,
        ),
      });
      showToast("تم تعديل الصنف بنجاح");
    } else {
      persist({
        ...data,
        products: [...data.products, { ...payload, id: uid() }],
      });
      showToast("تمت إضافة الصنف للكافيه");
    }
    cancelEdit();
  };

  const remove = (id) => {
    persist({ ...data, products: data.products.filter((p) => p.id !== id) });
    showToast("تم حذف الصنف");
  };

  const toggleAvailable = (id) => {
    persist({
      ...data,
      products: data.products.map((p) =>
        p.id === id ? { ...p, available: !p.available } : p,
      ),
    });
    showToast("تم تغيير حالة توفر الصنف");
  };

  return (
    <div className="panel">
      <h2>أصناف ومشروبات الكافيه</h2>
      <p className="panel-sub">
        أضف أو عدّل المشروبات، الحلويات، والأصناف المتاحة للزبائن بالمنيو
      </p>

      <div className="product-form">
        <div className="form-grid">
          <Field label="اسم الصنف أو المشروب (مثال: اسبريسو، آيس لاتيه...)">
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="اكتب اسم المشروب..."
            />
          </Field>
          <Field label="القسم">
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="السعر الحالي (ج.م)">
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="مثال: 45"
            />
          </Field>
          <Field label="السعر قبل الخصم (اختياري)">
            <input
              type="number"
              value={form.oldPrice}
              onChange={(e) => set("oldPrice", e.target.value)}
              placeholder="مثال: 60"
            />
          </Field>
          <Field label="وصف قصير (المكونات أو الحجم)">
            <input
              value={form.desc}
              onChange={(e) => set("desc", e.target.value)}
              placeholder="مثال: وسط، مضاف إليه صوص الشوكولاتة..."
            />
          </Field>
          <ImageUploadField
            label="صورة المشروب أو الصنف"
            value={form.image}
            onChange={(v) => set("image", v)}
          />
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={save}>
            {editingId ? (
              <>
                <Check size={15} /> حفظ تعديل الصنف
              </>
            ) : (
              <>
                <Plus size={15} /> إضافة الصنف للكافيه
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
        {data.products.map((p) => (
          <li key={p.id} className="list-row product-row">
            <div className="product-row-main">
              {p.image ? (
                <img className="row-thumb" src={p.image} alt="" />
              ) : (
                <div className="row-thumb row-thumb-empty">
                  <ImageIcon size={14} />
                </div>
              )}
              <span className="product-row-name">{p.name}</span>
              <span className="product-row-cat">
                {data.categories.find((c) => c.id === p.categoryId)?.name ||
                  "—"}
              </span>
              <span className="product-row-price">{p.price} ج.م</span>
              <label className="tiny-toggle">
                <input
                  type="checkbox"
                  checked={p.available}
                  onChange={() => toggleAvailable(p.id)}
                />
                متاح بالبار
              </label>
            </div>
            <div className="row-actions">
              <button onClick={() => startEdit(p)} title="تعديل الصنف">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(p.id)} title="حذف الصنف">
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {data.products.length === 0 && (
          <li className="empty-row">
            لا توجد أصناف مضافة حالياً، ابدأ بإضافة أول مشروب بالأعلى.
          </li>
        )}
      </ul>
    </div>
  );
}
