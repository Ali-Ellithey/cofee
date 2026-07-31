import { LayoutDashboard, Eye, Save, Loader2 } from "lucide-react";

export default function RoleSwitch({ role, setRole, saving }) {
  return (
    <div className="role-switch">
      <div className="role-switch-inner">
        <div className="role-tabs">
          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            <LayoutDashboard size={15} /> لوحة الإدارة
          </button>
          <button
            className={role === "customer" ? "active" : ""}
            onClick={() => setRole("customer")}
          >
            <Eye size={15} /> شكل القائمة للعميل
          </button>
        </div>
        <div className="save-indicator">
          {saving ? (
            <>
              <Loader2 className="spin" size={13} /> جاري الحفظ...
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
