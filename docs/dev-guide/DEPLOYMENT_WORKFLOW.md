# DEPLOYMENT WORKFLOW GUIDE

> **PURPOSE:** Step-by-step deployment process for all projects. Follow this to ensure smooth, error-free deployments.

---

## TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [Alternative Platforms](#alternative-platforms)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Tasks](#post-deployment-tasks)
7. [Troubleshooting](#troubleshooting)

---

## PRE-DEPLOYMENT CHECKLIST

### 1. Local Build Test

```bash
# Clean install dependencies
rm -rf node_modules .next
npm install

# Build project
npm run build

# Test production build locally
npm run start
```

**Check for:**
- [ ] No build errors
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] All pages load correctly
- [ ] All images load
- [ ] All links work
- [ ] Forms submit correctly

### 2. Code Quality Check

```bash
# Run linting
npm run lint

# Check TypeScript types
npx tsc --noEmit

# Format code
npx prettier --write .
```

- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] Code formatted

### 3. Performance Audit

```bash
# Run Lighthouse (in Chrome DevTools)
# Or use Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

**Target Scores:**
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 95+

### 4. Content Review

- [ ] No lorem ipsum or placeholder text
- [ ] No broken images
- [ ] No 404 links
- [ ] All meta tags set correctly
- [ ] Favicon present
- [ ] Social share images correct (test with Facebook Debugger)

### 5. Security Check

- [ ] Environment variables not in client code
- [ ] API keys not committed to Git
- [ ] `.env.local` in `.gitignore`
- [ ] Sensitive data not exposed
- [ ] HTTPS will be enabled (Vercel handles this)

---

## VERCEL DEPLOYMENT (RECOMMENDED)

### Step 1: Prepare Repository

```bash
# Initialize Git (if not already done)
git init

# Create .gitignore (Next.js template includes this)
# Ensure these are in .gitignore:
# node_modules/
# .next/
# .env*.local
# .vercel

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create GitHub repository (via GitHub website or CLI)
# Then push:
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

**Option A: Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (use GitHub account for easy integration)
3. Click "Add New Project"
4. Select your GitHub repository
5. Vercel auto-detects Next.js settings
6. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (first time)
# - What's your project's name? your-project-name
# - In which directory is your code? ./
# - Want to override settings? No
```

### Step 3: Configure Project Settings

In Vercel Dashboard → Project Settings:

**Build & Development Settings:**
- Framework Preset: Next.js (auto-detected)
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)
- Development Command: `npm run dev` (default)

**Root Directory:**
- If monorepo: Set to project folder
- If standard: Leave empty

**Node.js Version:**
- Select latest LTS (20.x or 22.x)

### Step 4: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

**For each environment variable:**
1. Add variable name (e.g., `OPENAI_API_KEY`)
2. Add value
3. Select environments:
   - Production ✓
   - Preview ✓
   - Development (optional - use local .env.local instead)
4. Click "Save"

**Common Environment Variables:**
```
NEXT_PUBLIC_SITE_URL=https://yoursite.com
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_ANALYTICS_ID=G-...
```

**Important:**
- Variables starting with `NEXT_PUBLIC_` are exposed to browser
- Other variables are server-side only
- Redeploy after adding variables

### Step 5: Deploy

**Automatic Deployment (Recommended):**
- Every push to `main` branch → deploys to Production
- Every PR → creates Preview deployment
- No manual action needed

**Manual Deployment:**
```bash
# Deploy to production
vercel --prod

