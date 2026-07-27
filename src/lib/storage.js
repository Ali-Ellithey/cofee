/**
 * طبقة تخزين موحّدة.
 *
 * - لو الملف شغال جوه بيئة Claude (فيها window.storage) هيستخدمها تلقائيًا.
 * - لو شغال كتطبيق Vite مستقل (زي دلوقتي بعد التحميل) هيستخدم localStorage
 *   كبديل عشان تقدر تجرب المشروع على جهازك فورًا من غير أي إعداد إضافي.
 *
 * ⚠️ ملحوظة مهمة قبل ما تبيع الخدمة لمطاعم حقيقية:
 * localStorage بيخزّن البيانات على جهاز/متصفح العميل بس، يعني:
 *   - لو العميل فتح الرابط من موبايل تاني هيلاقي القائمة فاضية (مش نفس بيانات المطعم)
 *   - القائمة اللي بيشوفها الزبون لازم تيجي من سيرفر حقيقي (Backend + قاعدة بيانات)
 * لما تكون جاهز للإنتاج، استبدل الدوال دي بنداءات API حقيقية (fetch لسيرفرك)
 * بدل localStorage، وسيب باقي الكود زي ما هو (نفس الأسماء والمخرجات).
 */

const hasClaudeStorage = () =>
  typeof window !== "undefined" &&
  window.storage &&
  typeof window.storage.get === "function";

export async function storageGet(key) {
  if (hasClaudeStorage()) {
    try {
      const res = await window.storage.get(key, true);
      return res ? res.value : null;
    } catch (e) {
      return null;
    }
  }
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export async function storageSet(key, value) {
  if (hasClaudeStorage()) {
    try {
      await window.storage.set(key, value, true);
      return true;
    } catch (e) {
      return false;
    }
  }
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}
