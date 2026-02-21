import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        installations: true,
        materialsNeeded: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await db.project.create({
      data: {
        name: body.name,
        address: body.address,
        description: body.description,
        dateStarted: new Date(body.dateStarted),
        dateCompleted: body.dateCompleted ? new Date(body.dateCompleted) : null,
        unitsPlanned: body.unitsPlanned,
        qualityRating: body.qualityRating,
        supervisor: body.supervisor,
        notes: body.notes,
        issues: body.issues,
        status: body.status || 'active',
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
