import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file as text
    const text = await file.text();
    const lines = text.split('\n');
    
    // Parse CSV
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const headers = lines[0].split(',').map(h => h.trim());
      const imported = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        // Create project from row
        try {
          const project = await db.project.create({
            data: {
              name: row.name,
              address: row.address,
              description: row.description,
              dateStarted: new Date(row.dateStarted),
              dateCompleted: row.dateCompleted ? new Date(row.dateCompleted) : null,
              unitsPlanned: row.unitsPlanned ? parseInt(row.unitsPlanned) : undefined,
              qualityRating: row.qualityRating ? parseInt(row.qualityRating) : undefined,
              supervisor: row.supervisor,
              notes: row.notes,
              issues: row.issues,
              status: row.status || 'active',
            },
          });
          imported.push(project);
        } catch (e) {
          console.error('Error importing row:', row, e);
        }
      }

      return NextResponse.json(
        { 
          success: true, 
          message: `Imported ${imported.length} projects`,
          imported 
        },
        { status: 200 }
      );
    }

    // Parse JSON
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const data = JSON.parse(text);
      const projects = Array.isArray(data) ? data : [data];
      const imported = [];

      for (const projectData of projects) {
        try {
          const project = await db.project.create({
            data: {
              name: projectData.name,
              address: projectData.address,
              description: projectData.description,
              dateStarted: new Date(projectData.dateStarted),
              dateCompleted: projectData.dateCompleted ? new Date(projectData.dateCompleted) : null,
              unitsPlanned: projectData.unitsPlanned,
              qualityRating: projectData.qualityRating,
              supervisor: projectData.supervisor,
              notes: projectData.notes,
              issues: projectData.issues,
              status: projectData.status || 'active',
            },
          });
          imported.push(project);
        } catch (e) {
          console.error('Error importing project:', projectData, e);
        }
      }

      return NextResponse.json(
        { 
          success: true, 
          message: `Imported ${imported.length} projects`,
          imported 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Unsupported file format' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
