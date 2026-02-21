# Deployment Guide - Field Supervisor Tracker

This guide will walk you through deploying your field supervisor tracking system online.

## Quick Start Deployment Options

### Option 1: Vercel (Easiest - Recommended)

Vercel is the creator of Next.js and provides the simplest deployment experience.

**Steps:**

1. **Push to GitHub**
   - Create a GitHub account (github.com)
   - Create a new repository
   - Push your project code

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"
   
3. **Configure Environment**
   - Environment Variables:
     - Add `DATABASE_URL` (your database connection string)
   - Click "Deploy"

4. **Your app is live!**
   - Vercel provides a URL like: `https://your-project.vercel.app`

**Cost:** Free tier available, paid plans from $5/month

---

### Option 2: Netlify (Free Alternative)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub account
4. Select your repository
5. Set build command: `npm run build`
6. Set publish directory: `.next`
7. Click Deploy

**Cost:** Free tier sufficient for most projects

---

### Option 3: AWS (For Enterprise)

**Benefits:**
- Highly scalable
- More control
- Various service options

**Methods:**
- **AWS Amplify** (easiest)
- **EC2 Instance** (more control)
- **Elastic Beanstalk** (managed)
- **ECS/Fargate** (containerized)

**Cost:** Free tier available, then $0.10-$5+/month

---

### Option 4: DigitalOcean (Affordable VPS)

1. Create DigitalOcean account
2. Create a new App (managed option) or Droplet (VPS)
3. Connect GitHub repository
4. Configure build settings
5. Deploy

**Cost:** $5-12/month

---

### Option 5: Azure (Microsoft Cloud)

Use Azure App Service:
1. Create Azure account
2. Create App Service for Node.js
3. Connect GitHub
4. Configure CI/CD
5. Deploy

**Cost:** Free tier available, paid plans from $7/month

---

## Production Database Setup

### SQLite (Current - Local File)
✅ Good for: Development, small teams
❌ Limited for: Multi-user access, backups

### PostgreSQL (Recommended for Production)

**Using Supabase (PostgreSQL Hosting):**

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Create PostgreSQL database
4. Get connection string
5. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

6. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

**Cost:** Free tier up to 2 projects, then $25/month

### MySQL

**Using PlanetScale:**
1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update environment variables
5. Run migrations

**Cost:** Free tier available

### MongoDB (Document Database)

If you prefer MongoDB:
1. Use MongoDB Atlas: [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create cluster
3. Get connection string
4. Would need schema changes (Prisma supports MongoDB)

---

## Complete Production Setup Example (Vercel + Supabase)

### Step 1: Set Up Database (Supabase)

```bash
# 1. Create Supabase account and database
# 2. Get connection string from Supabase dashboard
# 3. Create .env.production.local:

DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
```

### Step 2: Prepare for Production

```bash
# Update your local .env for production testing
cp .env.production.local .env.local

# Run migrations
npx prisma migrate deploy

# Build locally to test
npm run build

# Start production server
npm start
```

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Step 4: Configure in Vercel Dashboard

1. Go to Vercel project settings
2. Environment Variables:
   ```
   DATABASE_URL = [your-supabase-connection-string]
   NODE_ENV = production
   ```
3. Redeploy

---

## Scaling Your Application

### Level 1: Single Server (Current)
- Vercel + Supabase
- Good for: <1,000 users
- Cost: ~$30/month

### Level 2: Multiple Regions
- Vercel (multi-region automatic)
- CDN for static assets
- Good for: 1,000-10,000 users
- Cost: ~$50-100/month

### Level 3: Custom Infrastructure
- Load balancer
- Multiple app servers
- Separate database server
- Redis caching
- Good for: 10,000+ users
- Cost: $200-500+/month

---

## Monitoring & Maintenance

### Essential Monitoring

1. **Error Tracking** (use Sentry)
   ```bash
   npm install @sentry/nextjs
   ```

2. **Performance Monitoring** (built-in with Vercel)

3. **Uptime Monitoring** (use UptimeRobot)
   - Go to uptimerobot.com
   - Monitor your app URL
   - Get alerts if it goes down

### Automated Backups

**For Supabase:**
- Backups included with paid plan
- Daily automated backups

**For DigitalOcean:**
- Configure automated backups in account settings
- Add backup costs (~$2-3/month)

### Regular Maintenance

- Monitor database size
- Check error logs weekly
- Update dependencies monthly
  ```bash
  npm outdated
  npm update
  ```
- Test disaster recovery quarterly

---

## Cost Breakdown

### Minimal Setup (Hobby)
- Vercel: $0 (free tier)
- Supabase: $0 (free tier)
- Domain: $12/year
- **Total: ~$1/month**

### Recommended Setup (Small Business)
- Vercel: $20/month (Pro)
- Supabase: $25/month (Team)
- Domain: $12/year
- **Total: ~$50/month**

### Enterprise Setup
- Vercel: $150+/month
- PostgreSQL: $100+/month
- Backups/Monitoring: $50+/month
- **Total: $300+/month**

---

## Custom Domain Setup

### Steps:
1. Purchase domain (godaddy.com, namecheap.com, etc.)
2. Update DNS settings:
   - **For Vercel:**
     - Add your domain in Vercel project settings
     - Update DNS records as shown
   - **For other providers:**
     - Point nameservers to your host

3. Wait 24-48 hours for DNS propagation

4. Configure SSL (automatic with most hosts)

---

## Troubleshooting Deployment

### Build Fails

**Check these:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Database Connection Errors

```bash
# Test connection string
npx prisma db push --skip-generate

# Check environment variables loaded
console.log(process.env.DATABASE_URL)
```

### Performance Issues

1. Check Vercel Analytics
2. Optimize database queries
3. Enable caching:
   ```typescript
   export const revalidate = 3600; // Cache for 1 hour
   ```

### Memory Issues

Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 3008,
      "maxDuration": 60
    }
  }
}
```

---

## Rollback Procedure

If something breaks in production:

### Using Vercel:
1. Go to Vercel dashboard
2. Go to "Deployments"
3. Find previous working deployment
4. Click "Redeploy"

### Manual Rollback:
```bash
git revert [commit-hash]
git push origin main
# Vercel auto-deploys
```

---

## Suggested Next Steps

1. ✅ Test locally (`npm run dev`)
2. ✅ Push to GitHub
3. ✅ Create Supabase database
4. ✅ Deploy to Vercel
5. ✅ Configure custom domain
6. ✅ Set up monitoring
7. ✅ Plan scaling strategy

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Vercel Support: https://vercel.com/support
- Supabase Docs: https://supabase.com/docs

---

**Ready to deploy? Start with Option 1: Vercel + Supabase** - it's the fastest and most cost-effective!
