const API_URL = "http://localhost:5000/api"; // أو رابط السيرفر على العلن لو مرفوع

// 1. جلب بيانات المطعم بواسطة الـ slug
export async function getRestaurantData(slug) {
    try {
        const response = await fetch(`${API_URL}/restaurants/${slug}`);
        if (!response.ok) throw new Error("المطعم غير موجود");
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// 2. حفظ أو تحديث بيانات المطعم بالكامل بالـ slug
export async function saveRestaurantData(slug, menuData) {
    try {
        const response = await fetch(`${API_URL}/restaurants/${slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(menuData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error saving data:", error);
    }
}