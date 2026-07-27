// حقل فورم عام: عنوان صغير فوق أي input/select بتمريره كـ children
export default function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
