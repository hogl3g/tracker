# 🔧 Troubleshooting Guide

Common issues and solutions for your Field Supervisor Tracker

---

## 🚀 Getting the App Running

### Problem: "App won't start"

**Error**: `ENOENT: no such file or directory`

**Solution**:
```bash
# Make sure you're in the right directory
cd field-supervisor-tracker

# Install dependencies
npm install

# Try again
npm run dev
```

**Check**:
- ✅ Are you in the `field-supervisor-tracker` folder?
- ✅ Do you see `package.json` in current directory?
- ✅ Did you run `npm install`?

---

### Problem: "npm command not found"

**Error**: `npm : The term 'npm' is not recognized`

**Solution**:
1. Install Node.js: https://nodejs.org (LTS version)
2. Restart terminal/PowerShell
3. Try again: `npm --version`

**Check**:
- ✅ Node.js installed? `node --version`
- ✅ npm installed? `npm --version`
- ✅ Terminal restarted after install?

---

### Problem: "Port 3000 already in use"

**Error**: `Error: EADDRINUSE: address already in use :::3000`

**Solution 1** - Stop other app:
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /PID [PID] /F
```

**Solution 2** - Use different port:
```bash
npm run dev -- -p 3001
# Now visit http://localhost:3001
```

**Check**:
- ✅ Is another app using port 3000?
- ✅ Did dev server start earlier?
- ✅ Did you close it properly?

---

### Problem: Build fails with "Failed to compile"

**Error**: `Type error: Parameter implicitly has 'any' type`

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# If still failing, check TypeScript
npx tsc --noEmit
```

**Check**:
- ✅ Are you using Node 18+?
- ✅ Did you run `npm install`?
- ✅ Any unsaved file changes?

---

## 💾 Database Issues

### Problem: "Database file corrupt"

**Error**: `SQLITE_IOERR` or database locked

**Solution - Reset database**:
```bash
# ⚠️ WARNING: This deletes all your data!
npx prisma db reset

# This will:
# 1. Drop database
# 2. Create new one
# 3. Run migrations
```

**Before resetting**:
1. Export data: Click "Export CSV" on Projects page
2. Save backup: Move exported file to safe location
3. Then reset

**Check**:
- ✅ Did you backup data?
- ✅ Is database file corrupted?
- ✅ Is app trying to access it?

---

### Problem: "Prisma migration errors"

**Error**: `Prisma migrate error`

**Solution**:
```bash
# Generate Prisma client
npx prisma generate

# Try creating a new migration
npx prisma migrate dev

# If that doesn't work, reset
npx prisma db reset
```

**Check**:
- ✅ Is `prisma/schema.prisma` valid?
- ✅ Did you edit schema.prisma?
- ✅ Are migrations in `prisma/migrations/`?

---

### Problem: "Can't see database"

**Error**: Can't find `prisma/dev.db` file

**Solution - View database**:
```bash
# Open Prisma Studio
npx prisma studio
# Opens at http://localhost:5555
```

**Or check file**:
```bash
# Navigate to database
ls prisma/dev.db

# Should exist if app ran
```

**Check**:
- ✅ Does `prisma/dev.db` exist?
- ✅ Can you see it with file explorer?
- ✅ Is it more than 0 bytes?

---

## 🎨 Frontend Issues

### Problem: "Page doesn't load"

**Error**: Blank page or errors in browser console

**Solution**:
1. **Check browser console** (F12 > Console tab)
2. Look for red errors
3. Note the error message
4. Check solutions below

**Common causes**:
- ❌ API not responding
- ❌ Component error
- ❌ Missing data

---

### Problem: "Styles not loading"

**Error**: Page looks unstyled/broken layout

**Solution**:
```bash
# Rebuild CSS
npm run build

# Or clear cache
rm -rf .next
npm run dev
```

**Check**:
- ✅ Is Tailwind CSS installed?
- ✅ Are style imports correct?
- ✅ Is app running in dev mode?

---

### Problem: "Can't create project"

**Error**: "Form won't submit" or "API error"

**Debug steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "New Project" button
4. Look for failed requests
5. Click the request to see details

**Common causes**:
- ❌ Missing required fields
- ❌ API down
- ❌ Database issue
- ❌ Browser cache

