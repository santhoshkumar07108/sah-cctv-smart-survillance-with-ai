import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    detections: [
      {
        id: 'DET-101',
        cameraId: 'BOP-02',
        label: 'PERSON',
        confidence: 0.96,
        bbox: { x: 28, y: 44, width: 6, height: 14 },
        behavior: 'WALKING',
        motionVector: { dx: 1.2, dy: -0.4 },
      },
      {
        id: 'DET-102',
        cameraId: 'CHECKPOST-04',
        label: 'VEHICLE',
        confidence: 0.92,
        bbox: { x: 55, y: 62, width: 18, height: 11 },
        behavior: 'STATIONARY',
      },
    ],
  });
}
