#!/bin/bash

# NowShare - GitHubアップロード自動化

echo "========================================"
echo "🚀 NowShare GitHub Upload"
echo "========================================"

# GitHub Personal Access Tokenを入力
read -p "GitHub Personal Access Tokenを入力: " TOKEN

# リポジトリ情報
OWNER="ryumoa-bob"
REPO="nowshare"
EMAIL="your-email@example.com"
NAME="Your Name"

# Git設定
git config --global user.email "$EMAIL"
git config --global user.name "$NAME"

echo ""
echo "📝 Creating GitHub repository..."

# APIでリポジトリ作成（存在しなければ）
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{"name":"'$REPO'","description":"Be Real風 Webアプリ","private":false}')

if [ "$RESPONSE" = "201" ] || [ "$RESPONSE" = "422" ]; then
  echo "✅ Repository created or already exists"
else
  echo "❌ Failed to create repository: $RESPONSE"
  exit 1
fi

echo ""
echo "🔐 Setting up authentication..."

# トークンを使ってURLを変更
GIT_URL="https://$TOKEN@github.com/$OWNER/$REPO.git"
git remote set-url origin "$GIT_URL"

echo ""
echo "🚀 Pushing to GitHub..."

# メインブランチに変更
git branch -M main

# プッシュ
git push -u origin main

echo ""
echo "========================================"
echo "🎉 GitHub Upload Complete!"
echo "========================================"
echo ""
echo "📱 Next: Deploy to Vercel"
echo "   https://vercel.com"
echo ""
echo "🌐 Repository:"
echo "   https://github.com/$OWNER/$REPO"
