import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import dari file yang baru kita buat

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' }, // Urutkan biar rapi
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil menu' }, { status: 500 });
  }
}