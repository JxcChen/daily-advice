#!/bin/bash

# 每日励志语录系统 - 停止脚本
# 使用方法: chmod +x stop.sh && ./stop.sh

echo "=========================================="
echo "🛑 停止每日励志语录系统..."
echo "=========================================="
echo ""

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 停止后端
if [ -f "$PROJECT_ROOT/logs/backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_ROOT/logs/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ 后端服务器已停止 (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${RED}✗ 后端服务器未运行${NC}"
    fi
    rm "$PROJECT_ROOT/logs/backend.pid"
else
    # 尝试通过端口查找并停止
    BACKEND_PID=$(lsof -ti :5001)
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ 后端服务器已停止 (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${RED}✗ 后端服务器未运行${NC}"
    fi
fi

# 停止前端
if [ -f "$PROJECT_ROOT/logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_ROOT/logs/frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ 前端服务器已停止 (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${RED}✗ 前端服务器未运行${NC}"
    fi
    rm "$PROJECT_ROOT/logs/frontend.pid"
else
    # 尝试通过端口查找并停止
    FRONTEND_PID=$(lsof -ti :3000,3001)
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ 前端服务器已停止 (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${RED}✗ 前端服务器未运行${NC}"
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ 所有服务已停止${NC}"
echo "=========================================="
