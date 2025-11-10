# Render 免费部署指南（完全免费）

## 为什么选择 Render？

✅ **完全免费**
✅ 配置简单，5分钟完成
✅ 自动 HTTPS
✅ 免费 PostgreSQL
⚠️ 唯一缺点：15分钟无活动会休眠，首次访问需30秒唤醒

---

## 部署步骤

### 第一步：注册 Render

1. 访问 https://render.com
2. 点击 "Get Started" 或 "Sign Up"
3. 使用 GitHub 账号登录（推荐）

---

### 第二步：部署 Flask 后端

#### 1. 创建 Web Service

1. 在 Render 控制台，点击 **"New +"** → **"Web Service"**
2. 选择 **"Build and deploy from a Git repository"**
3. 点击 **"Connect"** 连接你的 GitHub 账号
4. 找到并选择 `JxcChen/daily-advice` 仓库

#### 2. 配置 Web Service

填写以下信息：

```
Name: daily-advice-backend
Region: Singapore (或 Oregon - US West)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn run:app
```

**实例类型**: 选择 **Free** 🆓

#### 3. 添加环境变量

点击 **"Advanced"** → **"Add Environment Variable"**，添加以下变量：

```bash
# Flask 配置
FLASK_ENV=production

# 密钥（运行下面命令生成）
# python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=<粘贴生成的32位随机密钥>
JWT_SECRET_KEY=<粘贴另一个32位随机密钥>

# API 密钥
DEEPSEEK_API_KEY=sk-b7f4afd268664e4582e33a60305fff34
QWEATHER_API_KEY=your-qweather-key

# CORS（填入你的 Vercel 域名）
CORS_ORIGINS=https://daily-advice-pink.vercel.app

# 数据库（稍后从 Render PostgreSQL 复制）
DATABASE_URL=<稍后填写>
```

**暂时不要点击 "Create Web Service"**，先创建数据库。

---

### 第三步：创建 PostgreSQL 数据库

#### 1. 创建数据库

1. 回到 Render 首页
2. 点击 **"New +"** → **"PostgreSQL"**
3. 配置：
   ```
   Name: daily-advice-db
   Database: dailyadvice
   User: dailyadvice_user
   Region: 与 Web Service 相同区域
   ```
4. **PostgreSQL Version**: 选择最新版本
5. **Instance Type**: 选择 **Free** 🆓

#### 2. 获取数据库连接字符串

1. 数据库创建后，找到 **"Connections"** 部分
2. 复制 **"Internal Database URL"**（格式：`postgresql://...`）

#### 3. 更新 Web Service 环境变量

1. 返回到你创建的 Web Service
2. 找到 `DATABASE_URL` 环境变量
3. 粘贴刚才复制的数据库 URL

---

### 第四步：部署

1. 确认所有配置正确
2. 点击 **"Create Web Service"**
3. Render 开始自动构建和部署（约 2-5 分钟）

#### 监控部署进度

- 查看 **"Logs"** 标签页实时日志
- 等待看到类似信息：
  ```
  ==> Your service is live 🎉
  ```

---

### 第五步：运行数据库迁移

部署成功后，需要初始化数据库表：

1. 在 Web Service 页面，点击 **"Shell"** 标签
2. 运行以下命令：
   ```bash
   flask db upgrade
   ```
3. 如果成功，会看到数据库表创建成功的消息

---

### 第六步：获取后端 URL

1. 在 Web Service 页面顶部，复制你的服务 URL
2. 格式类似：`https://daily-advice-backend.onrender.com`

---

### 第七步：更新 Vercel 前端配置

#### 1. 添加环境变量

1. 访问 Vercel 项目：https://vercel.com/dashboard
2. 选择你的 `daily-advice` 项目
3. 进入 **"Settings"** → **"Environment Variables"**
4. 添加或更新：
   ```
   NEXT_PUBLIC_API_BASE_URL=https://daily-advice-backend.onrender.com/api/v1
   ```
