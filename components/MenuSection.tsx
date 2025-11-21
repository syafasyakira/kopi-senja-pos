// components/MenuSection.tsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react'; // Tambah icon Search
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menu';
import { formatRupiah } from '../utils';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<'minuman' | 'makanan'>('minuman');
  const [searchQuery, setSearchQuery] = useState(""); // STATE BARU

  const filteredMenu = useMemo(() => {
    // 1. Filter Kategori Dulu
    let items = activeTab === 'minuman' 
      ? MENU_ITEMS.filter((i) => ['Coffee', 'Non-Coffee'].includes(i.category))
      : MENU_ITEMS.filter((i) => ['Pastry', 'Cake'].includes(i.category));

    // 2. Filter Pencarian (Jika ada ketikan)
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [activeTab, searchQuery]);

  return (
    <div className="flex-1">
      {/* SEARCH BAR & TABS WRAPPER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Input Search */}
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Cari menu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          {['minuman', 'makanan'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg font-bold capitalize text-sm transition-all ${
                  activeTab === tab 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Menu (Sama seperti sebelumnya) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMenu.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400">
                Menu tidak ditemukan 😔
            </div>
        ) : (
            filteredMenu.map((item) => (
                // ... kode motion.div kamu yang lama ...
                <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                    <div className="text-center mb-2">
                    <div className="text-5xl mb-3">{item.emoji}</div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-orange-600 font-semibold text-sm">{formatRupiah(item.price)}</p>
                    </div>
                    <button
                    onClick={() => onAddToCart(item)}
                    className="mt-2 w-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-1"
                    >
                    <Plus size={16} /> Tambah
                    </button>
                </motion.div>
            ))
        )}
      </div>
    </div>
  );
}