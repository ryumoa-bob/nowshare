#!/bin/bash

# NowShare 自動テストスクリプト
# Usage: ./test.sh

set -e

echo "========================================"
echo "🚀 NowShare 自動テスト開始"
echo "========================================"
echo ""

# 色付き出力
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# テスト結果
TESTS_PASSED=0
TESTS_FAILED=0

# 関数
pass() {
  echo -e "${GREEN}✅ PASS${NC}: $1"
  ((TESTS_PASSED++))
}

fail() {
  echo -e "${RED}❌ FAIL${NC}: $1"
  ((TESTS_FAILED++))
}

info() {
  echo -e "${YELLOW}ℹ️  INFO${NC}: $1"
}

# API URL
API_URL="http://localhost:3000/api"

# テスト開始
echo ""
info "バックエンドが起動しているか確認..."
if curl -s "$API_URL/health" > /dev/null; then
  pass "バックエンド起動確認"
else
  fail "バックエンドが起動していません"
  echo "バックエンドを起動してください: cd backend && npm start"
  exit 1
fi

echo ""
echo "========================================"
echo "📝 APIテスト開始"
echo "========================================"

# テスト1: ヘルスチェック
echo ""
info "テスト1: ヘルスチェック"
RESULT=$(curl -s "$API_URL/health")
if echo "$RESULT" | grep -q "ok"; then
  pass "ヘルスチェック"
else
  fail "ヘルスチェック"
fi

# テスト2: テストエンドポイント
echo ""
info "テスト2: テストエンドポイント"
RESULT=$(curl -s "$API_URL/test")
if echo "$RESULT" | grep -q "NowShare"; then
  pass "テストエンドポイント"
else
  fail "テストエンドポイント"
fi

# テスト3: リセット
echo ""
info "テスト3: データリセット"
RESULT=$(curl -s -X POST "$API_URL/test/reset")
if echo "$RESULT" | grep -q "reset"; then
  pass "データリセット"
else
  fail "データリセット"
fi

# テスト4: Seedデータ作成
echo ""
info "テスト4: Seedデータ作成"
RESULT=$(curl -s -X POST "$API_URL/test/seed")
if echo "$RESULT" | grep -q "Seed"; then
  pass "Seedデータ作成"
else
  fail "Seedデータ作成"
fi

# テスト5: 投稿一覧取得
echo ""
info "テスト5: 投稿一覧取得"
POST_COUNT=$(curl -s "$API_URL/posts" | grep -o '"_id"' | wc -l)
if [ "$POST_COUNT" -gt 0 ]; then
  pass "投稿一覧取得 ($POST_COUNT 件)"
else
  fail "投稿一覧取得"
fi

# テスト6: 新規投稿
echo ""
info "テスト6: 新規投稿作成"
RESULT=$(curl -s -X POST "$API_URL/posts" \
  -H "Content-Type: application/json" \
  -d '{"uid":"test-user","text":"APIテスト投稿","imageURL":""}')
if echo "$RESULT" | grep -q "Post created"; then
  pass "新規投稿作成"
else
  fail "新規投稿作成"
fi

# テスト7: リアクション追加
echo ""
info "テスト7: リアクション追加"
POST_ID=$(curl -s "$API_URL/posts" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$POST_ID" ]; then
  RESULT=$(curl -s -X POST "$API_URL/posts/$POST_ID/reaction" \
    -H "Content-Type: application/json" \
    -d '{"reactionType":"heart"}')
  if echo "$RESULT" | grep -q "Reaction added"; then
    pass "リアクション追加"
  else
    fail "リアクション追加"
  fi
else
  fail "リアクション追加（投稿が見つからない）"
fi

# テスト8: ユーザー作成
echo ""
info "テスト8: ユーザー作成"
RESULT=$(curl -s -X POST "$API_URL/users/upsert" \
  -H "Content-Type: application/json" \
  -d '{"uid":"test-user-123","displayName":"テストユーザー","email":"test@example.com"}')
if echo "$RESULT" | grep -q "User"; then
  pass "ユーザー作成"
else
  fail "ユーザー作成"
fi

# テスト9: ユーザー取得
echo ""
info "テスト9: ユーザー取得"
RESULT=$(curl -s "$API_URL/users/test-user-123")
if echo "$RESULT" | grep -q "テストユーザー"; then
  pass "ユーザー取得"
else
  fail "ユーザー取得"
fi

# テスト10: デバッグ情報
echo ""
info "テスト10: デバッグ情報取得"
RESULT=$(curl -s "$API_URL/test/debug")
if echo "$RESULT" | grep -q "users"; then
  pass "デバッグ情報取得"
else
  fail "デバッグ情報取得"
fi

# 結果サマリー
echo ""
echo "========================================"
echo "📊 テスト結果サマリー"
echo "========================================"
echo -e "${GREEN}✅ 合格: $TESTS_PASSED 件${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
  echo -e "${RED}❌ 失敗: $TESTS_FAILED 件${NC}"
else
  echo -e "${GREEN}❌ 失敗: $TESTS_FAILED 件${NC}"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 全テスト合格！${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}⚠️  一部テストが失敗しています${NC}"
  echo ""
  exit 1
fi
