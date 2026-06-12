import { NextRequest, NextResponse } from 'next/server';
import { addProperty, readWatchlist } from '@/lib/store';
import { Property } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const data = readWatchlist();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read watchlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const property: Property = {
      ...body,
      id: uuidv4(),
      addedAt: new Date().toISOString(),
      priceHistory: [{ date: new Date().toISOString().split('T')[0], price: body.price }],
      tags: body.tags || [],
    };
    const data = addProperty(property);
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add property' }, { status: 500 });
  }
}
