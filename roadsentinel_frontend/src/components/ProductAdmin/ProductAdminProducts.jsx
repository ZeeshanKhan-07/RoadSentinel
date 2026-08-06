import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit3, X, ChevronRight, ChevronLeft, Upload, Star, ChevronDown, Filter } from "lucide-react";
import { productService } from "../../services/ProductAdmin/adminProductService";

export default function ProductAdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filters State
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [quantityFilter, setQuantityFilter] = useState("ALL");

  // Track active image index and hover states per product
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modals state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    productVehicleCategory: "TWO_WHEELERS",
    productGenderCategory: "MALE",
  });
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Edit Product Form State
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePrevImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => {
      const currentIndex = prev[productId] || 0;
      const newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  const handleNextImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => {
      const currentIndex = prev[productId] || 0;
      const newIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleAddProductSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await productService.addProduct(newProduct, selectedImageFiles);
      resetAddModal();
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAddModal = () => {
    setIsAddModalOpen(false);
    setAddStep(1);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      quantity: "",
      productVehicleCategory: "TWO_WHEELERS",
      productGenderCategory: "MALE",
    });
    setSelectedImageFiles([]);
    setImagePreviews([]);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || "",
      price: product.price || "",
      quantity: product.quantity || "",
      description: product.description || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.updateProduct(editingProduct.id, editFormData);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await productService.deleteProduct(deletingProductId);
      setDeletingProductId(null);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVehicle = vehicleFilter === "ALL" || p.productVehicleCategory === vehicleFilter;
    
    let matchesPrice = true;
    if (priceFilter === "LOW") matchesPrice = p.price < 1500;
    if (priceFilter === "HIGH") matchesPrice = p.price >= 1500;

    let matchesQuantity = true;
    if (quantityFilter === "LOW_STOCK") matchesQuantity = p.quantity < 50;
    if (quantityFilter === "IN_STOCK") matchesQuantity = p.quantity >= 50;

    return matchesName && matchesVehicle && matchesPrice && matchesQuantity;
  });

  // Neumorphic inset style
  const insetStyle = {
    backgroundColor: "#e6e7eb",
    boxShadow: "inset 6px 6px 12px #c7c9cc, inset -6px -6px 12px #ffffff",
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* RESTORED SINGLE-ROW NAVBAR */}
      <div 
        className="rounded-2xl p-4 md:px-8 transition-all duration-300 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none w-full"
        style={insetStyle}
      >

        {/* DESKTOP CATEGORY DROPDOWNS (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600 shrink-0">
          
          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black transition">
            <span>Price</span>
            <div className="relative flex items-center">
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold pr-4 appearance-none"
              >
                <option value="ALL">All</option>
                <option value="LOW">&lt; ₹1500</option>
                <option value="HIGH">&ge; ₹1500</option>
              </select>
              <ChevronDown className="h-3 w-3 text-gray-500 pointer-events-none absolute right-0" />
            </div>
          </div>

          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black transition">
            <span>Vehicle Category</span>
            <div className="relative flex items-center">
              <select 
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold pr-4 appearance-none"
              >
                <option value="ALL">All</option>
                <option value="TWO_WHEELERS">Two Wheelers</option>
                <option value="FOUR_WHEELERS">Four Wheelers</option>
              </select>
              <ChevronDown className="h-3 w-3 text-gray-500 pointer-events-none absolute right-0" />
            </div>
          </div>

          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black transition">
            <span>Quantity</span>
            <div className="relative flex items-center">
              <select 
                value={quantityFilter}
                onChange={(e) => setQuantityFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold pr-4 appearance-none"
              >
                <option value="ALL">All</option>
                <option value="IN_STOCK">In Stock (&ge; 50)</option>
                <option value="LOW_STOCK">Low Stock (&lt; 50)</option>
              </select>
              <ChevronDown className="h-3 w-3 text-gray-500 pointer-events-none absolute right-0" />
            </div>
          </div>

        </div>

        {/* SEARCH & ACTIONS */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="relative w-36 sm:w-56 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/80 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black transition shadow-sm"
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden p-2 bg-white border border-gray-200 text-gray-700 hover:text-indigo-600 rounded-xl shadow-sm transition shrink-0"
            title="Filter Options"
          >
            <Filter className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 md:px-5 py-2.5 bg-black hover:bg-gray-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Add Products</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:hidden">
          <div className="bg-white w-full sm:max-w-xs rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Filter className="h-4 w-4 text-indigo-600" />
                <span>Filters</span>
              </h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label htmlFor="mobilePriceFilterSelect" className="text-xs font-semibold text-gray-600">Price Range</label>
              <select
                id="mobilePriceFilterSelect"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
              >
                <option value="ALL">All Prices</option>
                <option value="LOW">&lt; ₹1500</option>
                <option value="HIGH">&ge; ₹1500</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="mobileVehicleFilterSelect" className="text-xs font-semibold text-gray-600">Vehicle Category</label>
              <select
                id="mobileVehicleFilterSelect"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
              >
                <option value="ALL">All Vehicles</option>
                <option value="TWO_WHEELERS">Two Wheelers</option>
                <option value="FOUR_WHEELERS">Four Wheelers</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="mobileQuantityFilterSelect" className="text-xs font-semibold text-gray-600">Stock Status</label>
              <select
                id="mobileQuantityFilterSelect"
                value={quantityFilter}
                onChange={(e) => setQuantityFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
              >
                <option value="ALL">All Stock</option>
                <option value="IN_STOCK">In Stock (&ge; 50)</option>
                <option value="LOW_STOCK">Low Stock (&lt; 50)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-indigo-700 transition mt-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT CARDS GRID */}
      {loading ? (
        <div className="text-center py-20 text-gray-700 font-semibold animate-pulse">Loading Catalog Products...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-semibold">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl p-12 text-center text-gray-500 shadow-inner" style={insetStyle}>
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => {
            const productImages = product.images || [];
            const activeImgIndex = activeImageIndexes[product.id] || 0;
            const currentImg = productImages[activeImgIndex] || "https://via.placeholder.com/300";
            const isHovered = hoveredCardId === product.id;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                style={!isHovered ? insetStyle : {}}
                className={`rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer ${
                  isHovered 
                    ? "bg-white border border-gray-200 shadow-xl scale-[1.02]" 
                    : "border border-transparent"
                }`}
              >
                {/* Image Container */}
                <div className="relative w-full h-44 bg-white/60 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
                  <img
                    src={currentImg}
                    alt={product.name}
                    className="object-contain h-full w-full group-hover:scale-105 transition duration-300"
                  />

                  {/* Carousel Controls */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handlePrevImage(e, product.id, productImages.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleNextImage(e, product.id, productImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        {productImages.map((_, idx) => (
                          <span
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-200 ${
                              activeImgIndex === idx ? "w-3 bg-black" : "w-1.5 bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeletingProductId(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full shadow-sm backdrop-blur-sm transition z-20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">{product.name}</h3>
                    <span className="font-extrabold text-gray-900 text-sm">₹{product.price}</span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">{product.description}</p>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-[10px] text-green-800 font-medium ml-1">({product.quantity} stock)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openEditModal(product)}
                  className="w-full py-2 px-3 bg-black hover:bg-white hover:text-gray-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 border border-gray-200 transition-all duration-200 shadow-sm"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Product</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                <p className="text-xs text-gray-400">Step {addStep} of 3</p>
              </div>
              <button 
                type="button" 
                onClick={resetAddModal} 
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    addStep >= step ? "w-8 bg-black" : "w-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {addStep === 1 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Upload Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-black transition cursor-pointer relative bg-gray-50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto h-8 w-8 text-black mb-2" />
                  <p className="text-xs text-gray-600 font-medium">Click or drag images to upload</p>
                  <p className="text-[10px] text-gray-400 mt-1">Select 1 to 4 product photo files</p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={src} alt="preview" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {addStep === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Helmet For Men"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="1225"
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      placeholder="110"
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter detailed description..."
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {addStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle Category</label>
                  <select
                    value={newProduct.productVehicleCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, productVehicleCategory: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="TWO_WHEELERS">Two Wheelers</option>
                    <option value="FOUR_WHEELERS">Four Wheelers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Gender Category</label>
                  <select
                    value={newProduct.productGenderCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, productGenderCategory: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
                </div>

                <div className="bg-black/5 p-3 rounded-xl text-xs text-green-800 space-y-1">
                  <p className="font-bold">Summary Review:</p>
                  <p>• Title: {newProduct.name || "N/A"}</p>
                  <p>• Price: ${newProduct.price || 0} | Stock: {newProduct.quantity || 0}</p>
                  <p>• Photos Attached: {selectedImageFiles.length}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4 mt-6">
              {addStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setAddStep((prev) => prev - 1)}
                  className="px-4 py-2 border text-gray-600 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {addStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setAddStep((prev) => prev + 1)}
                  className="px-5 py-2 bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1 border hover:text-black hover:bg-gray-300 ml-auto"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAddProductSubmit}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:bg-gray-400 ml-auto"
                >
                  {isSubmitting ? "Uploading..." : "Confirm & Submit"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
              <button 
                type="button" 
                onClick={() => setEditingProduct(null)} 
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-xl text-xs font-medium hover:bg-white border hover:text-black cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-xs text-gray-500 mb-6">
              Are you sure you want to delete this product?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-50"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 shadow-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}