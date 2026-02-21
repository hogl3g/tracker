import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const installation = await db.installation.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!installation) {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(installation);
  } catch (error) {
    console.error('Error fetching installation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch installation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const installation = await db.installation.update({
      where: { id },
      data: {
        address: body.address,
        unitNumber: body.unitNumber,
        installDate: body.installDate ? new Date(body.installDate) : undefined,
        completionDate: body.completionDate ? new Date(body.completionDate) : null,
        qualityScore: body.qualityScore,
        status: body.status,
        issuesEncountered: body.issuesEncountered,
        notes: body.notes,
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(installation);
  } catch (error) {
    console.error('Error updating installation:', error);
    return NextResponse.json(
      { error: 'Failed to update installation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.installation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting installation:', error);
    return NextResponse.json(
      { error: 'Failed to delete installation' },
      { status: 500 }
    );
  }
}
