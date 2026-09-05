import { NextResponse } from 'next/server';
import { INITIAL_EVENTS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INITIAL_EVENTS.length,
    events: INITIAL_EVENTS,
  });
}
