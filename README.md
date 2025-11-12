# 每日励志语录系统

> 基于AI的个性化每日励志语录生成系统，结合天气、日期、心情等多维度因素，提供独特的中国风暗黑美学体验。

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-purple.svg)](https://www.deepseek.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

---

## 📖 项目简介

每日励志语录系统是一个基于 Next.js 14 和 DeepSeek AI 的纯前端应用。用户无需注册登录，只需填写名称、心情等信息，即可生成个性化的励志语录。系统采用 Vercel Serverless Functions，部署简单，完全免费。

### ✨ 核心特性

- 🤖 **AI智能生成**：基于DeepSeek大模型，生成富有诗意和情感智慧的励志语录
- 🚀 **无需登录**：去除繁琐的注册流程，直接使用
- 🌤️ **天气集成**：结合和风天气API，根据实时天气调整语录风格
- 😊 **情绪识别**：支持8种情绪类型，匹配对应的表情和配色
- 🎨 **中国风美学**：暗黑主题配合水墨风格，画卷展开动画
- 📱 **响应式设计**：支持桌面、平板、移动端多种设备
- ⚡ **极速部署**：一键部署到 Vercel，完全免费

---

## 🏗️ 技术架构

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.x | React框架（App Router） |
| TypeScript | 5.x | 类型系统 |
| TailwindCSS | 3.x | CSS框架 |
| Framer Motion | 11.x | 动画库 |
| DeepSeek API | - | AI语录生成 |
| 和风天气API | - | 天气数据 |
| Vercel | - | 部署平台 |

### 架构特点

- **Serverless Functions**：使用 Vercel Edge Functions 处理 API 请求
- **无后端依赖**：不需要独立的后端服务器
- **零数据库**：不存储用户数据，保护隐私
- **全球CDN**：Vercel 自动提供全球加速

---

## 🚀 快速开始

### 部署到 Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/daily-advice)

1. 点击上方按钮，跳转到 Vercel
2. 连接 GitHub 账号并导入仓库
3. 配置环境变量：
   - `DEEPSEEK_API_KEY`：DeepSeek API 密钥（**必需**）
   - `QWEATHER_API_KEY`：和风天气 API 密钥（可选）
4. 点击 Deploy，等待部署完成

详细部署说明请查看 [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)

### 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/daily-advice.git
cd daily-advice

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

## 💡 核心功能

### 1. 智能语录生成

系统根据以下信息生成个性化语录：

**用户输入**
- 名称（必填）
- 所在城市
- 今日大事（可选）
- 目前心情（可选）

**自动获取**
- 当前日期、星期、时间
- 实时天气、气温

### 2. 情绪识别系统

支持8种情绪类型，每种情绪对应独特的表情图标和颜色：

| 情绪 | 表情 | 颜色 |
|------|------|------|
| 开心 | 😊 | 金色 |
| 平静 | 😌 | 青色 |
| 疲惫 | 😔 | 灰色 |
| 焦虑 | 😰 | 蓝色 |
| 愤怒 | 😤 | 红色 |
| 伤心 | 😢 | 紫色 |
| 期待 | 🤩 | 橙色 |
| 默认 | 🧘 | 白色 |

---

## 🎨 设计规范

### 视觉风格

- **主题**：中国风暗黑美学
- **色调**：深色背景（#0a0a0a ~ #1a1a1a）
- **点缀色**：
  - 金色 #d4af37
  - 青色 #00ced1
  - 红色 #dc143c

### 动画效果

- 画卷展开动画（1.5秒）
- 文字打字机效果
- 情绪表情3D旋转入场
- 悬浮发光效果

---

## 📊 项目进度

### ✅ 已完成

- [x] Next.js 14 项目搭建
- [x] Vercel Serverless Functions 集成
- [x] DeepSeek AI 集成
- [x] 和风天气服务集成
- [x] 语录生成逻辑
- [x] 情绪识别系统
- [x] 中国风 UI 实现
- [x] 画卷展开动画
- [x] 打字机效果
- [x] 响应式设计
- [x] Vercel 部署配置

### 🎯 特性

- ✨ 无需登录注册
- ✨ 零数据库设计
- ✨ 完全免费部署
- ✨ 全球 CDN 加速
- ✨ HTTPS 安全保障

---

## 📁 项目结构

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
│   │   │   │   └── QuoteDisplay.tsx
│   │   │   └── ui/           # 基础 UI 组件
│   │   ├── lib/              # 工具库
│   │   │   ├── constants/   # 常量定义
│   │   │   └── utils/       # 工具函数
│   │   ├── styles/          # 样式文件
│   │   │   └── globals.css
│   │   └── types/           # TypeScript 类型
│   ├── public/              # 静态资源
│   ├── package.json
│   └── next.config.js
├── backend/                 # 旧版后端（已废弃）
├── vercel.json             # Vercel 配置
├── .env.example           # 环境变量示例
├── VERCEL_DEPLOY.md       # 详细部署说明
└── README.md

```

---

## 🧪 本地测试

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 浏览器访问 http://localhost:3000
```

**测试步骤**：
1. 填写名称（必填）
2. 选择城市
3. 填写今日大事和心情（可选）
4. 点击"生成今日语录"按钮
5. 查看生成的语录和动画效果

---

## 🔐 环境变量配置

创建 `frontend/.env.local` 文件：

```bash
# DeepSeek API（必需）
DEEPSEEK_API_KEY=sk-xxx

# 和风天气 API（可选）
QWEATHER_API_KEY=your-key
```

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 代码规范

- Python代码遵循PEP 8规范
- TypeScript代码使用ESLint
- 提交信息遵循Conventional Commits

---

## 📝 更新日志

### [0.1.0] - 2025-11-03

#### 新增
- ✅ 后端Flask项目框架
- ✅ 用户认证系统
- ✅ DeepSeek AI集成
- ✅ 和风天气API集成
- ✅ 语录生成逻辑
- ✅ 数据库设计和迁移
- ✅ 完整API文档

#### 待修复
- ⚠️ JWT认证细节问题
- ⚠️ 错误处理完善

---

## 📄 许可证

本项目仅供学习和研究使用。

---

## 🙏 致谢

- [Flask](https://flask.palletsprojects.com/) - Python Web框架
- [Next.js](https://nextjs.org/) - React框架
- [DeepSeek](https://www.deepseek.com/) - AI大模型
- [和风天气](https://www.qweather.com/) - 天气数据API
- [TailwindCSS](https://tailwindcss.com/) - CSS框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库

---

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交Issue：[GitHub Issues](https://github.com/yourusername/daily-advice/issues)
- 项目文档：[docs/](docs/)

---

**Made with ❤️ by Claude Code**
