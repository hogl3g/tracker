# Quick Start Guide

Get your field supervisor tracker running in minutes!

## 5-Minute Setup

### 1. Start the App
```bash
cd field-supervisor-tracker
npm run dev
```
- Open http://localhost:3000 in your browser
- Dashboard loads automatically

### 2. Create Your First Project
- Click "New Project" (top right)
- Fill in:
  - **Project Name**: e.g., "Downtown Renovation Phase 1"
  - **Address**: Project location
  - **Start Date**: When work begins
  - **Units Planned**: How many units/sections
  - **Supervisor**: Your name
- Click "Save"

### 3. Track Progress
- Go to Projects page
- Click project to edit
- Update:
  - Units Completed
  - Quality Rating (1-10)
  - Any issues encountered

### 4. View Analytics
- Click "Dashboard" in top menu
- See real-time statistics:
  - Total projects
  - Completion rates
  - Quality averages
  - Active projects

## Common Tasks

### Add Installation Details
1. From project, click "Add Installation"
2. Enter address, date, quality score
3. Save

### Add Material Tracking
1. From project, click "Add Material"
2. Enter material name, quantity, cost
3. Mark as ordered/received/used

### Generate Report
1. Go to Dashboard
2. Click "Generate Report"
3. Select project or date range
4. View or download report

### Export Your Data
1. Go to Projects
2. Click "Export CSV" or "Export JSON"
3. Saves to your computer

### Import Projects
1. Go to Projects
2. Click "Import Data"
3. Select CSV or JSON file
4. Projects added automatically

## Features at a Glance

| Feature | Location | Use Case |
|---------|----------|----------|
| **New Project** | Projects page | Start tracking work |
| **Update Progress** | Click any project | Track completion |
| **View Analytics** | Dashboard | Understand metrics |
| **Generate Reports** | Dashboard | Create documentation |
| **Export Data** | Projects page | Share/backup data |
| **Import Data** | Projects page | Bulk operations |

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick search
- `Escape` - Close dialogs
- `Ctrl/Cmd + ,` - Settings

## Tips & Tricks

### Pro Tip 1: Bulk Import
- Export from Excel as CSV
- Import to tracker
- Format: name, address, dateStarted, unitsPlanned

### Pro Tip 2: Regular Updates
- Update daily for accurate metrics
- Quality ratings impact overall score
- Issues logged are searchable

### Pro Tip 3: Dashboard Insights
- Check completion trends
- Identify problem areas
- Plan better schedules

### Pro Tip 4: Report Generation
- Export reports weekly
- Share with management
- Archive for compliance

## Default Navigation

```
Home (/)
├── Projects (/projects)
│   ├── Create New Project
│   ├── Edit Project
│   ├── Add Installation
│   ├── Add Material
│   ├── Export Data
│   └── Import Data
├── Dashboard (/dashboard)
│   ├── Project Statistics
│   ├── Quality Metrics
│   ├── Generate Report
│   └── Completion Charts
└── Settings (future)
```

## Data You Can Track

### Per Project
- ✅ Project name & address
- ✅ Start & completion dates
- ✅ Units completed/planned
- ✅ Quality rating
- ✅ Supervisor name
- ✅ Status (active/completed/on-hold)
- ✅ Notes & issues
- ✅ Installations
- ✅ Materials needed
- ✅ Cost tracking

### Per Installation
- ✅ Specific address
- ✅ Unit number
- ✅ Installation date
- ✅ Completion date
- ✅ Quality score (1-10)
- ✅ Issues encountered
- ✅ Status tracking

### Per Material
- ✅ Material type
- ✅ Quantity needed
- ✅ Supplier info
- ✅ Cost
- ✅ Date received
- ✅ Usage status

## Sample Data Format (for Import)

### CSV Example
```
name,address,dateStarted,unitsPlanned,supervisor,status
Main Street Renovation,123 Main St,2026-02-01,10,John Doe,active
Downtown Phase 2,456 Oak Ave,2026-01-15,15,Jane Smith,completed
```

### JSON Example
```json
[
  {
    "name": "Main Street Renovation",
    "address": "123 Main St",
    "dateStarted": "2026-02-01T00:00:00Z",
    "unitsPlanned": 10,
    "supervisor": "John Doe",
    "status": "active"
  }
]
```

## Helpful Resources

- 📖 Full Documentation: See README.md
- 🚀 Deployment Guide: See DEPLOYMENT_GUIDE.md
- 🐛 Issues: Check GitHub issues
- 💬 Questions: Contact support

## Next Steps

1. ✅ **Create 3-5 sample projects** - Get familiar with the UI
2. ✅ **Add installations** - Practice detailed tracking
3. ✅ **Check dashboard** - See analytics in action
4. ✅ **Export data** - Understand your export format
5. ✅ **Read deployment guide** - Plan going online

## Still Have Questions?

- **Can I use this offline?** Yes, works offline with localStorage
- **Can I share projects?** Export as CSV/JSON and send
- **Is my data backed up?** Local database; backup with exports
- **Can I undo changes?** Not yet, but each project stores history

## Emergency Contacts

- **Database corrupted?** `npx prisma db reset`
- **App won't start?** `npm install && npm run dev`
- **Build error?** `npm run build` to see errors

---

**You're all set! Start tracking projects now!** 🚀
