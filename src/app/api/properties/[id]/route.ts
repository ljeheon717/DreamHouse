import { NextRequest, NextResponse } from 'next/server';
import { deleteProperty, readWatchlist, updateProperty } from '@/lib/store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const data = readWatchlist();
  const property = data.properties.find((p) => p.id === params.id);
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(property);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json();
    const data = updateProperty(params.id, updates);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = deleteProperty(params.id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
