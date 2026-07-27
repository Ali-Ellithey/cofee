import { LayoutDashboard, Eye, Save, Loader2 } from "lucide-react";

// شريط علوي يبدّل بين "لوحة الإدارة" و"شكل القائمة للعميل" (للتجربة)
// في الإنتاج الحقيقي، رابط العميل (اللي بيفتحه QR) هيكون صفحة منفصلة
// مالهاش وجود لشريط التبديل ده أو زرار لوحة الإدارة أصلًا
export default function RoleSwitch({ role, setRole, saving }) {
  return (
    <div className="role-switch">
      <div className="role-switch-inner">
        <div className="role-tabs">
          <button className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>
            <LayoutDashboard size={15} /> لوحة الإدارة
          </button>
          <button className={role === "customer" ? "active" : ""} onClick={() => setRole("customer")}>
            <Eye size={15} /> شكل القائمة للعميل
          </button>
        </div>
        <div className="save-indicator">
          {saving ? (
            <>
              <Loader2 className="spin" size={13} /> بيحفظ...
            </>
          ) : (
            <>
              <Save size={13} /> محفوظ
            </>
          )}
        </div>
      </div>
    </div>
  );
}