**Solution**:
```bash
# Check API is working
curl http://localhost:3000/api/projects

# Should return JSON, not error
```

---

### Problem: "Data not showing up"

**Error**: Projects list empty after creating

**Debug**:
```bash
# Open Prisma Studio to check database
npx prisma studio

# Should see your data in the browser
```

**If empty in Prisma Studio**:
1. Check if POST worked (no error message)
2. Check browser console for errors
3. Try creating again

**If shows in Prisma but not in UI**:
1. Check if page is loading data: `Ctrl+Shift+K` > Console
2. Look for `fetchProjects` or similar
3. Check network tab for API call

---

### Problem: "Export button not working"

**Error**: Nothing happens when clicking Export

**Solution**:
1. Make sure you have projects created
2. Open browser console (F12)
3. Look for errors
4. Try these:

```bash
# If export still broken, restart app
npm run dev
```

**Check**:
- ✅ Do you have projects?
- ✅ Are they showing in list?
- ✅ Any browser console errors?

---

### Problem: "Mobile view broken"

**Error**: Layout messed up on phone

**Solution**:
```bash
# Test responsive view in browser
# Chrome: Ctrl+Shift+M
# Firefox: Ctrl+Shift+M
```

**If broken on actual phone**:
```bash
# Connect to network
# Visit: http://YOUR-IP:3000
# Instead of localhost

# Find your IP
ipconfig

# Look for "IPv4 Address"
```

---

## 📤 Import/Export Issues

### Problem: "Can't export data"

**Error**: Export button doesn't work or no file downloads

**Solution**:
```bash
# Check if projects exist
# Go to Projects page
# Look for "Export CSV" button

# If not there, create a project first
```

**If button exists but doesn't work**:
1. Check browser console for errors
2. Try different browser
3. Check if pop-ups blocked
4. Allow pop-ups for this site

---

### Problem: "Import fails"

**Error**: "Failed to upload file" or "No data imported"

**Check file format**:
```
✅ CSV: name,address,dateStarted,unitsPlanned,supervisor
✅ JSON: Array of project objects
```

**Solution**:
1. Verify file format
2. Check file size (should be small)
3. Try JSON instead of CSV
4. Check for special characters

**Example valid CSV**:
```
name,address,dateStarted,unitsPlanned,supervisor
Main Street,123 Main St,2026-02-01,10,John Doe
```

**Example valid JSON**:
```json
[{
  "name": "Main Street",
  "address": "123 Main St",
  "dateStarted": "2026-02-01",
  "unitsPlanned": 10,
  "supervisor": "John Doe"
}]
```

---

### Problem: "Imported data looks wrong"

**Error**: Fields empty or data misaligned

**Solution**:
1. Check CSV headers match expected
2. Verify data types (dates should be dates, numbers should be numbers)
3. Re-export working project to see format
4. Adjust your import file

**Required fields**:
- ✅ name (text)
- ✅ address (text)
- ✅ dateStarted (YYYY-MM-DD format)

**Optional fields**:
- ✅ unitsPlanned (number)
- ✅ supervisor (text)
- ✅ status (active/completed/on-hold)

---

## 🔍 API Issues

### Problem: "API endpoint returns error"

**Error**: 500 error when calling API

**Debug**:
```bash
# Test API from command line
curl http://localhost:3000/api/projects

# Should return JSON array
```

**If 500 error**:
1. Check server logs
2. Check database connection
3. Verify schema is correct
4. Try database reset

---

### Problem: "CORS error"

**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`

**This error appears when**:
- Calling API from different domain
- Frontend and backend on different ports

**Solution**:
- Not an issue if running locally
- Will be fixed on production

---

## 📊 Dashboard Issues

### Problem: "Dashboard shows no data"

**Error**: Charts empty or stats showing 0

**Solution**:
1. Create some projects first
2. Wait 5 seconds for dashboard to refresh
3. Try refreshing page (F5)
4. Check Projects page for data

**Check**:
- ✅ Are projects created?
- ✅ Do they have dates?
- ✅ Do they have units?

---

### Problem: "Charts not rendering"

**Error**: Blank space where chart should be

**Solution**:
```bash
# Rebuild app
npm run build

