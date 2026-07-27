// رسالة إشعار صغيرة بتظهر أسفل الشاشة وتختفي تلقائيًا (تُدار من App.jsx)
export default function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}
