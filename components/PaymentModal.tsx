import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Banknote, QrCode, ChevronRight } from 'lucide-react';
import { formatRupiah } from '../utils';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  totalPrice: number;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, cashReceived: number) => void;
}

export default function PaymentModal({ isOpen, totalPrice, onClose, onConfirm }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const changeAmount = cashReceived - totalPrice;

  // Reset state setiap modal dibuka
  useEffect(() => {
    if (isOpen) {
      setCashReceived(0);
      setPaymentMethod('CASH');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">Metode Pembayaran</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'CASH' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 hover:border-orange-200'
              }`}
            >
              <Banknote size={32} />
              <span className="font-bold">Tunai</span>
            </button>
            <button
              onClick={() => setPaymentMethod('QRIS')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'QRIS' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 hover:border-orange-200'
              }`}
            >
              <QrCode size={32} />
              <span className="font-bold">QRIS</span>
            </button>
          </div>

          {paymentMethod === 'CASH' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Tagihan</label>
                <div className="text-xl font-bold text-slate-800">{formatRupiah(totalPrice)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uang Diterima</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Rp 0"
                  value={cashReceived === 0 ? '' : cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                />
              </div>
              <div className={`p-3 rounded-lg ${changeAmount >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="flex justify-between font-bold">
                  <span>Kembalian:</span>
                  <span>{formatRupiah(changeAmount >= 0 ? changeAmount : 0)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in">
              <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-slate-300">
                <QrCode size={64} className="text-slate-300" />
              </div>
              <p className="text-sm text-gray-500">Scan QRIS untuk membayar</p>
              <p className="font-bold text-xl mt-2">{formatRupiah(totalPrice)}</p>
            </div>
          )}

          <button
            disabled={paymentMethod === 'CASH' && cashReceived < totalPrice}
            onClick={() => onConfirm(paymentMethod, cashReceived)}
            className="w-full mt-8 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
          >
            Konfirmasi Bayar <ChevronRight size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}