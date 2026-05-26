import { NextResponse } from 'next/server';
import { createModelActivity, listModelActivity } from '../../../lib/db';
import type { ModelActivity } from '../../../lib/mission-control';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ activity: await listModelActivity() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const activity = (await request.json()) as Omit<ModelActivity, 'id'>;
    await createModelActivity(activity);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
