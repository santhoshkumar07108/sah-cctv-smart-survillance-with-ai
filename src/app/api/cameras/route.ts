import { NextResponse } from 'next/server';
import { INITIAL_CAMERAS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INITIAL_CAMERAS.length,
    cameras: INITIAL_CAMERAS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Camera stream registered successfully',
      camera: {
        id: body.id || `CAM-${Date.now()}`,
        status: 'ONLINE',
        ...body,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
