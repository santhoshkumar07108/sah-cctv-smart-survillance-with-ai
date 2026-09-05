import { NextResponse } from 'next/server';
import { INITIAL_ANPR } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INITIAL_ANPR.length,
    records: INITIAL_ANPR,
  });
}
