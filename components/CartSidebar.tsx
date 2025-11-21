import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, Receipt, User } from 'lucide-react'; // Tambah icon User
import { CartItem } from '../types';
import { formatRupiah } from '../utils';

interface CartSidebarProps {
  cart: CartItem[];
  orderNumber: number;
  // Props Baru
  customerName: string;
  setCustomerName: (name: string) => void;
  
  onAdd: (item: CartItem) => void;
  onDecrease: (item: CartItem) => void;
  onCheckout: () => void;
}

export default function CartSidebar({ 
    cart, 
    orderNumber, 
    customerName, 
    setCustomerName, 
    onAdd, 
    onDecrease, 
    onCheckout 
}: CartSidebarProps) {
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="w-full lg:w-96">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-24">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="font-bold text-lg">Current Order</h2>
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-mono font-bold text-slate-600">
            #{String(orderNumber).padStart(3, '0')}
          </span>
        </div>

        {/* INPUT NAMA CUSTOMER */}
        <div className="mb-4">
           <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Nama Pelanggan</label>
           <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
               <User size={18} className="text-gray-400" />
               <input
                   type="text"
                   value={customerName}
                   onChange={(e) => setCustomerName(e.target.value)}
                   placeholder="Cth: Budi Santoso"
                   className="bg-transparent outline-none w-full text-sm font-semibold text-slate-700 placeholder-gray-400"
               />
           </div>
        </div>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-center py-8 text-sm italic">
                Keranjang kosong
              </motion.p>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-sm text-slate-700">{item.name}</p>
                    <p className="font-bold text-sm text-orange-600">{formatRupiah(item.price * item.qty)}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">@ {formatRupiah(item.price)}</p>
                    <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 border shadow-sm">
                      <button onClick={() => onDecrease(item)} className="text-slate-400 hover:text-orange-600 transition">
                        {item.qty === 1 ? <Trash2 size={14} className="text-red-400" /> : <Minus size={14} />}
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => onAdd(item)} className="text-slate-400 hover:text-green-600 transition">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 pt-4 border-t space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-orange-600 text-xl">{formatRupiah(totalPrice)}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
          >
            <Receipt size={18} /> Proses Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}