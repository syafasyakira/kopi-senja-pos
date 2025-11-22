'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import MenuSection from '@/components/MenuSection';
import CartSidebar from '@/components/CartSidebar';
import PaymentModal from '@/components/PaymentModal';
import ReceiptModal from '@/components/ReceiptModal';

import { CartItem, MenuItem, PaymentMethod } from '@/types';

export default function PosPage() {
  // State Data Menu (Fetch dari DB)
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Aplikasi
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState(1);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [customerName, setCustomerName] = useState(""); 

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [tempPaymentData, setTempPaymentData] = useState<{ method: PaymentMethod; cash: number }>({
    method: 'CASH',
    cash: 0,
  });

  // 1. Fetch Data saat pertama buka
  useEffect(() => {
    const initData = async () => {
        setCurrentDate(new Date().toLocaleString('id-ID'));
        
        // Load Order Number LocalStorage
        const savedOrderNumber = localStorage.getItem('pos_order_number');
        if (savedOrderNumber) setOrderNumber(parseInt(savedOrderNumber));

        // Fetch Menu dari API
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Gagal fetch');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            toast.error("Gagal memuat menu dari database");
        } finally {
            setIsLoading(false);
        }
    };

    initData();
  }, []);

  // Logic Cart
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success("Item ditambahkan", { icon: '🛒', position: 'bottom-center', duration: 1500 });
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

  // Logic Checkout (Simpan ke DB)
  const handlePaymentConfirmed = async (method: PaymentMethod, cash: number) => {
    // 1. Simpan State Pembayaran Sementara
    setTempPaymentData({ method, cash });
    
    // 2. Hitung Total
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    // 3. Kirim ke API Backend
    const loadingToast = toast.loading("Menyimpan transaksi...");
    
    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName,
                items: cart,
                totalPrice,
                paymentMethod: method
            })
        });

        if (res.ok) {
            toast.success("Transaksi Berhasil!", { id: loadingToast });
            setIsPaymentModalOpen(false);
            setIsReceiptOpen(true); // Buka Struk
        } else {
            toast.error("Gagal menyimpan transaksi", { id: loadingToast });
        }
    } catch (error) {
        toast.error("Error koneksi server", { id: loadingToast });
    }
  };

  const handleNewOrder = () => {
    setCart([]);
    setCustomerName("");
    setIsReceiptOpen(false);
    setOrderNumber((prev) => {
        const next = prev + 1;
        localStorage.setItem('pos_order_number', next.toString());
        return next;
    });
    setCurrentDate(new Date().toLocaleString('id-ID'));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Toaster />
      
      <nav className="bg-white border-b px-6 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
          ☕ Kopi Senja <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Fullstack POS</span>
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
        {isLoading ? (
            <div className="flex-1 flex flex-col justify-center items-center min-h-[50vh] text-gray-400 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <p>Mengambil data menu dari database...</p>
            </div>
        ) : (
            <MenuSection items={products} onAddToCart={addToCart} />
        )}

        <CartSidebar
          cart={cart}
          orderNumber={orderNumber}
          customerName={customerName}
          setCustomerName={setCustomerName}
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

      <ReceiptModal
        isOpen={isReceiptOpen}
        cart={cart}
        orderNumber={orderNumber}
        customerName={customerName}
        date={currentDate}
        paymentMethod={tempPaymentData.method}
        cashReceived={tempPaymentData.cash}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
}