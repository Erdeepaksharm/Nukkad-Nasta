import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pincode = '201301', orderType = 'delivery' } = body;

    let fee = 2900;
    let etaMinutes = 30;

    if (pincode === '201301') {
      fee = 0; // Central Noida Zone (Sec 18/15/16)
      etaMinutes = 20;
    } else if (orderType === 'pickup') {
      fee = 0;
      etaMinutes = 15;
    }

    return NextResponse.json({
      success: true,
      estimate: {
        fee,
        etaMinutes,
        isDeliverable: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
