import { NextResponse } from 'next/server';
import { INITIAL_HEALTH } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    health: INITIAL_HEALTH,
  });
}
