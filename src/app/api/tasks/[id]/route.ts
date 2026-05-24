import { NextResponse } from 'next/server';
import { updateTask } from '../../../../lib/db';
import type { Task } from '../../../../lib/mission-control';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const patch = (await request.json()) as Partial<Task>;
    const task = await updateTask(id, patch);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
