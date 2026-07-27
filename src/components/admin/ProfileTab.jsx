import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Field from "../shared/Field.jsx";
import ImageUploadField from "../shared/ImageUploadField.jsx";

export default function ProfileTab({ data, persist, showToast }) {
  const [form, setForm] = useState(data.profile);
  useEffect(() => setForm(data.profile), [data.profile]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => {
    persist({ ...data, profile: form });
    showToast("اتحفظت بيانات المطعم");
  };

  return (
    <div className="panel">
      <h2>بيانات المطعم</h2>
      <p className="panel-sub">دي البيانات اللي هتظهر فوق قائمة العميل مباشرة</p>

      <div className="form-grid">
        <Field label="اسم المطعم/الكافيه">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="جملة وصف قصيرة">
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="رقم واتساب (بكود الدولة بدون +)">
          <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="201001234567" />
        </Field>
        <Field label="العنوان">
          <input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="مواعيد العمل">
          <input value={form.hours} onChange={(e) => set("hours", e.target.value)} />
        </Field>
        <Field label="حرف الشعار (لو مفيش صورة)">
          <input value={form.logoLetter} maxLength={2} onChange={(e) => set("logoLetter", e.target.value)} />
        </Field>
        <ImageUploadField label="صورة الشعار" value={form.logoImage} onChange={(v) => set("logoImage", v)} />
      </div>

      <button className="btn-primary" onClick={save}>
        <Save size={15} /> حفظ التعديلات
      </button>
    </div>
  );
}
