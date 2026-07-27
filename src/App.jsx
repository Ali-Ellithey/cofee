import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { DEFAULT_SLUG, STORAGE_KEY, defaultData } from "./lib/defaultData.js";
import { storageGet, storageSet } from "./lib/storage.js";
import RoleSwitch from "./components/shared/RoleSwitch.jsx";
import Toast from "./components/shared/Toast.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import CustomerMenu from "./components/customer/CustomerMenu.jsx";

export default function App() {
  const [slug, setSlug] = useState(DEFAULT_SLUG);
  const [role, setRole] = useState("admin"); // admin | customer
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // تحميل بيانات المطعم من التخزين عند فتح الصفحة أو تغيير الـ slug
  const loadData = useCallback(async (targetSlug) => {
    setLoading(true);
    const raw = await storageGet(STORAGE_KEY(targetSlug));
    setData(raw ? JSON.parse(raw) : defaultData());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(slug);
  }, [slug, loadData]);

  // حفظ أي تعديل يحصل في لوحة الإدارة
  const persist = useCallback(
    async (nextData) => {
      setData(nextData);
      setSaving(true);
      const ok = await storageSet(STORAGE_KEY(slug), JSON.stringify(nextData));
      if (!ok) showToast("حصل خطأ في الحفظ، حاول تاني");
      setSaving(false);
    },
    [slug]
  );

  if (loading || !data) {
    return (
      <div className="boot-screen">
        <Loader2 className="spin" size={26} />
        <span>بنجهزلك القائمة...</span>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* شريط التبديل ده للتجربة بس، شوف ملاحظة الإنتاج في README */}
      <RoleSwitch role={role} setRole={setRole} saving={saving} />
      <Toast message={toast} />

      {role === "admin" ? (
        <AdminDashboard data={data} persist={persist} slug={slug} setSlug={setSlug} showToast={showToast} />
      ) : (
        <CustomerMenu data={data} />
      )}
    </div>
  );
}
