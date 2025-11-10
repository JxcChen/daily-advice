# 快速修复 CORS 错误

## 问题原因

前端已部署到 Vercel，但后端还未部署，导致：
- 前端无法连接到后端 API
- 出现 CORS (跨域) 错误

## 快速解决方案

### 选项 1: 部署后端到 Railway (推荐，5分钟完成) ⚡

#### 步骤 1: 注册并登录 Railway
1. 访问 https://railway.app
2. 使用 GitHub 账号登录

#### 步骤 2: 创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择 `JxcChen/daily-advice` 仓库
4. Railway 会自动检测到 Flask 应用

#### 步骤 3: 配置根目录
1. 在项目设置中，设置 **Root Directory** 为 `backend`

#### 步骤 4: 添加环境变量
在 Railway 项目的 "Variables" 标签页添加：

```
FLASK_ENV=production
SECRET_KEY=your-random-secret-key-here
JWT_SECRET_KEY=your-random-jwt-secret-key-here
DATABASE_URL=postgresql://... (Railway 自动提供)
DEEPSEEK_API_KEY=sk-b7f4afd268664e4582e33a60305fff34
QWEATHER_API_KEY=your-qweather-key
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

**重要**: 将 `CORS_ORIGINS` 中的 `your-vercel-app` 替换为你的实际 Vercel 域名！

#### 步骤 5: 添加 PostgreSQL 数据库
1. 在 Railway 项目中点击 "New"
2. 选择 "Database" -> "PostgreSQL"
3. Railway 会自动将数据库 URL 注入到 `DATABASE_URL` 环境变量

#### 步骤 6: 部署
1. 点击 "Deploy"
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后，获取后端 API URL（格式：`https://xxx.railway.app`）

#### 步骤 7: 更新 Vercel 环境变量
1. 进入 Vercel 项目设置
2. 找到 "Environment Variables"
3. 添加或更新：
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-railway-app.railway.app/api/v1
   ```
4. 重新部署前端

---

### 选项 2: 使用 Render (免费，但有冷启动延迟)

#### 步骤 1: 注册 Render
访问 https://render.com

#### 步骤 2: 创建 Web Service
1. 点击 "New +" -> "Web Service"
2. 连接 GitHub 仓库
3. 配置：
   - **Name**: daily-advice-backend
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`

#### 步骤 3: 环境变量
添加与 Railway 相同的环境变量

#### 步骤 4: 创建数据库
1. 创建 PostgreSQL 数据库
2. 复制数据库 URL 到 `DATABASE_URL`

---

### 选项 3: 临时方案 - 使用本地后端 (仅用于测试)

如果你只是想快速测试，可以：

1. **启动本地后端**：
   ```bash
   cd backend
   source venv/bin/activate
   python run.py
   ```

2. **使用 ngrok 暴露本地服务**：
   ```bash
   # 安装 ngrok (如果未安装)
   brew install ngrok  # macOS

   # 暴露本地 5001 端口
   ngrok http 5001
   ```

3. **更新 Vercel 环境变量**：
   - 复制 ngrok 提供的 URL (如 `https://abc123.ngrok.io`)
   - 在 Vercel 设置中更新 `NEXT_PUBLIC_API_BASE_URL=https://abc123.ngrok.io/api/v1`

4. **更新后端 CORS**：
   在 `backend/.env` 中添加：
   ```
   CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
   ```

⚠️ **注意**: ngrok 免费版每次重启 URL 会变化，仅适合临时测试！

---

## 部署完成后的验证

### 1. 测试后端 API
```bash
curl https://your-backend-url.railway.app/api/v1/health
```

应该返回：
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "status": "healthy"
  }
}
```

### 2. 运行数据库迁移
如果使用 Railway:
```bash
# 在 Railway 项目中打开 Shell
flask db upgrade
```

### 3. 测试前端连接
访问你的 Vercel 应用，尝试注册/登录功能，应该不再出现 CORS 错误。

---

## 常见问题

### Q: Railway 如何生成随机密钥？
```bash
# 在本地生成随机密钥
python -c "import secrets; print(secrets.token_hex(32))"
```

### Q: 如何找到 Vercel 域名？
在 Vercel 项目页面顶部可以看到，格式为 `your-project-xxx.vercel.app`

### Q: 后端部署失败怎么办？
查看 Railway/Render 的日志，常见问题：
- 缺少环境变量
- 数据库连接失败
- 依赖安装失败

### Q: 前端还是显示 CORS 错误？
1. 确认 `CORS_ORIGINS` 包含你的 Vercel 域名
2. 确认 Vercel 环境变量已更新
3. 重新部署前端
4. 清除浏览器缓存

---

## 推荐配置（生产环境）

### Railway 后端环境变量：
```env
FLASK_ENV=production
SECRET_KEY=<随机生成的32位密钥>
JWT_SECRET_KEY=<随机生成的32位密钥>
DATABASE_URL=<Railway自动提供>
DEEPSEEK_API_KEY=sk-b7f4afd268664e4582e33a60305fff34
QWEATHER_API_KEY=<你的和风天气key>
CORS_ORIGINS=https://daily-advice.vercel.app
```

### Vercel 前端环境变量：
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api/v1
NEXT_PUBLIC_APP_NAME=每日励志语录
```

---

**完成这些步骤后，你的应用就可以正常工作了！** 🎉
