import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId');

    const reports = await db.report.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { generatedAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, reportType } = body;

    let reportData = {
      projectId,
      reportType: reportType || 'daily',
      totalUnitsCompleted: 0,
      totalUnitsPlanned: 0,
      completionPercentage: 0,
      averageQualityScore: 0,
      issuesCount: 0,
      content: '',
    };

    if (projectId) {
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
          installations: true,
          materialsNeeded: true,
        },
      });

      if (project) {
        const totalUnitsCompleted = project.unitsCompleted || 0;
        const totalUnitsPlanned = project.unitsPlanned || 0;
        const completionPercentage =
          totalUnitsPlanned > 0
            ? (totalUnitsCompleted / totalUnitsPlanned) * 100
            : 0;

        const installations = project.installations || [];
        const qualityScores = installations
          .filter((inst: any) => inst.qualityScore)
          .map((inst: any) => inst.qualityScore as number);
        const averageQualityScore =
          qualityScores.length > 0
            ? qualityScores.reduce((a: number, b: number) => a + b, 0) / qualityScores.length
            : 0;

        const issuesCount = installations.filter(
          (inst: any) => inst.issuesEncountered
        ).length;

        const reportContent = {
          projectName: project.name,
          address: project.address,
          supervisor: project.supervisor,
          status: project.status,
          dateStarted: project.dateStarted,
          totalUnitsCompleted,
          totalUnitsPlanned,
          completionPercentage: completionPercentage.toFixed(2),
          averageQualityScore: averageQualityScore.toFixed(2),
          installationsCount: installations.length,
          issuesCount,
          materialsCount: project.materialsNeeded?.length || 0,
        };

        reportData = {
          ...reportData,
          totalUnitsCompleted,
          totalUnitsPlanned,
          completionPercentage,
          averageQualityScore,
          issuesCount,
          content: JSON.stringify(reportContent),
        };
      }
    }

    const report = await db.report.create({
      data: reportData,
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
