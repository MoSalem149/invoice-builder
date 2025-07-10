import React, { useState } from "react";
import {
  Search,
  Plus,
  X,
  Package,
  Trash2,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { useApp } from "../../../hooks/useApp";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../hooks/useLanguage";
import { useNotificationContext } from "../../../hooks/useNotificationContext";
import { Product, InvoiceItem } from "../../../types";
import {
  validateProductName,
  validateProductDescription,
  validatePrice,
  validateDiscountRate,
} from "../../../utils/validation";

interface ProductsPanelProps {
  selectedItems: InvoiceItem[];
  onUpdate: (items: InvoiceItem[]) => void;
  onClose: () => void;
}

const ProductsPanel: React.FC<ProductsPanelProps> = ({
  selectedItems,
  onUpdate,
  onClose,
}) => {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { t, isRTL } = useLanguage();
  const { showError, showSuccess } = useNotificationContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    discount: 0,
    price: 0,
  });

  const filteredProducts = state.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchiveFilter = showArchived
      ? product.archived
      : !product.archived;
    return matchesSearch && matchesArchiveFilter;
  });

  const handleProductToggle = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
      setProductQuantities((prev) => ({ ...prev, [productId]: 1 }));
    }
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, quantity),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameError = validateProductName(newProduct.name, t);
    if (nameError) newErrors.name = nameError;

    const descriptionError = validateProductDescription(
      newProduct.description,
      t
    );
    if (descriptionError) newErrors.description = descriptionError;

    const priceError = validatePrice(newProduct.price, t);
    if (priceError) newErrors.price = priceError;

    const discountError = validateDiscountRate(newProduct.discount, t);
    if (discountError) newErrors.discount = discountError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) {
      showError(
        t("validation.validationError"),
        t("validation.fixErrorsBelow")
      );
      return;
    }

    if (!authState.isAuthenticated || !authState.token) {
      showError("Authentication required", "Please login to add products");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newProduct.name,
            description: newProduct.description || "",
            price: newProduct.price,
            discount: newProduct.discount || 0,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const product: Product = {
          id: data.data._id,
          name: data.data.name,
          description: data.data.description,
          price: data.data.price,
          discount: data.data.discount,
          archived: data.data.archived,
        };

        dispatch({ type: "ADD_PRODUCT", payload: product });
        setNewProduct({ name: "", description: "", discount: 0, price: 0 });
        setShowAddForm(false);
        setErrors({});
        showSuccess(
          "Product added successfully",
          "Product has been added to your catalog"
        );
      } else {
        const errorData = await response.json();
        showError(
          "Failed to add product",
          errorData.message || "Please try again"
        );
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showError("Network error", "Failed to connect to server");
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewProduct({ ...newProduct, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleArchiveToggle = async (
    productId: string,
    isArchived: boolean
  ) => {
    if (!authState.isAuthenticated || !authState.token) {
      showError("Authentication required", "Please login to modify products");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/archive`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ archived: !isArchived }),
        }
      );

      if (response.ok) {
        if (isArchived) {
          dispatch({ type: "UNARCHIVE_PRODUCT", payload: productId });
        } else {
          dispatch({ type: "ARCHIVE_PRODUCT", payload: productId });
        }
        showSuccess(
          isArchived ? "Product unarchived" : "Product archived",
          isArchived ? "Product has been restored" : "Product has been archived"
        );
      } else {
        const errorData = await response.json();
        showError(
          "Failed to update product",
          errorData.message || "Please try again"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      showError("Network error", "Failed to connect to server");
    }
  };

  const handleAddToInvoice = () => {
    const newItems: InvoiceItem[] = Array.from(selectedProducts).map(
      (productId) => {
        const product = state.products.find((p) => p.id === productId)!;
        const quantity = productQuantities[productId] || 1;
        const amount = product.price * quantity * (1 - product.discount / 100);
        return {
          id: Date.now().toString() + productId,
          name: product.name,
          description: product.description,
          discount: product.discount,
          quantity,
          amount,
        };
      }
    );

    onUpdate([...selectedItems, ...newItems]);
    setSelectedProducts(new Set());
    setProductQuantities({});
  };

  const handleRemoveItem = (itemId: string) => {
    onUpdate(selectedItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div
          className={`flex items-center justify-between mb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {t("product.addProducts")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Archive Toggle */}
        <div className="mb-4">
          <div
            className={`flex space-x-2 ${
              isRTL ? "space-x-reverse flex-row-reverse" : ""
            }`}
          >
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                !showArchived
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("product.activeProducts")}
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                showArchived
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("product.archivedProducts")}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
          />
          <input
            type="text"
            placeholder={t("product.searchProducts")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${
              isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
            } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        {/* Add Product Button */}
        {!showArchived && (
          <button
            onClick={() => setShowAddForm(true)}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              isRTL ? "space-x-reverse flex-row-reverse" : ""
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{t("product.addNewProduct")}</span>
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="space-y-3 mb-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`p-3 sm:p-4 border rounded-lg transition-colors ${
                selectedProducts.has(product.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${product.archived ? "opacity-60" : ""}`}
            >
              <div
                className={`flex items-start justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-start space-x-3 flex-1 min-w-0 ${
                    isRTL ? "space-x-reverse flex-row-reverse" : ""
                  }`}
                >
                  {!product.archived && (
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                      className="mt-1 flex-shrink-0"
                    />
                  )}
                  <Package className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div
                    className={`flex-1 min-w-0 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-gray-500 mt-1 break-words">
                        {product.description}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("product.price")}: ${product.price.toFixed(2)} |{" "}
                      {t("product.discountRate")}: {product.discount}%
                    </p>

                    {selectedProducts.has(product.id) && !product.archived && (
                      <div className="mt-2">
                        <label
                          className={`block text-sm font-medium text-gray-700 mb-1 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t("product.quantity")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={productQuantities[product.id] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleArchiveToggle(product.id, product.archived || false)
                  }
                  className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                  title={
                    product.archived
                      ? t("common.unarchive")
                      : t("common.archive")
                  }
                >
                  {product.archived ? (
                    <ArchiveRestore className="h-4 w-4 text-green-600" />
                  ) : (
                    <Archive className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Current Items */}
        {selectedItems.length > 0 && (
          <div className="border-t pt-6">
            <h3
              className={`text-base sm:text-lg font-medium text-gray-900 mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("product.currentItems")}
            </h3>
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-1 min-w-0 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {item.name} × {item.quantity}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 break-words">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600">
                      ${(item.amount / item.quantity).toFixed(2)} ×{" "}
                      {item.quantity} = ${item.amount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Selected Button */}
        {selectedProducts.size > 0 && (
          <div className="border-t pt-6">
            <button
              onClick={handleAddToInvoice}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t("product.addSelectedProducts").replace(
                "{count}",
                selectedProducts.size.toString()
              )}
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">{t("product.noProductsFound")}</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3
              className={`text-base sm:text-lg font-semibold text-gray-900 mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("product.addNewProduct")}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("product.name")}
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder={t("product.enterProductName")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.name && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("product.description")}
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("product.enterProductDescription")}
                  dir={isRTL ? "rtl" : "ltr"}
                  rows={3}
                />
                {errors.description && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("product.price")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.price ? "border-red-500" : "border-gray-300"}`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("product.discountRate")}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProduct.discount}
                  onChange={(e) =>
                    handleInputChange("discount", parseInt(e.target.value) || 0)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.discount ? "border-red-500" : "border-gray-300"}`}
                  placeholder="0"
                />
                {errors.discount && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.discount}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`flex space-x-3 mt-6 ${
                isRTL ? "space-x-reverse flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setErrors({});
                  setNewProduct({
                    name: "",
                    description: "",
                    discount: 0,
                    price: 0,
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("product.addProduct")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPanel;