# Or just
vercel
```

### Step 6: Verify Deployment

1. Vercel provides deployment URL (e.g., `your-project.vercel.app`)
2. Check deployment logs for errors
3. Test all pages
4. Run Lighthouse audit on live site
5. Check in mobile browsers

---

## ALTERNATIVE PLATFORMS

### Netlify

**Deployment Steps:**

1. Push code to GitHub/GitLab
2. Sign in to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect Git provider
5. Select repository
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Add environment variables (Site Settings → Build & deploy → Environment)
8. Deploy

**Next.js Plugin Required:**
```bash
npm install -D @netlify/plugin-nextjs
```

Add `netlify.toml`:
```toml
[[plugins]]
package = "@netlify/plugin-nextjs"
```

### Render

**Deployment Steps:**

1. Sign in to [render.com](https://render.com)
2. Click "New" → "Static Site" (for SSG) or "Web Service" (for SSR)
3. Connect Git repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

---

## CUSTOM DOMAIN SETUP

### Step 1: Purchase Domain

Popular registrars:
- Namecheap
- Google Domains
- GoDaddy
- Domain.com

Cost: ~$10-15/year for .com

### Step 2: Add Domain to Vercel

1. In Vercel Dashboard → Project → Settings → Domains
2. Enter your domain (e.g., `yoursite.com`)
3. Click "Add"
4. Vercel provides DNS instructions

### Step 3: Configure DNS

**Option A: Use Vercel Nameservers (Recommended - Easiest)**

In your domain registrar:
1. Find "Nameservers" or "DNS Settings"
2. Replace existing nameservers with Vercel's:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Save changes
4. Wait for propagation (can take 24-48 hours)
5. Vercel auto-configures SSL

**Option B: CNAME Method**

In your domain registrar's DNS settings:

For `www.yoursite.com`:
1. Add CNAME record:
   - Host/Name: `www`
   - Value: `cname.vercel-dns.com`

For root domain `yoursite.com`:
1. Add A record:
   - Host/Name: `@` or leave blank
   - Value: `76.76.21.21`

**Add both www and non-www for best coverage**

### Step 4: Verify SSL Certificate

- Vercel automatically provisions SSL (free via Let's Encrypt)
- Check that `https://yoursite.com` works
- No mixed content warnings

### Step 5: Configure WWW Redirect (Optional)

In Vercel → Domains → click domain → Redirect:
- Redirect `yoursite.com` to `www.yoursite.com` (or vice versa)
- This ensures one canonical version

---

## ENVIRONMENT VARIABLES

### Local Development (.env.local)

```bash
# .env.local (DO NOT COMMIT)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
```

### Production (Vercel)

**Set in Vercel Dashboard:**
1. Project → Settings → Environment Variables
2. Add each variable
3. Select environment (Production, Preview, Development)
4. Save and redeploy

### Accessing Environment Variables

**Client-side (browser):**
```typescript
// Must start with NEXT_PUBLIC_
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
```

**Server-side only:**
```typescript
// No NEXT_PUBLIC_ prefix
const apiKey = process.env.OPENAI_API_KEY
```

**Type safety:**
```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL: string
    OPENAI_API_KEY: string
    ANTHROPIC_API_KEY: string
  }
}
```

---

## POST-DEPLOYMENT TASKS

### Immediate (Day 1)

- [ ] Test all pages on live site
- [ ] Test forms (submit real data)
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Verify analytics tracking (if installed)
- [ ] Test social sharing (use Facebook Debugger)
- [ ] Check SSL certificate (https works)
- [ ] Test in multiple browsers

### Week 1

- [ ] Submit sitemap to Google Search Console
  - URL: `https://search.google.com/search-console`
  - Add property → Domain or URL prefix
  - Verify ownership (via DNS or HTML file)
  - Submit sitemap: `https://yoursite.com/sitemap.xml`

- [ ] Submit to Bing Webmaster Tools
  - URL: `https://www.bing.com/webmasters`
  - Import from Google Search Console (easier)
  - Or manually add site

- [ ] Set up monitoring
  - Vercel Analytics (included)
  - Google Analytics (if needed)
  - Uptime monitoring (UptimeRobot, free)

- [ ] Create backup
  - GitHub repo is backup
  - Export Vercel project settings (optional)

### Ongoing Maintenance

**Monthly:**
- [ ] Update dependencies: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Review analytics
- [ ] Check uptime/performance
- [ ] Update content (for freshness)

**Quarterly:**
- [ ] Major dependency updates (Next.js, React)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit
- [ ] Content refresh (update stats, dates)

---

## TROUBLESHOOTING

### Build Fails

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: TypeScript errors**
```bash
# Check types
npx tsc --noEmit

# Fix errors or temporarily bypass (not recommended)
# In next.config.js:
typescript: {
  ignoreBuildErrors: true, // Use only as last resort
}
```

**Error: Out of memory**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

In Vercel, set environment variable:
- Name: `NODE_OPTIONS`
- Value: `--max_old_space_size=4096`

### Deployment Successful but Site Broken

