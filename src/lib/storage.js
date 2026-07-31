// دالة للتحقق من وجود بيئة سابقة إن وجدت
function hasClaudeStorage() {
  return typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function';
}

// رابط السيرفر المحلي
const API_URL = 'http://localhost:5000/api/restaurants';

export async function storageGet(key) {
  // تنظيف الـ key من أي نقطتين لضمان عدم حدوث خطأ 404 أو 500
  const cleanKey = key.replace(/:/g, '-');

  // 1. لو البيئة القديمة موجودة
  if (hasClaudeStorage()) {
    try {
      const res = await window.storage.get(cleanKey, true);
      return res ? res.value : null;
    } catch (e) {
      // لو فشلت، نكمل ونحاول نجيب من السيرفر الجديد
    }
  }

  // 2. محاولة الجلب من السيرفر الجديد (Backend)
  try {
    const response = await fetch(`${API_URL}/${cleanKey}`);
    if (response.ok) {
      const data = await response.json();
      // بنرجعها كـ JSON String عشان App.jsx بيعمل JSON.parse(raw)
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
  } catch (e) {
    // لو السيرفر مش شغال، ننزل للـ localStorage كبديل أخير
  }

  // 3. البديل الأخير (localStorage)
  try {
    const localData = localStorage.getItem(cleanKey);
    return localData ? localData : null;
  } catch (e) {
    return null;
  }
}

export async function storageSet(key, value) {
  const cleanKey = key.replace(/:/g, '-');

  // 1. لو البيئة القديمة موجودة
  if (hasClaudeStorage()) {
    try {
      await window.storage.set(cleanKey, value, true);
      return true;
    } catch (e) {
      // لو فشلت نكمل للسيرفر
    }
  }

  // 2. الحفظ على السيرفر الجديد (Backend)
  try {
    const payload = typeof value === 'string' ? JSON.parse(value) : value;

    const response = await fetch(`${API_URL}/${cleanKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success || result) return true;
    }
  } catch (e) {
    // لو السيرفر مش شغال، نسجل في الـ localStorage مؤقتاً
  }

  // 3. البديل الأخير (localStorage)
  try {
    localStorage.setItem(cleanKey, typeof value === 'string' ? value : JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}