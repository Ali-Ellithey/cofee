// مولّد معرّف قصير وفريد، يستخدم في الأقسام والمنتجات والعروض
export const uid = () => Math.random().toString(36).slice(2, 9);
