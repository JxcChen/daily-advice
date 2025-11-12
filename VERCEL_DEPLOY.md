# 每日励志语录系统 - Vercel 部署指南

## 🚀 快速部署到 Vercel

### ⚠️ 重要：正确的部署配置

**必须设置 Root Directory 为 `frontend`！**

### 方式一：通过 Vercel Dashboard（推荐）

#### 步骤 1：推送代码到 GitHub ✅
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 步骤 2：导入项目到 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"Add New Project"**
3. 从 GitHub 导入你的仓库

#### 步骤 3：配置项目 ⭐ 关键步骤
在 **"Configure Project"** 页面中：

1. **Framework Preset**: Next.js（自动检测）

2. **Root Directory**:
   - 点击 **"Edit"** 按钮
   - 输入 `frontend`
   - ⚠️ **这是最重要的配置！**

3. **Build and Output Settings**（自动配置，无需修改）:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### 步骤 4：配置环境变量
点击 **"Environment Variables"** 展开，添加：

| Name | Value | Environment |
|------|-------|-------------|
| `DEEPSEEK_API_KEY` | `sk-b7f4afd268664e4582e33a60305fff34` | Production, Preview, Development |
| `QWEATHER_API_KEY` | (可选留空) | Production, Preview, Development |

#### 步骤 5：部署
1. 点击 **"Deploy"** 按钮
2. 等待构建完成（约 2-3 分钟）
3. 点击 **"Visit"** 访问你的网站

---

## 📸 Vercel 配置截图说明

### 配置界面应该显示：
```
Framework Preset: Next.js
Root Directory: frontend ✓
Build Command: npm run build
Output Directory: .next
Install Command: npm install

Environment Variables:
✓ DEEPSEEK_API_KEY (Production, Preview, Development)
✓ QWEATHER_API_KEY (Production, Preview, Development)
```

---

### 方式二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 进入前端目录（重要！）
cd frontend

# 首次部署（会提示配置）
vercel

# 按提示回答：
# Set up and deploy? Yes
# Which scope? (选择你的账号)
# Link to existing project? No
# What's your project's name? daily-advice
# In which directory is your code located? ./

# 添加环境变量
vercel env add DEEPSEEK_API_KEY
# 输入: sk-b7f4afd268664e4582e33a60305fff34
# 选择: Production, Preview, Development (全选)

vercel env add QWEATHER_API_KEY
# (可选，回车跳过)

# 生产环境部署
vercel --prod
```

---

## 🔑 获取 API 密钥

### DeepSeek API（必需）
1. 访问 [DeepSeek 官网](https://www.deepseek.com/)
2. 注册账号并登录
3. 进入 API 管理页面
4. 创建 API Key
5. 复制密钥（格式：`sk-xxx`）

### 和风天气 API（可选）
1. 访问 [和风天气开发平台](https://dev.qweather.com/)
2. 注册开发者账号
3. 创建应用（选择"免费订阅"）
4. 获取 API Key

> **注意**：如果不配置和风天气 API，系统将使用默认天气信息（晴，20°C）

---

## 📦 本地开发

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 创建环境变量文件
cp ../.env.example .env.local

# 编辑 .env.local，填入 API 密钥
# DEEPSEEK_API_KEY=sk-xxx
# QWEATHER_API_KEY=your-key

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

---

## ✨ 功能说明

### 无需登录注册
- 移除了原有的用户认证系统
- 直接在主页填写信息即可使用

### 输入字段
1. **名称**（必填）- 将出现在生成的语录中
2. **所在城市** - 用于获取天气信息
3. **今日大事**（可选）- AI 会参考此信息
4. **目前心情**（可选）- 用于情绪识别和匹配

### AI 语录生成
- 基于 DeepSeek AI 大模型
- 结合天气、时间、心情等多维度信息
- 生成 30-60 字的励志语录
- 支持 8 种情绪识别（开心、平静、疲惫、焦虑、愤怒、伤心、期待、默认）

---

## 🎨 UI 特性

- **中国风暗黑美学**
- **画卷展开动画**（Framer Motion）
- **打字机效果**
- **情绪表情 3D 旋转**
- **响应式设计**（支持移动端）

---

## 📊 项目结构

```
daily-advice/
├── frontend/                   # Next.js 前端项目
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/           # Vercel Serverless Functions
│   │   │   │   └── generate/
│   │   │   │       └── route.ts  # 语录生成 API
│   │   │   ├── page.tsx       # 主页面
│   │   │   └── layout.tsx     # 根布局
│   │   ├── components/        # React 组件
│   │   │   ├── quote/        # 语录相关组件
│   │   │   └── ui/           # 基础 UI 组件
│   │   ├── lib/              # 工具库
│   │   ├── styles/           # 样式文件
│   │   └── types/            # TypeScript 类型
│   ├── public/               # 静态资源
│   ├── package.json
│   └── next.config.js
├── vercel.json               # Vercel 配置
├── .env.example             # 环境变量示例
└── README.md
```

---

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **动画**: Framer Motion
- **AI**: DeepSeek API
- **天气**: 和风天气 API
- **部署**: Vercel

---

## 🐛 故障排查

### 部署失败
1. 检查 Root Directory 是否设置为 `frontend`
2. 确认 Node.js 版本 >= 18
3. 查看 Vercel 构建日志

### API 调用失败
1. 确认 `DEEPSEEK_API_KEY` 环境变量已正确设置
2. 检查 API 密钥是否有效
3. 查看 Vercel Function 日志（项目设置 → Functions）

### 天气信息显示默认值
1. 检查 `QWEATHER_API_KEY` 是否配置
2. 确认和风天气 API 额度是否用尽
3. 系统会自动降级到默认天气（晴，20°C）

---

## 📝 更新日志

### v2.0.0 - 2024-11-12
- ✨ 移除后端依赖，改用 Vercel Serverless Functions
- ✨ 去掉登录注册功能
- ✨ 新增名称必填输入框
- ✨ 简化部署流程，支持一键部署到 Vercel
- 🎨 优化 UI 交互体验
- 📚 更新文档和部署指南

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Vercel](https://vercel.com/) - 部署平台
- [DeepSeek](https://www.deepseek.com/) - AI 大模型
- [和风天气](https://www.qweather.com/) - 天气数据 API
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库

---

## 📄 许可证

本项目仅供学习和研究使用。

---

**Made with ❤️ using Claude Code**
