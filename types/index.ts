export type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: 'Coffee' | 'Non-Coffee' | 'Pastry' | 'Cake';
  emoji: string;
};

export type CartItem = MenuItem & { qty: number };

export type PaymentMethod = 'CASH' | 'QRIS';