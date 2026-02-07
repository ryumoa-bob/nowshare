#!/bin/bash

# NowShare - GitHubアップロードスクリプト
# Usage: ./github-upload.sh

echo "========================================"
echo "🚀 NowShare GitHubアップロード"
echo "========================================"

# GitHubユーザー名を聞く
read -p "GitHubユーザー名を入力: " GITHUB_USER

# リポジトリ名
REPO_NAME="nowshare"

echo ""
echo "📝 1. GitHubでリポジトリを作成してください:"
echo "   https://github.com/new"
echo ""
echo "   設定:"
echo "   - Repository name: $REPO_NAME"
echo "   - Description: Be Real風 Webアプリ"
echo "   - Public / Private: どちらでもOK"
echo "   - README: 追加しない"
echo "   - .gitignore: なし"
echo "   - License: なし"
echo ""
read -p "リポジトリを作成したらEnterを押してください: "

echo ""
echo "📦 2. リモートリポジトリを設定中..."
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git 2>/dev/null || echo "すでにリモートが設定されています"

echo ""
echo "🚀 3. アップロード中..."
git branch -M main
git push -u origin main

echo ""
echo "========================================"
echo "🎉 アップロード完了！"
echo "========================================"
echo ""
echo "📱 次のステップ:"
echo "1. Vercelにアクセス: https://vercel.com"
echo "2. 「New Project」をクリック"
echo "3. GitHubリポジトリを選択"
echo "4. 「Deploy」をクリック"
echo ""
echo "🌐 詳細手順は DEPLOY.md を参照"
