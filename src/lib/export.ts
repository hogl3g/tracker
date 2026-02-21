export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle nested objects and arrays
      if (typeof value === 'object') {
        return JSON.stringify(value).replace(/"/g, '""');
      }
      // Handle strings with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvContent += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateProjectReport(project: any): string {
  const report = `
===========================================
PROJECT QUALITY REPORT
===========================================

Project Name: ${project.name}
Address: ${project.address}
Supervisor: ${project.supervisor || 'N/A'}
Status: ${project.status}

DATES
=====================================
Start Date: ${new Date(project.dateStarted).toLocaleDateString()}
Completion Date: ${project.dateCompleted ? new Date(project.dateCompleted).toLocaleDateString() : 'In Progress'}

UNITS & COMPLETION
=====================================
Units Completed: ${project.unitsCompleted}
Units Planned: ${project.unitsPlanned || 'N/A'}
Completion Rate: ${project.unitsPlanned ? Math.round((project.unitsCompleted / project.unitsPlanned) * 100) : 'N/A'}%

QUALITY METRICS
=====================================
Overall Quality Rating: ${project.qualityRating || 'N/A'}/10

ADDITIONAL NOTES
=====================================
${project.notes || 'No notes'}

ISSUES
=====================================
${project.issues || 'No issues reported'}

Report Generated: ${new Date().toLocaleString()}
  `;
  
  return report;
}
