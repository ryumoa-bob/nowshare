# NowShare GitHub Upload Guide

## Option 1: Automated Script

```bash
./github-upload.sh
```

## Option 2: Manual Upload

### 1. Create GitHub Repository

1. Go to: https://github.com/new
2. Fill in:
   - Repository name: `nowshare`
   - Description: `Be Real風 Webアプリ`
   - Public or Private: Your choice
   - ✅ DO NOT add README
   - ✅ DO NOT add .gitignore
   - ✅ DO NOT add license
3. Click "Create repository"

### 2. Push to GitHub

Run these commands:

```bash
cd /home/ec2-user/.openclaw/workspace/nowshare
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nowshare.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Deploy"

## That's It! 🎉

Your app will be live in 2-3 minutes!

## Need Help?

See DEPLOY.md for full deployment instructions.