5. 选择应用到 **"Production"**, **"Preview"**, **"Development"** 全部环境

#### 2. 重新部署前端

1. 进入 **"Deployments"** 标签
2. 点击最新部署右侧的 **"..."** 菜单
3. 选择 **"Redeploy"**
4. 等待部署完成（约 1-2 分钟）

---

### 第八步：更新后端 CORS

确保后端的 CORS 配置包含你的 Vercel 域名：

1. 回到 Render Web Service
2. 进入 **"Environment"** 标签
3. 确认 `CORS_ORIGINS` 包含你的 Vercel URL：
   ```
   CORS_ORIGINS=https://daily-advice-pink.vercel.app
   ```
4. 如果修改了，点击 **"Save Changes"**，Render 会自动重新部署

---

## 测试部署

### 1. 测试后端 API

在浏览器或命令行访问：

```bash
# 健康检查（如果你有这个端点）
curl https://daily-advice-backend.onrender.com/api/v1/health

# 应该返回 200 OK
```

### 2. 测试前端

1. 访问你的 Vercel URL：`https://daily-advice-pink.vercel.app`
2. 尝试注册/登录功能
3. 应该不再出现 CORS 或网络错误

---

## 常见问题

### Q1: 首次访问很慢？

**原因**: Render 免费套餐会在 15 分钟无活动后休眠服务
**解决**:
- 首次访问需要等待 30 秒左右唤醒
- 可以使用 UptimeRobot 等服务定期 ping 你的后端保持活跃（每 5 分钟）

### Q2: 如何生成随机密钥？

```bash
# 在本地运行
python -c "import secrets; print(secrets.token_hex(32))"

# 或在线生成
# https://www.random.org/strings/
```

### Q3: 数据库迁移失败？

在 Render Shell 中运行：

```bash
# 检查数据库连接
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); print(db.engine.url)"

# 初始化迁移（如果需要）
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### Q4: 应用报错 500？

1. 查看 Render **Logs** 标签页
2. 检查环境变量是否都配置正确
3. 确认数据库 URL 正确
4. 确认迁移已运行

### Q5: 免费数据库 90 天后会怎样？

- Render 会发邮件提醒
- 数据会被删除
- 你可以导出数据后创建新的免费数据库

### Q6: 如何保持服务不休眠？

使用 **UptimeRobot** (免费):

1. 访问 https://uptimerobot.com
2. 添加监控：`https://daily-advice-backend.onrender.com/api/v1/health`
3. 间隔设置为 5 分钟
4. Render 服务就会一直保持活跃

---

## 部署后的优化

### 1. 自定义域名（可选）

Render 支持自定义域名：
1. 在 Web Service 设置中添加域名
2. 配置 DNS CNAME 记录指向 Render

### 2. 监控和日志

- Render 提供实时日志查看
- 可以集成 Sentry 进行错误追踪

### 3. 环境管理

建议创建两个环境：
- **Production**: 生产环境（当前配置）
- **Staging**: 测试环境（可选）

---

## 成本对比

| 平台 | 后端 | 数据库 | 冷启动 | 限制 |
|------|------|--------|--------|------|
| **Render (免费)** | ✅ 免费 | ✅ 免费 | ⚠️ 是 (30秒) | 90天数据 |
| **Railway** | 💰 $5/月 | ✅ 包含 | ❌ 否 | 无限制 |
| **Vercel (前端)** | ✅ 免费 | N/A | ❌ 否 | 商业限制 |

---

## 总结

✅ **完成后你会有**:
- 前端部署在 Vercel (免费)
- 后端部署在 Render (免费)
- PostgreSQL 数据库 (免费)
- 完整可用的全栈应用

⏱️ **总耗时**: 约 10-15 分钟

🎉 **完全免费，无需信用卡！**

---

## 需要帮助？

如果遇到问题：
1. 检查 Render Logs 日志
2. 确认所有环境变量配置正确
3. 查看 `QUICK_FIX.md` 中的故障排查部分
