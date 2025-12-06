#!/bin/bash

# 2048.city 快速部署到 Vercel

echo "🚀 开始部署 2048.city 到 Vercel"

# 检查是否已经初始化 git
if [ ! -d .git ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit - Free 2048 game"
    echo "✅ Git 仓库已初始化"
else
    echo "✅ Git 仓库已存在"
fi

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm i -g vercel
fi

echo ""
echo "📋 部署前检查清单："
echo "1. ✅ 已更新 Prisma schema 为 PostgreSQL"
echo "2. ⚠️  需要在 Vercel 创建 Postgres 数据库"
echo "3. ⚠️  需要配置环境变量（见 .env.example）"
echo "4. ⚠️  需要更新 Google OAuth 回调 URL"
echo ""

read -p "是否继续部署？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消部署"
    exit 1
fi

echo ""
echo "🔄 开始部署到 Vercel..."
vercel

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 接下来的步骤："
echo "1. 在 Vercel 控制台创建 Postgres 数据库"
echo "2. 配置所有环境变量（参考 .env.example）"
echo "3. 在 Google Cloud Console 添加回调 URL"
echo "4. 运行数据库迁移: npx prisma db push"
echo "5. 配置自定义域名 2048.city"
echo ""
echo "📖 详细说明请查看 DEPLOYMENT.md"
