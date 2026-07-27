import { useState } from "react";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { resizeImageFile } from "../../lib/image.js";

// حقل رفع صورة: يُستخدم لشعار المطعم ولصور المنتجات
// بيصغّر الصورة تلقائيًا قبل ما يرجّعها كـ data URL عبر onChange
export default function ImageUploadField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeImageFile(file);
      onChange(dataUrl);
    } catch (err) {
      // الصورة اللي اتختارت مش قابلة للقراءة، بنتجاهلها بهدوء
    }
    setBusy(false);
    e.target.value = "";
  };

  return (
    <label className="field">
      <span>{label}</span>
      <div className="image-upload">
        {value ? (
          <div className="image-preview">
            <img src={value} alt="" />
            <button type="button" className="image-remove" onClick={() => onChange("")}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <ImageIcon size={20} />
          </div>
        )}
        <label className="image-upload-btn">
          {busy ? <Loader2 className="spin" size={14} /> : <Upload size={14} />}
          {value ? "تغيير الصورة" : "رفع صورة"}
          <input type="file" accept="image/*" onChange={handleFile} hidden />
        </label>
      </div>
    </label>
  );
}
