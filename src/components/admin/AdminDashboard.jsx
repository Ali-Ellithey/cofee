import { useState } from "react";

// دالة ضغط وتحويل الصور
function resizeImageFile(file, maxDim = 480, quality = 0.72) {
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

export default function AdminDashboard({ menuData, onUpdateMenu }) {
  const [storeIdentity, setStoreIdentity] = useState({
    restaurantName: menuData.restaurantName || "",
    address: menuData.address || "",
    tagline: menuData.tagline || "",
    whatsapp: menuData.whatsapp || "",
    facebook: menuData.facebook || "",
    instagram: menuData.instagram || "",
    tiktok: menuData.tiktok || "",
  });

  const [isEditing, setIsEditing] = useState({
    restaurantName: false,
    address: false,
    tagline: false,
    whatsapp: false,
    facebook: false,
    instagram: false,
    tiktok: false,
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: menuData.categories?.[0]?.id || 1,
    image: "",
  });

  const [newCategoryName, setNewCategoryName] = useState("");

  const handleProductImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await resizeImageFile(file, 480, 0.72);
        setNewProduct((prev) => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await resizeImageFile(file, 300, 0.8);
        onUpdateMenu({ ...menuData, logo: compressed });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveField = (fieldKey) => {
    onUpdateMenu({ ...menuData, [fieldKey]: storeIdentity[fieldKey] });
    setIsEditing((prev) => ({ ...prev, [fieldKey]: false }));
  };

  const handleDeleteField = (fieldKey) => {
    if (confirm("هل أنت متأكد من حذف هذه البيانات؟")) {
      setStoreIdentity((prev) => ({ ...prev, [fieldKey]: "" }));
      onUpdateMenu({ ...menuData, [fieldKey]: "" });
      setIsEditing((prev) => ({ ...prev, [fieldKey]: true }));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("برجاء إدخال اسم المنتج والسعر على الأقل!");
      return;
    }

    const updatedCategories = menuData.categories.map((cat) => {
      if (String(cat.id) === String(newProduct.categoryId)) {
        const products = cat.products || [];
        const productToAdd = {
          id: Date.now(),
          name: newProduct.name,
          price: Number(newProduct.price),
          description: newProduct.description,
          image: newProduct.image,
        };
        return { ...cat, products: [...products, productToAdd] };
      }
      return cat;
    });

    onUpdateMenu({ ...menuData, categories: updatedCategories });
    setNewProduct({
      name: "",
      price: "",
      description: "",
      categoryId: menuData.categories?.[0]?.id || 1,
      image: "",
    });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat = {
      id: Date.now(),
      name: newCategoryName,
      products: [],
    };

    onUpdateMenu({
      ...menuData,
      categories: [...(menuData.categories || []), newCat],
    });
    setNewCategoryName("");
  };

  const handleDeleteCategory = (categoryId) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم وكل منتجاته؟")) {
      const updatedCategories = menuData.categories.filter(
        (cat) => cat.id !== categoryId,
      );
      onUpdateMenu({ ...menuData, categories: updatedCategories });
    }
  };

  const handleDeleteProduct = (categoryId, productId) => {
    const updatedCategories = menuData.categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          products: cat.products.filter((p) => p.id !== productId),
        };
      }
      return cat;
    });
    onUpdateMenu({ ...menuData, categories: updatedCategories });
  };

  const renderIdentityField = (label, fieldKey, placeholder) => {
    const hasValue = menuData[fieldKey] && menuData[fieldKey].trim() !== "";
    const editing = isEditing[fieldKey] || !hasValue;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            color: "#b0b0b0",
            fontWeight: "500",
          }}
        >
          {label}:
        </label>
        {editing ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder={placeholder}
              value={storeIdentity[fieldKey]}
              onChange={(e) =>
                setStoreIdentity({
                  ...storeIdentity,
                  [fieldKey]: e.target.value,
                })
              }
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "8px",
                background: "#141414",
                border: "1px solid #333",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => handleSaveField(fieldKey)}
              style={{
                background: "#27ae60",
                color: "#fff",
                border: "none",
                padding: "0 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {hasValue ? "حفظ" : "إضافة"}
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#141414",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "13px",
                wordBreak: "break-all",
              }}
            >
              {menuData[fieldKey]}
            </span>
            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() =>
                  setIsEditing((prev) => ({ ...prev, [fieldKey]: true }))
                }
                style={{
                  background: "#d4a373",
                  color: "#121212",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                تعديل
              </button>
              <button
                type="button"
                onClick={() => handleDeleteField(fieldKey)}
                style={{
                  background: "transparent",
                  color: "#e74c3c",
                  border: "1px solid #e74c3c",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "650px",
        margin: "20px auto",
        boxSizing: "border-box",
        padding: "16px",
        direction: "rtl",
        fontFamily: "Cairo, sans-serif",
        color: "#f1f1f1",
        backgroundColor: "#121212",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* هيدر لوحة التحكم */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#d4a373", margin: "0 0 4px 0", fontSize: "20px" }}>
          لوحة تحكم الأدمن ⚙️
        </h2>
        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
          إدارة المتجر، الهوية، الأقسام، والمنتجات بكل مرونة
        </p>
      </div>

      {/* 1. قسم بيانات الكافيه والهوية */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "14px",
          borderRadius: "12px",
          marginBottom: "14px",
          border: "1px solid #2a2a2a",
        }}
      >
        <h3
          style={{
            color: "#d4a373",
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "14px",
            borderBottom: "1px solid #2e2e2e",
            paddingBottom: "6px",
          }}
        >
          🏷️ بيانات الكافيه وهوية المتجر
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* تحكم الشعار */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#141414",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #333",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minWidth: 0,
                flex: 1,
              }}
            >
              {menuData.logo && (
                <img
                  src={menuData.logo}
                  alt="Logo"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #d4a373",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#ccc",
                    fontWeight: "500",
                  }}
                >
                  {menuData.logo ? "شعار الكافيه الحالي" : "أضف شعار الكافيه"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <label
                style={{
                  background: "#d4a373",
                  color: "#121212",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "inline-block",
                  transition: "0.2s",
                }}
              >
                {menuData.logo ? "تغيير الشعار" : "اختر صورة 📁"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
              </label>

              {menuData.logo && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("هل أنت متأكد من حذف الشعار؟")) {
                      onUpdateMenu({ ...menuData, logo: "" });
                    }
                  }}
                  style={{
                    background: "transparent",
                    color: "#e74c3c",
                    border: "1px solid #e74c3c",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  حذف
                </button>
              )}
            </div>
          </div>

          {renderIdentityField(
            "اسم الكافيه",
            "restaurantName",
            "أدخل اسم الكافيه...",
          )}
          {renderIdentityField("العنوان", "address", "أدخل العنوان...")}
          {renderIdentityField(
            "النص الترويجي (Slogan)",
            "tagline",
            "أدخل النص الترويجي...",
          )}
          {renderIdentityField(
            "رقم الواتساب",
            "whatsapp",
            "أدخل رقم الواتساب...",
          )}
          {renderIdentityField(
            "رابط فيسبوك",
            "facebook",
            "أدخل رابط فيسبوك...",
          )}
          {renderIdentityField(
            "رابط انستجرام",
            "instagram",
            "أدخل رابط انستجرام...",
          )}
          {renderIdentityField(
            "رابط تيك توك",
            "tiktok",
            "أدخل رابط تيك توك...",
          )}
        </div>
      </div>

      {/* 2. قسم إضافة الأقسام */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "14px",
          borderRadius: "12px",
          marginBottom: "14px",
          border: "1px solid #2a2a2a",
        }}
      >
        <h3
          style={{
            color: "#d4a373",
            marginTop: 0,
            marginBottom: "10px",
            fontSize: "14px",
            borderBottom: "1px solid #2e2e2e",
            paddingBottom: "6px",
          }}
        >
          📂 إضافة قسم جديد
        </h3>
        <form
          onSubmit={handleAddCategory}
          style={{ display: "flex", gap: "8px" }}
        >
          <input
            type="text"
            placeholder="اسم القسم (مثال: مشروبات ساخنة...)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "8px",
              background: "#141414",
              border: "1px solid #333",
              color: "#fff",
              outline: "none",
              fontSize: "13px",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#27ae60",
              color: "#fff",
              border: "none",
              padding: "0 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            إضافة ➕
          </button>
        </form>
      </div>

      {/* 3. قسم إضافة منتج جديد */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "14px",
          borderRadius: "12px",
          marginBottom: "14px",
          border: "1px solid #2a2a2a",
        }}
      >
        <h3
          style={{
            color: "#d4a373",
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "14px",
            borderBottom: "1px solid #2e2e2e",
            paddingBottom: "6px",
          }}
        >
          🍔 إضافة صنف / منتج جديد
        </h3>

        <form
          onSubmit={handleAddProduct}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#aaa",
                marginBottom: "3px",
              }}
            >
              اختر القسم:
            </label>
            <select
              value={newProduct.categoryId}
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                background: "#141414",
                border: "1px solid #333",
                color: "#fff",
                outline: "none",
                fontSize: "13px",
              }}
            >
              {menuData.categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 2 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#aaa",
                  marginBottom: "3px",
                }}
              >
                اسم المنتج:
              </label>
              <input
                type="text"
                placeholder="اسم المنتج"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  background: "#141414",
                  border: "1px solid #333",
                  color: "#fff",
                  outline: "none",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#aaa",
                  marginBottom: "3px",
                }}
              >
                السعر (ج.م):
              </label>
              <input
                type="number"
                placeholder="السعر"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  background: "#141414",
                  border: "1px solid #333",
                  color: "#fff",
                  outline: "none",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#aaa",
                marginBottom: "3px",
              }}
            >
              وصف المنتج:
            </label>
            <textarea
              placeholder="وصف مختصر للمكونات..."
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                background: "#141414",
                border: "1px solid #333",
                color: "#fff",
                outline: "none",
                resize: "vertical",
                minHeight: "50px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              background: "#141414",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #333",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minWidth: 0,
                flex: 1,
              }}
            >
              {newProduct.image ? (
                <img
                  src={newProduct.image}
                  alt="Preview"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    border: "1px solid #444",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#222",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#777",
                    flexShrink: 0,
                  }}
                >
                  بدون
                </div>
              )}
              <span
                style={{
                  fontSize: "12px",
                  color: "#ccc",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {newProduct.image
                  ? "تم اختيار صورة المنتج"
                  : "لم يتم اختيار صورة"}
              </span>
            </div>

            <label
              style={{
                background: "#222",
                color: "#d4a373",
                border: "1px solid #d4a373",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                display: "inline-block",
                flexShrink: 0,
              }}
            >
              اختر صورة 📁
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <button
            type="submit"
            style={{
              background: "#d4a373",
              color: "#121212",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              width: "100%",
              marginTop: "2px",
            }}
          >
            حفظ وإضافة المنتج للمنيو 🚀
          </button>
        </form>
      </div>

      {/* 4. قسم إدارة المنتجات والأقسام الحالية */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #2a2a2a",
        }}
      >
        <h3
          style={{
            color: "#d4a373",
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "14px",
            borderBottom: "1px solid #2e2e2e",
            paddingBottom: "6px",
          }}
        >
          📋 إدارة المنتجات والأقسام الحالية
        </h3>

        {menuData.categories?.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#777",
              padding: "12px",
              fontSize: "12px",
            }}
          >
            لا توجد أقسام مضافة بعد.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {menuData.categories?.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "#141414",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    borderBottom: "1px solid #222",
                    paddingBottom: "5px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: "#d4a373",
                      fontSize: "13px",
                    }}
                  >
                    📁 {cat.name}
                  </h4>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    style={{
                      background: "transparent",
                      color: "#e74c3c",
                      border: "1px solid #e74c3c",
                      padding: "3px 6px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    حذف القسم
                  </button>
                </div>

                {cat.products?.length === 0 ? (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#777",
                      margin: 0,
                      padding: "2px 0",
                    }}
                  >
                    لا توجد منتجات هنا.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {cat.products?.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "#1c1c1c",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "1px solid #2a2a2a",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "5px",
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                background: "#2a2a2a",
                                borderRadius: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "7px",
                                color: "#777",
                                flexShrink: 0,
                              }}
                            >
                              بدون
                            </div>
                          )}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#fff",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {p.name}
                            </div>
                            <div style={{ fontSize: "10px", color: "#d4a373" }}>
                              {p.price} ج.م
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(cat.id, p.id)}
                          style={{
                            background: "transparent",
                            color: "#e74c3c",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            padding: "4px",
                          }}
                          title="حذف المنتج"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
