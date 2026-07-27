import { uid } from "./id.js";

// slug = "معرّف المطعم"، ده اللي بيفرّق بيانات كل مطعم عن التاني
// في الإنتاج الحقيقي كل مطعم هيبقى ليه رابط زي:
//   yourdomain.com/menu/{slug}
// وهيتولد له QR خاص بيه من تبويب "QR والرابط" في لوحة الإدارة
export const DEFAULT_SLUG = "city-cafe";
export const DEMO_DOMAIN = "menu.yourapp.com"; // غيّرها بدومينك الحقيقي وقت النشر

export const STORAGE_KEY = (slug) => `menu-app:${slug}`;

// بيانات افتراضية لمطعم تجريبي، بتتحمّل أول مرة بس لو مفيش بيانات محفوظة
export function defaultData() {
  const catHot = uid();
  const catCold = uid();
  const catFood = uid();
  return {
    profile: {
      name: "كافيه المدينة",
      tagline: "قهوة مختصة ووجبات خفيفة",
      whatsapp: "201000000000",
      address: "شارع التحرير، القاهرة",
      hours: "9 ص - 12 م يوميًا",
      logoLetter: "M",
      logoImage: "",
    },
    categories: [
      { id: catHot, name: "مشروبات ساخنة" },
      { id: catCold, name: "مشروبات باردة" },
      { id: catFood, name: "وجبات خفيفة" },
    ],
    products: [
      { id: uid(), name: "كابتشينو", price: 65, oldPrice: 65, categoryId: catHot, desc: "إسبريسو مع فوم حليب كريمي", available: true, image: "" },
      { id: uid(), name: "لاتيه", price: 70, oldPrice: 70, categoryId: catHot, desc: "إسبريسو مع حليب مبخّر", available: true, image: "" },
      { id: uid(), name: "آيس أمريكانو", price: 55, oldPrice: 65, categoryId: catCold, desc: "إسبريسو بارد مع ماء وثلج", available: true, image: "" },
      { id: uid(), name: "فرابيه", price: 75, oldPrice: 75, categoryId: catCold, desc: "قهوة مثلجة مخفوقة", available: true, image: "" },
      { id: uid(), name: "كرواسون جبنة", price: 45, oldPrice: 45, categoryId: catFood, desc: "كرواسون فرنساوي بالجبنة", available: true, image: "" },
      { id: uid(), name: "ساندويتش كلوب", price: 95, oldPrice: 110, categoryId: catFood, desc: "دجاج، خس، طماطم، توست", available: true, image: "" },
    ],
    offers: [
      { id: uid(), title: "خصم 20% على الآيس أمريكانو", desc: "العرض لفترة محدودة", discount: 20, active: true },
    ],
  };
}
