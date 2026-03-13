#!/bin/bash

# AI 闹钟应用启动脚本

echo "🚀 启动 AI 闹钟应用..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到 npm"
    exit 1
fi

# 安装前端依赖
echo "📦 安装前端依赖..."
cd "$(dirname "$0")"
npm install

# 安装后端依赖
echo "📦 安装后端依赖..."
cd backend
npm install

# 复制环境配置
if [ ! -f .env ]; then
    echo "📝 创建环境配置..."
    cp .env.example .env
    echo "⚠️  请编辑 backend/.env 配置你的 API Key"
fi

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend
npm start &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端应用
echo "📱 启动前端应用..."
cd ..
npm start

# 清理
kill $BACKEND_PID 2>/dev/null

echo "👋 应用已停止"
