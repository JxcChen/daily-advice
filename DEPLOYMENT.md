# Vercel 部署说明

## 部署架构

本项目采用前后端分离架构:

- **前端**: Next.js 应用部署在 Vercel
- **后端**: Flask API 需要独立部署(推荐 Railway, Render, 或 PythonAnywhere)

## Vercel 前端部署步骤

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:JxcChen/daily-advice.git
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库 `JxcChen/daily-advice`

### 3. 配置构建设置

Vercel 会自动检测到 Next.js 项目,配置如下:

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. 配置环境变量

在 Vercel 项目设置中添加以下环境变量:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### 5. 部署

点击 "Deploy" 按钮,Vercel 会自动构建和部署前端应用。

## 后端部署选项

### 选项 1: Railway (推荐)

1. 访问 https://railway.app
2. 创建新项目,选择 "Deploy from GitHub repo"
3. 选择 `backend` 目录
4. Railway 会自动检测 Flask 应用
5. 添加环境变量:
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   DATABASE_URL=postgresql://...
   DEEPSEEK_API_KEY=sk-b7f4afd268664e4582e33a60305fff34
   QWEATHER_API_KEY=your-qweather-api-key
   ```
6. 添加 PostgreSQL 数据库服务
7. 部署完成后,获取后端 API URL

### 选项 2: Render

1. 访问 https://render.com
2. 创建新的 Web Service
3. 连接 GitHub 仓库
4. 配置:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`
5. 添加环境变量(同上)
6. 创建 PostgreSQL 数据库
7. 部署

### 选项 3: PythonAnywhere

1. 访问 https://www.pythonanywhere.com
2. 上传代码到 `/home/username/daily-advice/backend`
3. 创建虚拟环境并安装依赖
4. 配置 WSGI 文件
5. 设置环境变量
6. 启动 Web 应用

## 更新 Vercel 环境变量

部署后端后,需要更新 Vercel 的环境变量:

1. 进入 Vercel 项目设置
2. 找到 "Environment Variables"
3. 更新 `NEXT_PUBLIC_API_URL` 为后端 API 地址
4. 重新部署前端

## 数据库迁移

后端首次部署后,需要运行数据库迁移:

```bash
# 如果使用 Railway CLI
railway run flask db upgrade

# 如果使用 Render
# 在 Render Shell 中运行
flask db upgrade

# 如果使用 PythonAnywhere
# 在 Bash Console 中运行
cd daily-advice/backend
source venv/bin/activate
flask db upgrade
```

## 本地开发

### 前端

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:3000
```

### 后端

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env 文件
flask db upgrade
python run.py
# 访问 http://localhost:5001
```

## 环境变量说明

### 前端环境变量

- `NEXT_PUBLIC_API_URL`: 后端 API 地址

### 后端环境变量

- `FLASK_ENV`: 运行环境 (development/production)
- `SECRET_KEY`: Flask 密钥
- `JWT_SECRET_KEY`: JWT 认证密钥
- `DATABASE_URL`: 数据库连接字符串
- `DEEPSEEK_API_KEY`: DeepSeek AI API 密钥
- `QWEATHER_API_KEY`: 和风天气 API 密钥
- `REDIS_URL`: Redis 连接字符串(可选)

## 故障排查

### 前端部署失败

1. 检查 Node.js 版本是否 >= 18
2. 检查 `frontend/package.json` 依赖是否正确
3. 查看 Vercel 构建日志

### 后端部署失败

1. 检查 Python 版本是否 >= 3.10
2. 检查 `backend/requirements.txt` 依赖
3. 确认环境变量已正确设置
4. 检查数据库连接

### API 连接失败

1. 确认后端已成功部署并运行
2. 检查 CORS 配置
3. 验证 `NEXT_PUBLIC_API_URL` 环境变量
4. 检查后端 API 端点是否可访问

## 域名配置

### Vercel 域名

Vercel 会自动分配一个域名,格式为 `your-project.vercel.app`。

你也可以添加自定义域名:

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加自定义域名
3. 按照提示配置 DNS 记录

### 后端域名

- Railway: 自动分配 `xxx.railway.app`
- Render: 自动分配 `xxx.onrender.com`
- PythonAnywhere: `username.pythonanywhere.com`

## 成本估算

- **Vercel**: 免费版足够个人使用
- **Railway**: $5/月起(包含数据库)
- **Render**: 免费版可用(会自动休眠)
- **PythonAnywhere**: 免费版可用(有限制)

## 监控和日志

- **Vercel**: 提供实时日志和分析
- **Railway**: 提供日志查看和指标监控
- **Render**: 提供日志和性能监控

## 支持

如有问题,请查看:

- [Vercel 文档](https://vercel.com/docs)
- [Railway 文档](https://docs.railway.app)
- [Render 文档](https://render.com/docs)
