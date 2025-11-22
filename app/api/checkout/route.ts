import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, items, totalPrice, paymentMethod } = body;

    // Simpan Order & Detail Item sekaligus (Transactional)
    const newOrder = await prisma.order.create({
      data: {
        customerName: customerName || 'Guest',
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            qty: item.qty,
            price: item.price, // Harga saat transaksi
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan transaksi' }, { status: 500 });
  }
}