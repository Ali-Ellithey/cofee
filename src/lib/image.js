/**
 * يقرأ ملف صورة ويصغّره قبل تحويله إلى base64 (data URL)
 * الهدف: تقليل حجم الصورة المخزّنة عشان الحفظ يبقى أسرع
 * وحجم البيانات يفضل معقول لو خزّنتها في قاعدة بيانات أو تخزين محلي
 *
 * @param {File} file - ملف الصورة القادم من input[type=file]
 * @param {number} maxDim - أقصى عرض/ارتفاع بالبكسل (افتراضي 480)
 * @param {number} quality - جودة ضغط JPEG من 0 إلى 1 (افتراضي 0.72)
 * @returns {Promise<string>} data URL جاهز للاستخدام في <img src=... />
 */
export function resizeImageFile(file, maxDim = 480, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
