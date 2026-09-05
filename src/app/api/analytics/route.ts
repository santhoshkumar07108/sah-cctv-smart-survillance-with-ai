import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      personsTotal: 142,
      activeTracks: 14,
      avgConfidence: 0.942,
      vehicleBreakdown: {
        suv: 42,
        truck: 28,
        motorcycle: 19,
        bus: 11,
      },
      anprAccuracy: 0.958,
      anomalousBehaviors: 13,
    },
  });
}
