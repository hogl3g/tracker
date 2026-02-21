import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const installations = await db.installation.findMany({
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(installations);
  } catch (error) {
    console.error('Error fetching installations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch installations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.projectId || !body.address || !body.installDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const installation = await db.installation.create({
      data: {
        projectId: body.projectId,
        address: body.address,
        unitNumber: body.unitNumber,
        installDate: new Date(body.installDate),
        completionDate: body.completionDate ? new Date(body.completionDate) : null,
        qualityScore: body.qualityScore,
        status: body.status || 'pending',
        issuesEncountered: body.issuesEncountered,
        notes: body.notes,
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(installation, { status: 201 });
  } catch (error) {
    console.error('Error creating installation:', error);
    return NextResponse.json(
      { error: 'Failed to create installation' },
      { status: 500 }
    );
  }
}
