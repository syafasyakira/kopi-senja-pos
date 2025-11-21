'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

import MenuSection from '@/components/MenuSection';
import CartSidebar from '@/components/CartSidebar';
import PaymentModal from '@/components/PaymentModal';
import ReceiptModal from '@/components/ReceiptModal';

import { CartItem, MenuItem, PaymentMethod } from '@/types';

export default function PosPage() {
  // --- STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState(1);
  const [currentDate, setCurrentDate] = useState<string>("");
  
  // STATE BARU: Nama Customer
  const [customerName, setCustomerName] = useState(""); 

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [tempPaymentData, setTempPaymentData] = useState<{ method: PaymentMethod; cash: number }>({
    method: 'CASH',
    cash: 0,
  });

  useEffect(() => {
    setCurrentDate(new Date().toLocaleString('id-ID'));
  }, []);

  // --- LOGIC FUNCTIONS ---
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const decreaseCartItem = (item: CartItem) => {
    setCart((prev) => {
      if (item.qty > 1) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i));
      } else {
        return prev.filter((i) => i.id !== item.id);
      }
    });
  };

  const handlePaymentConfirmed = (method: PaymentMethod, cash: number) => {
    setTempPaymentData({ method, cash });
    setIsPaymentModalOpen(false);
    setIsReceiptOpen(true);
  };

  const handleNewOrder = () => {
    setCart([]);
    setCustomerName(""); // RESET NAMA CUSTOMER
    setIsReceiptOpen(false);
    setOrderNumber((prev) => prev + 1);
    setCurrentDate(new Date().toLocaleString('id-ID'));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <nav className="bg-white border-b px-6 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
          ☕ Kopi Senja <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">POS System</span>
        </h1>
        <div className="relative">
          <ShoppingCart className="text-slate-600" />
          {cart.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
            >
              {cart.reduce((a, c) => a + c.qty, 0)}
            </motion.span>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <MenuSection onAddToCart={addToCart} />

        {/* UPDATE PROPS KE SIDEBAR */}
        <CartSidebar
          cart={cart}
          orderNumber={orderNumber}
          customerName={customerName}         // Kirim value
          setCustomerName={setCustomerName}   // Kirim fungsi update
          onAdd={addToCart}
          onDecrease={decreaseCartItem}
          onCheckout={() => setIsPaymentModalOpen(true)}
        />
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        totalPrice={cart.reduce((acc, item) => acc + item.price * item.qty, 0)}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirmed}
      />

      {/* UPDATE PROPS KE STRUK */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        cart={cart}
        orderNumber={orderNumber}
        customerName={customerName} // Kirim nama ke struk
        date={currentDate}
        paymentMethod={tempPaymentData.method}
        cashReceived={tempPaymentData.cash}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
}