**Issue: Blank page or errors**

1. Check browser console for errors
2. Check Vercel deployment logs (Runtime logs)
3. Verify environment variables are set
4. Test locally with `npm run build && npm start`

**Issue: Images not loading**

1. Check image paths are correct (`/images/...` not `./images/...`)
2. Images must be in `public/` folder
3. Verify `next/image` is used correctly
4. Check network tab for 404s

**Issue: API routes not working**

1. API routes must be in `app/api/` folder (App Router)
2. Check function is exported correctly
3. Verify environment variables for API keys
4. Check Vercel function logs

### DNS Not Resolving

**Issue: Domain not pointing to Vercel**

1. DNS propagation can take up to 48 hours
2. Check DNS with `nslookup yoursite.com`
3. Verify nameservers/CNAME records are correct
4. Try incognito/private browsing (clears DNS cache)
5. Clear local DNS cache:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
   - Linux: `sudo systemd-resolve --flush-caches`

### SSL Certificate Issues

**Issue: "Not Secure" warning**

1. Wait 24 hours for certificate provisioning
2. Check domain is correctly added in Vercel
3. Verify DNS is pointing correctly
4. Remove and re-add domain in Vercel

### Performance Issues in Production

**Issue: Slow load times**

1. Run Lighthouse audit
2. Check image optimization (use next/image)
3. Verify code splitting is working
4. Check for large JavaScript bundles
5. Use Vercel Analytics to identify slow pages
6. Consider adding CDN caching headers

---

## VERCEL-SPECIFIC TIPS

### Preview Deployments

- Every pull request creates a unique preview URL
- Safe testing environment before merging to production
- Share preview URLs with clients for feedback

### Automatic Deployments

**Disable if needed:**
- Settings → Git → Ignored Build Step
- Add condition to skip builds:
  ```bash
  [[ "$VERCEL_ENV" == "production" ]] && exit 1 || exit 0
  ```

### Vercel CLI Commands

```bash
# View deployments
vercel list

# View logs
vercel logs https://your-deployment-url.vercel.app

# Remove deployment
vercel remove your-deployment-id

# Promote preview to production
vercel promote https://preview-url.vercel.app

# Check deployment status
vercel inspect https://deployment-url.vercel.app
```

### Environment Variables per Branch

- Production: `main` branch
- Preview: All other branches (feature, dev, etc.)
- Can set different values per environment

---

## DEPLOYMENT BEST PRACTICES

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes, commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create pull request
# Vercel auto-creates preview deployment
# Review preview URL
# Merge to main when ready
# Vercel auto-deploys to production
```

### Version Control

**Use semantic versioning in commits:**
```
feat: Add chatbot widget
fix: Resolve mobile nav issue
style: Update button colors
docs: Add README
perf: Optimize image loading
refactor: Simplify form validation
```

**Tag releases:**
```bash
git tag -a v1.0.0 -m "Initial launch"
git push origin v1.0.0
```

### Rollback Strategy

**If deployment breaks production:**

1. **Instant rollback in Vercel:**
   - Deployments → Find last working deployment
   - Click "..." → "Promote to Production"

2. **Git revert:**
   ```bash
   git revert HEAD
   git push origin main
   # Triggers new deployment
   ```

3. **Force previous commit:**
   ```bash
   git reset --hard <commit-hash>
   git push -f origin main
   # Use cautiously
   ```

---

## CHECKLIST: DEPLOYMENT DAY

**Morning:**
- [ ] Final code review
- [ ] Run full test suite locally
- [ ] Build succeeds locally
- [ ] All environment variables documented
- [ ] Backup current state (Git tag)

**Deployment:**
- [ ] Push to production branch
- [ ] Monitor Vercel deployment logs
- [ ] Wait for successful deployment
- [ ] Test live site immediately

**Post-Deployment:**
- [ ] Verify all pages load
- [ ] Test critical user flows
- [ ] Check analytics tracking
- [ ] Monitor error logs (first hour)
- [ ] Announce launch (if applicable)

**End of Day:**
- [ ] Review metrics (traffic, errors)
- [ ] Document any issues
- [ ] Plan hotfixes if needed

---

**Last Updated:** February 9, 2026
**Always test deployments during low-traffic hours when possible!**
