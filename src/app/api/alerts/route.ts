import { NextResponse } from 'next/server';
import { INITIAL_ALERTS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INITIAL_ALERTS.length,
    alerts: INITIAL_ALERTS,
  });
}