# Restart dev server
npm run dev
```

**Check**:
- ✅ Is recharts installed?
- ✅ Any console errors?
- ✅ Does project have data?

---

## 🌐 Deployment Issues

### Problem: "Can't deploy to Vercel"

**Error**: Build fails on Vercel

**Solution**:
1. Check errors in Vercel dashboard
2. Verify environment variables set
3. Ensure all dependencies installed locally:
   ```bash
   npm install
   npm run build
   ```
4. Commit and push code again

**Check**:
- ✅ Database URL set in Vercel?
- ✅ Code pushed to GitHub?
- ✅ Build succeeds locally?

---

### Problem: "Database not connecting after deploy"

**Error**: App works locally, fails after deploy

**Cause**: DATABASE_URL environment variable not set

**Solution**:
1. Go to Vercel project settings
2. Add Environment Variables
3. Set `DATABASE_URL` to production database
4. Redeploy

```bash
# Redeploy in Vercel dashboard
# Or use CLI
vercel redeploy
```

---

## 🆘 Emergency Fixes

### "Everything is broken!"

**Step 1 - Clear everything**:
```bash
rm -rf node_modules .next
npm install
```

**Step 2 - Reset database**:
```bash
npx prisma db reset
```

**Step 3 - Rebuild and start**:
```bash
npm run build
npm run dev
```

**Step 4 - If still broken**:
```bash
# Check git status
git status

# Revert recent changes
git checkout -- src/

# Start fresh
npm run dev
```

---

### "I accidentally deleted something!"

**With Git**:
```bash
# See what changed
git status

# Restore deleted file
git checkout HEAD -- path/to/file
```

**Without Git**:
- ❌ Cannot recover (use git!)
- ✅ You have exported backups (restore from CSV)

---

## 📋 Checklist Before Getting Help

- [ ] Restarted terminal
- [ ] Ran `npm install`
- [ ] Checked Node.js version: `node --version`
- [ ] Cleared cache: `rm -rf .next`
- [ ] Read error message completely
- [ ] Googled error message
- [ ] Tried solutions above
- [ ] Restarted computer

---

## 🎯 Still Stuck?

### Information to gather:
1. Exact error message
2. Steps to reproduce
3. What were you doing when it happened?
4. Does it happen every time?
5. What OS/browser are you using?

### Try these:
1. Check browser console (F12)
2. Check terminal output
3. Read error messages carefully
4. Try with different browser
5. Clear browser cache
6. Restart computer

### If still stuck:
1. Export all data (backup)
2. Reset database
3. Start fresh
4. Create minimal test case
5. Try step-by-step again

---

## 🚨 Critical Issues

### Database completely corrupted

```bash
# Last resort
npx prisma db reset

# Re-import from backup
# Go to Projects > Import Data
# Select your CSV export
```

### Can't start app at all

```bash
# Complete reset
rm -rf .next node_modules prisma/dev.db
npm install
npx prisma db push
npm run dev
```

### Loss of data

```bash
# If you exported before problem:
# 1. Reset everything
# 2. Import from export file
# 3. You're recovered!
```

---

## Prevention Tips

1. **Export regularly** - Backup your data weekly
2. **Use version control** - Commit changes with git
3. **Test before production** - Test locally first
4. **Monitor logs** - Check for errors
5. **Update dependencies** - `npm update` monthly

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `EADDRINUSE` | Port in use | Kill process or use different port |
| `ENOENT` | File not found | Check directory, run `npm install` |
| `Type error` | TypeScript issue | Check syntax, rebuild |
| `SQLITE_IOERR` | Database locked | Close other instances, reset |
| `Module not found` | Missing dependency | `npm install` |
| `CORS error` | Different domain | OK on localhost, fixed on production |

---

## Performance Issues

### App is slow

**Check**:
1. Do you have 10,000+ projects?
2. Is browser cache full?
3. Is CPU at 100%?

**Solutions**:
```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build

# Restart
npm run dev
```

### Export is taking forever

- Normal for 10,000+ records
- May take 5-10 seconds
- Larger files need more time
- Try smaller exports first

---

## Getting Help

### Documentation
- QUICK_START.md - For basics
- README.md - For features
- DEPLOYMENT_GUIDE.md - For going online

### External Help
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Stack Overflow: https://stackoverflow.com

---

**Version**: 1.0.0  
**Last Updated**: February 17, 2026  
**Status**: Current ✅

---

**Good luck! You've got this! 💪**
