import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { address } = await request.json();

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  const link = `/early?ref=${address}`;

  return NextResponse.json({ link });
}