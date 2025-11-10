# 每日励志语录系统

> 基于AI的个性化每日励志语录生成系统，结合用户信息、日期、天气等多维度因素，提供独特的中国风暗黑美学体验。

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-purple.svg)](https://www.deepseek.com/)

---

## 📖 项目简介

每日励志语录系统是一个结合了人工智能技术的个性化内容生成平台。系统通过分析用户的个人信息（姓名、年龄、性别、生日）、实时环境（天气、日期、时间）以及用户当前状态（心情、今日大事），使用DeepSeek AI生成贴合用户情境的励志语录。

### ✨ 核心特性

- 🤖 **AI智能生成**：基于DeepSeek大模型，生成富有诗意和情感智慧的励志语录
- 🎂 **生日识别**：自动识别用户生日并生成特殊祝福语录
- 🌤️ **天气集成**：结合和风天气API，根据实时天气调整语录风格
- 😊 **情绪识别**：支持8种情绪类型，匹配对应的表情和配色
- 🎨 **中国风美学**：暗黑主题配合水墨风格，画卷展开动画
- 📱 **响应式设计**：支持桌面、平板、移动端多种设备

---

## 🏗️ 技术架构

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.10+ | 编程语言 |
| Flask | 3.0.0 | Web框架 |
| SQLAlchemy | 2.0+ | ORM框架 |
| Flask-JWT-Extended | 4.6.0 | JWT认证 |
| bcrypt | 4.1.2 | 密码加密 |
| DeepSeek API | - | AI语录生成 |
| 和风天气API | - | 天气数据 |

### 前端技术栈（计划）

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.x | React框架 |
| TypeScript | 5.x | 类型系统 |
| TailwindCSS | 3.x | CSS框架 |
| Framer Motion | 11.x | 动画库 |
| Zustand | 4.x | 状态管理 |

---

## 🚀 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+（前端）
- SQLite（开发）/ PostgreSQL（生产）

### 后端安装

```bash
# 克隆项目
cd /Users/chnjx/ai-project/daily-advice

# 进入后端目录
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入API密钥

# 初始化数据库
flask db upgrade

# 启动服务器
python run.py
```

服务器将在 `http://localhost:5001` 启动

### 前端安装（待开发）

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

---

## 📚 文档目录

- [📄 产品需求文档（PRD）](docs/产品需求文档.md) - 完整的产品规格说明
- [⚙️ 技术规范文档](docs/技术规范文档.md) - 技术架构和编码规范
- [📅 开发计划](docs/开发计划.md) - 分阶段开发时间表
- [🧪 后端测试文档](docs/后端测试文档.md) - API测试指南和常见问题

---

## 🔌 API接口

### 认证接口

#### 用户注册
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "Test1234",
  "name": "张三",
  "gender": "male",
  "birthday": "1995-06-15"
}
```

#### 用户登录
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "Test1234"
}
```

### 语录接口

#### 生成每日语录
```bash
POST /api/v1/quote/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "event": "今天要面试一家大公司",
  "mood": "有点紧张但充满期待",
  "city": "北京"
}
```

#### 获取历史语录
```bash
GET /api/v1/quote/history?page=1&per_page=10
Authorization: Bearer <token>
```

更多API详情请查看 [后端测试文档](docs/后端测试文档.md)

---

## 💡 核心功能

### 1. 智能语录生成

系统根据以下信息生成个性化语录：

**用户信息**
- 姓名、性别、年龄

**时间信息**
- 今日日期、星期几、当前时间
- 是否生日或临近生日

**环境信息**
- 所在城市、天气状况、气温

**用户状态**（可选）
- 今日大事、目前心情

### 2. 生日识别系统

- **当天生日**：生成包含生日祝福的特殊语录
- **临近生日**（3天内）：生成带有期待感的语录
- **普通日期**：正常励志语录

### 3. 情绪表情系统

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

### 字体规范

- **标题**：方正清刻本悦宋 / 思源宋体
- **正文**：站酷快乐体 / 汉仪尚巍手书
- **英文**：Cinzel / EB Garamond

### 动画效果

- 画卷展开动画（3秒）
- 文字逐字显示（打字机效果）
- 情绪表情3D旋转入场
- 发光效果

---

## 📊 项目进度

### ✅ 已完成

- [x] 产品需求文档
- [x] 技术规范文档
- [x] 数据库设计（User、QuoteHistory表）
- [x] 用户认证系统（注册/登录/JWT）
- [x] DeepSeek AI集成
- [x] 天气服务集成
- [x] 语录生成逻辑
- [x] 生日识别功能
- [x] 情绪识别系统
- [x] API接口开发
- [x] 后端测试文档

### 🔄 进行中

- [ ] 修复JWT认证细节问题
- [ ] 完善错误处理

### ⏳ 待开始

- [ ] 前端项目初始化
- [ ] 认证页面开发
- [ ] 语录生成主页面
- [ ] 中国风UI实现
- [ ] 动画效果开发
- [ ] 前后端联调
- [ ] 部署上线

---

## 🔐 环境变量配置

创建 `backend/.env` 文件：

```bash
# Flask配置
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# 数据库
DATABASE_URL=sqlite:///dev.db

# DeepSeek API
DEEPSEEK_API_KEY=sk-b7f4afd268664e4582e33a60305fff34

# 和风天气API（需要自己注册）
QWEATHER_API_KEY=your-qweather-api-key

# Redis（可选）
REDIS_URL=redis://localhost:6379/0
```

---

## 🧪 测试

### 后端测试

```bash
# 进入后端目录
cd backend
source venv/bin/activate

# 运行测试（待完善）
pytest tests/

# 测试注册
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "password": "Test1234", "name": "张三", "gender": "male", "birthday": "1995-06-15"}'

# 测试登录
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "password": "Test1234"}'
```

详细测试步骤请查看 [后端测试文档](docs/后端测试文档.md)

---

## 📁 项目结构

```
daily-advice/
├── backend/                  # 后端Flask项目
│   ├── app/
│   │   ├── __init__.py      # Flask应用工厂
│   │   ├── models/          # 数据模型
│   │   │   ├── user.py
│   │   │   └── quote.py
│   │   ├── api/             # API路由
│   │   │   ├── auth.py
│   │   │   ├── quote.py
│   │   │   └── user.py
│   │   ├── services/        # 业务逻辑
│   │   │   ├── auth_service.py
│   │   │   ├── ai_service.py
│   │   │   ├── weather_service.py
│   │   │   └── quote_service.py
│   │   ├── utils/           # 工具函数
│   │   │   ├── response.py
│   │   │   ├── validator.py
│   │   │   └── logger.py
│   │   ├── config/          # 配置文件
│   │   └── extensions.py    # Flask扩展
│   ├── migrations/          # 数据库迁移
│   ├── logs/                # 日志文件
│   ├── requirements.txt     # Python依赖
│   ├── .env                 # 环境变量
│   └── run.py               # 启动文件
│
├── frontend/                 # 前端Next.js项目（待开发）
│   ├── src/
│   │   ├── app/             # Next.js 14 App Router
│   │   ├── components/      # React组件
│   │   ├── lib/             # 工具库
│   │   ├── styles/          # 样式文件
│   │   └── types/           # TypeScript类型
│   └── public/              # 静态资源
│
├── docs/                     # 项目文档
│   ├── 产品需求文档.md
│   ├── 技术规范文档.md
│   ├── 开发计划.md
│   └── 后端测试文档.md
│
├── requirement.md            # 原始需求
└── README.md                 # 项目说明
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
