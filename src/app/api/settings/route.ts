import { NextResponse } from 'next/server';
import { listSettings, upsertSettingGroup } from '../../../lib/db';
import type { SettingGroup } from '../../../lib/mission-control';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ settings: await listSettings() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const group = (await request.json()) as SettingGroup;
    await upsertSettingGroup(group);
    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
