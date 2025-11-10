#!/bin/bash

# 每日励志语录系统 - 一键启动脚本
# 使用方法: chmod +x start.sh && ./start.sh

echo "=========================================="
echo "🚀 每日励志语录系统 启动中..."
echo "=========================================="
echo ""

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 启动后端
echo -e "${BLUE}[1/2] 启动后端服务器...${NC}"
cd "$PROJECT_ROOT/backend"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  虚拟环境不存在，正在创建...${NC}"
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 检查依赖
if [ ! -f "venv/lib/python3.10/site-packages/flask/__init__.py" ]; then
    echo -e "${YELLOW}⚠️  正在安装依赖...${NC}"
    pip install -r requirements.txt
fi

# 启动后端
echo -e "${GREEN}✓ 后端服务器启动中...${NC}"
nohup python run.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
sleep 3

# 检查后端是否启动成功
if lsof -i :5001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 后端服务器启动成功 (PID: $BACKEND_PID)${NC}"
    echo -e "   访问地址: ${BLUE}http://localhost:5001${NC}"
else
    echo -e "${YELLOW}⚠️  后端服务器可能未正常启动，请检查日志${NC}"
fi

echo ""

# 2. 启动前端
echo -e "${BLUE}[2/2] 启动前端服务器...${NC}"
cd "$PROJECT_ROOT/frontend"

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  正在安装依赖...${NC}"
    npm install
fi

# 启动前端
echo -e "${GREEN}✓ 前端服务器启动中...${NC}"
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
sleep 5

# 检查前端是否启动成功
if lsof -i :3000 > /dev/null 2>&1 || lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 前端服务器启动成功 (PID: $FRONTEND_PID)${NC}"

    # 检测实际端口
    if lsof -i :3000 > /dev/null 2>&1; then
        FRONTEND_PORT=3000
    else
        FRONTEND_PORT=3001
    fi
    echo -e "   访问地址: ${BLUE}http://localhost:$FRONTEND_PORT${NC}"
else
    echo -e "${YELLOW}⚠️  前端服务器可能未正常启动，请检查日志${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 系统启动完成！${NC}"
echo "=========================================="
echo ""
echo "📝 快速访问："
echo -e "   前端: ${BLUE}http://localhost:3001${NC}"
echo -e "   后端: ${BLUE}http://localhost:5001${NC}"
echo ""
echo "📂 日志文件："
echo "   后端日志: logs/backend.log"
echo "   前端日志: logs/frontend.log"
echo ""
echo "🛑 停止服务："
echo "   执行: ./stop.sh"
echo ""
echo "💡 测试账号："
echo "   手机号: 13800138000"
echo "   密码: Test1234"
echo ""
echo "=========================================="
