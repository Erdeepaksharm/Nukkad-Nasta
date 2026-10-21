'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Plus, Edit3, Trash2, CheckCircle2, XCircle, Search,
  Utensils, Sparkles, Image as ImageIcon, ArrowLeft, Eye,
  UploadCloud, Link as LinkIcon, Check, FileImage
} from 'lucide-react';
import { MenuItem, INITIAL_MENU, CATEGORIES_LIST, getLiveMenu, saveLiveMenu } from '@/lib/menu-data';

const PRESET_IMAGES = [
  { name: 'Vada Pav', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pav Bhaji', url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pani Puri', url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80' },
  { name: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Dosa', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Paneer Masala', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sandwich', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lassi', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('chaat-street-food');
  const [formPrice, setFormPrice] = useState('99');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState(PRESET_IMAGES[0].url);
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formSpice, setFormSpice] = useState(1);
  const [formBestseller, setFormBestseller] = useState(false);
  const [formAvailable, setFormAvailable] = useState(true);

  // Image Upload state
  const [imageTab, setImageTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenu(getLiveMenu());
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('chaat-street-food');
    setFormPrice('99');
    setFormDesc('');
    setFormImage(PRESET_IMAGES[0].url);
    setUploadedFileName('');
    setImageTab('upload');
    setFormIsVeg(true);
    setFormSpice(1);
    setFormBestseller(false);
    setFormAvailable(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(String(Math.round(item.price / 100)));
    setFormDesc(item.description);
    setFormImage(item.image_url);
    setUploadedFileName(item.image_url.startsWith('data:image') ? 'Uploaded Image' : '');
    setImageTab(item.image_url.startsWith('data:image') ? 'upload' : 'url');
    setFormIsVeg(item.is_veg);
    setFormSpice(item.spice_level);
    setFormBestseller(!!item.is_bestseller);
    setFormAvailable(item.is_available);
    setIsModalOpen(true);
  };

  const handleProcessFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (.jpg, .jpeg, .png, or .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormImage(e.target.result as string);
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const priceInPaise = Math.round(parseFloat(formPrice || '0') * 100);

    let updated: MenuItem[];
    if (editingItem) {
      updated = menu.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formName,
              slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              category: formCategory,
              price: priceInPaise,
              description: formDesc,
              image_url: formImage,
              is_veg: formIsVeg,
              spice_level: formSpice,
              is_bestseller: formBestseller,
              is_available: formAvailable,
            }
          : item
      );
    } else {
      const newItem: MenuItem = {
        id: `m-${Date.now()}`,
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formCategory,
        price: priceInPaise,
        description: formDesc,
        image_url: formImage,
        is_veg: formIsVeg,
        spice_level: formSpice,
        is_bestseller: formBestseller,
        is_available: formAvailable,
      };
      updated = [newItem, ...menu];
    }

    setMenu(updated);
    saveLiveMenu(updated);
    setIsModalOpen(false);
  };

  const toggleAvailability = (id: string) => {
    const updated = menu.map(item =>
      item.id === id ? { ...item, is_available: !item.is_available } : item
    );
    setMenu(updated);
    saveLiveMenu(updated);
  };

  const deleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this dish from the menu?')) {
      const updated = menu.filter(i => i.id !== id);
      setMenu(updated);
      saveLiveMenu(updated);
    }
  };

  const filtered = menu.filter(item => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Utensils className="text-amber-400" />
            <span>Menu & Dish Management</span>
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Add new dishes with uploaded picture files (.jpg, .png), change prices in ₹, or mark items sold-out
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/menu" className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
            <Eye size={14} />
            <span>View Live Customer Menu</span>
          </Link>
          <button
            onClick={openAddModal}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold shadow-lg"
          >
            <Plus size={16} />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dish by name..."
            className="input pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {CATEGORIES_LIST.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat.id
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table / Cards */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 border-b border-stone-800">
              <tr>
                <th className="p-3.5">Photo & Dish</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Diet</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                  {/* Photo & Name */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-700 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.is_bestseller && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/40">
                              ⭐ BESTSELLER
                            </span>
                          )}
                        </div>
                        <div className="text-stone-400 text-[11px] line-clamp-1 max-w-xs mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5 text-stone-300 font-medium capitalize">
                    {item.category.replace(/-/g, ' ')}
                  </td>

                  {/* Price */}
                  <td className="p-3.5 font-extrabold text-amber-400 text-sm">
                    ₹{Math.round(item.price / 100)}
                  </td>

                  {/* Diet */}
                  <td className="p-3.5">
                    <span className={item.is_veg ? 'badge-veg' : 'badge-nonveg'}>
                      {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3.5">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                        item.is_available
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                      }`}
                    >
                      {item.is_available ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit dish"
                        className="p-1.5 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        title="Delete dish"
                        className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 border-amber-500/30 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {editingItem ? '✏️ Edit Menu Dish' : '➕ Add New Menu Dish'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Dish Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="e.g. Cheese Burst Pav Bhaji"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="input py-2 text-sm"
                  >
                    {CATEGORIES_LIST.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Diet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Price in Rupees (₹) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    className="input py-2 text-sm font-bold text-amber-400"
                    placeholder="149"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Diet Classification</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormIsVeg(true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        formIsVeg ? 'bg-green-600 text-white border-green-500' : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                    >
                      🟢 Pure Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormIsVeg(false)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        !formIsVeg ? 'bg-red-600 text-white border-red-500' : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                    >
                      🔴 Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="Ingredients, preparation style, and portion details..."
                />
              </div>

              {/* DISH PICTURE UPLOADER (Supports .jpg, .jpeg, .png, .webp + URL + Presets) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-200">
                    Dish Picture *
                  </label>
                  {/* Mode Selector Tabs */}
                  <div className="flex gap-1 bg-stone-900 p-0.5 rounded-lg border border-stone-800">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                        imageTab === 'upload'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <UploadCloud size={12} />
                      <span>Upload (.jpg, .png)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('preset')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                        imageTab === 'preset'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Sparkles size={12} />
                      <span>Presets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                        imageTab === 'url'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <LinkIcon size={12} />
                      <span>Web URL</span>
                    </button>
                  </div>
                </div>

                {/* 1. UPLOAD FILE TAB */}
                {imageTab === 'upload' && (
                  <div className="space-y-3 animate-fade-in">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {/* Drag and Drop Box */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                          : 'border-stone-700 hover:border-amber-500/60 bg-stone-900/60 hover:bg-stone-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-400 hover:underline">
                          Click to browse file
                        </span>
                        <span className="text-xs text-stone-300"> or drag & drop dish photo</span>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Supports: <strong className="text-stone-300">.JPG, .JPEG, .PNG, .WEBP</strong> (up to 10MB)
                        </p>
                      </div>
                    </div>

                    {/* Live Upload Preview Bar */}
                    {formImage && (
                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={formImage}
                            alt="Preview"
                            className="w-14 h-14 rounded-xl object-cover border border-amber-500/40 flex-shrink-0"
                            onError={e => { (e.target as any).src = PRESET_IMAGES[0].url; }}
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-green-400" />
                              <span>{uploadedFileName || 'Image Loaded Successfully'}</span>
                            </div>
                            <div className="text-[10px] text-stone-400 mt-0.5">
                              Ready to be displayed on food cards & menu
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-secondary text-[11px] py-1.5 px-3 font-semibold text-amber-300"
                        >
                          Change Photo
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. PRESETS TAB */}
                {imageTab === 'preset' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex gap-3 items-center">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-amber-500/40 flex-shrink-0"
                      />
                      <div className="text-xs text-stone-300">
                        <div className="font-bold text-white">Preset Food Photo Selected</div>
                        <div className="text-[11px] text-stone-400">Pick any street food favourite below:</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESET_IMAGES.map(preset => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setFormImage(preset.url);
                            setUploadedFileName(preset.name);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                            formImage === preset.url
                              ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                              : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                          }`}
                        >
                          {formImage === preset.url && <Check size={11} />}
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. WEB URL TAB */}
                {imageTab === 'url' && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex gap-3 items-center">
                      <input
                        type="url"
                        value={formImage}
                        onChange={e => {
                          setFormImage(e.target.value);
                          setUploadedFileName('Custom URL');
                        }}
                        className="input py-2 text-xs flex-1"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 flex-shrink-0"
                        onError={e => { (e.target as any).src = PRESET_IMAGES[0].url; }}
                      />
                    </div>
                    <span className="text-[11px] text-stone-400 block">
                      Paste any public image link from Unsplash, Cloudinary, or web.
                    </span>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-800">
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formBestseller}
                    onChange={e => setFormBestseller(e.target.checked)}
                    className="accent-amber-500 h-4 w-4"
                  />
                  <span>Mark as ⭐ Bestseller</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={e => setFormAvailable(e.target.checked)}
                    className="accent-amber-500 h-4 w-4"
                  />
                  <span>Available for Order</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2.5 text-xs font-bold shadow-lg"
                >
                  {editingItem ? 'Save Changes' : 'Add Dish to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
