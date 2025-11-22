import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils';

// Tambahkan props 'items'
interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
  items: MenuItem[]; 
}

export default function MenuSection({ onAddToCart, items }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<'minuman' | 'makanan'>('minuman');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = useMemo(() => {
    // Gunakan 'items' dari props, bukan MENU_ITEMS statis
    let filtered = activeTab === 'minuman' 
      ? items.filter((i) => ['Coffee', 'Non-Coffee'].includes(i.category))
      : items.filter((i) => ['Pastry', 'Cake'].includes(i.category));

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeTab, searchQuery, items]); // Dependency update

  return (
    <div className="flex-1">
      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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

      {/* Grid Menu */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMenu.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400">
                Menu tidak ditemukan 😔
            </div>
        ) : (
            filteredMenu.map((item) => (
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