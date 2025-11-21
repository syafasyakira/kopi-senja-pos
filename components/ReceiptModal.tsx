import { motion, AnimatePresence } from 'framer-motion';
import { Printer } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';
import { formatRupiah } from '../utils';

interface ReceiptModalProps {
  isOpen: boolean;
  cart: CartItem[];
  orderNumber: number;
  customerName: string; // Props Baru
  date: string;
  paymentMethod: PaymentMethod;
  cashReceived: number;
  onNewOrder: () => void;
}

export default function ReceiptModal({ 
    isOpen, 
    cart, 
    orderNumber, 
    customerName, 
    date, 
    paymentMethod, 
    cashReceived, 
    onNewOrder 
}: ReceiptModalProps) {
  if (!isOpen) return null;

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const changeAmount = cashReceived - totalPrice;

  const handlePrintAndNewOrder = () => {
    window.print();
    setTimeout(() => {
        onNewOrder();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-md">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          id="printable-area" 
          className="bg-white w-full max-w-xs p-0 overflow-hidden rounded shadow-2xl relative"
        >
          <div className="bg-orange-600 h-2 w-full"></div>

          <div className="p-8 font-mono text-sm text-slate-700">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl">☕</div>
              </div>
              <h2 className="font-bold text-xl tracking-wider">KOPI SENJA</h2>
              <p className="text-xs text-gray-400">Jl. NextJS Raya No. 5, Malang</p>
              <p className="text-xs text-gray-400 mt-1">Telp: 0812-3456-7890</p>
            </div>

            <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Order #{String(orderNumber).padStart(3, '0')}</span>
                <span>{date}</span>
              </div>
              
              {/* TAMPILKAN NAMA CUSTOMER */}
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Customer</span>
                <span className="font-bold text-slate-700 uppercase">{customerName || 'GUEST'}</span>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span className="w-8/12">
                    {item.name} <span className="text-xs text-gray-400">x{item.qty}</span>
                  </span>
                  <span className="font-semibold">{formatRupiah(item.qty * item.price)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-2 text-xs">
                <div className="flex justify-between">
                  <span>Metode</span>
                  <span className="font-bold">{paymentMethod}</span>
                </div>
                {paymentMethod === 'CASH' && (
                  <>
                    <div className="flex justify-between">
                      <span>Tunai</span>
                      <span>{formatRupiah(cashReceived)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kembali</span>
                      <span>{formatRupiah(changeAmount)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-gray-400">
              <p>~ Terima Kasih ~</p>
              <p className="mt-1">Silakan berkunjung kembali</p>
            </div>

            <div className="mt-6 flex justify-center opacity-50">
              <div className="h-8 w-48 bg-slate-800 flex items-center justify-center text-white text-[10px] tracking-[4px]">
                ||| |||| | ||| ||
              </div>
            </div>
          </div>

          <div className="no-print p-4 bg-gray-50 border-t">
            <button
                onClick={handlePrintAndNewOrder}
                className="w-full bg-slate-900 text-white py-3 font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 rounded-lg"
            >
                <Printer size={16} /> Cetak & Pesanan Baru
            </button>
          </div>
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
}