import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const materials = await db.materialNeed.findMany({
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.projectId || !body.materialName || !body.quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const material = await db.materialNeed.create({
      data: {
        projectId: body.projectId,
        materialName: body.materialName,
        quantity: body.quantity,
        unit: body.unit || 'pieces',
        status: body.status || 'needed',
        dateNeeded: body.dateNeeded ? new Date(body.dateNeeded) : null,
        dateReceived: body.dateReceived ? new Date(body.dateReceived) : null,
        cost: body.cost,
        supplier: body.supplier,
        notes: body.notes,
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    );
  }
}
