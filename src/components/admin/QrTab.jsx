import { useState } from "react";
import { Copy } from "lucide-react";
import { DEMO_DOMAIN } from "../../lib/defaultData.js";

export default function QrTab({ slug, data }) {
  const link = `https://${DEMO_DOMAIN}/menu/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(link)}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // المتصفح مانع النسخ التلقائي، مفيش مشكلة
    }
  };

  return (
    <div className="panel">
      <h2>QR كود ورابط منيو الكافيه</h2>
      <p className="panel-sub">
        اطبع الـ QR ده وزّعه على طاولات الكافيه — أي زبون هيمسحه بالموبايل هيفتح
        منيو {data.profile.name} فوراً
      </p>

      <div className="qr-box">
        <img src={qrUrl} alt="QR Code" width={200} height={200} />
        <div className="qr-link-row">
          <code>{link}</code>
          <button onClick={copy}>
            <Copy size={14} /> {copied ? "تم النسخ!" : "نسخ الرابط"}
          </button>
        </div>
        <p className="qr-note">
          ملحوظة: الرابط ده هيشتغل فعليًا لما ترفع المشروع على استضافة حقيقية
          (Vercel / Netlify) بدومين خاص بيك، وتضبط DEMO_DOMAIN في ملف
          src/lib/defaultData.js على دومينك الفعلي.
        </p>
      </div>
    </div>
  );
}
