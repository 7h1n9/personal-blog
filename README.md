# 📝 个人技术博客

- 一个基于 React + TypeScript + Vite 构建的现代个人技术博客。  
- 支持明/暗主题切换、文章路由、SEO 优化、自动生成 Sitemap，并可通过 GitHub Actions 一键部署到 GitHub Pages 或本地 Nginx。

## Markdown插件
1. Markdown All in One
2. Markdown Preview Enhanced

## ✨ 特性

- 🚀 **React 18 + TypeScript** – 类型安全，开发体验好
- 🎨 **CSS Modules** – 样式隔离，易于维护
- 🌓 **深色/浅色主题** – 全局主题切换
- 📄 **动态路由** – 首页、文章列表、文章详情、关于我、404 页面
- 🔍 **SEO 友好** – `react-helmet-async` 动态管理页面 TDK，自动生成 `sitemap.xml`
- 📦 **自动化部署** – GitHub Actions 自动构建并部署到 GitHub Pages
- 🧩 **组件化设计** – Header、Nav、Sidebar、Footer 等可复用组件
- ⏱️ **生命周期演示** – `useState`、`useEffect` 模拟数据加载和定时器
- 📬 **父子组件通信** – 父传子（标题）、子传父（订阅邮箱）

## 🛠️ 技术栈

| 类别         | 技术                          |
| ------------ | ----------------------------- |
| 前端框架     | React 18 + TypeScript         |
| 构建工具     | Vite                          |
| 路由         | React Router DOM              |
| 样式         | CSS Modules + CSS 变量        |
| SEO 管理     | React Helmet Async            |
| 代码规范     | ESLint                        |
| 部署         | GitHub Pages / Nginx          |
| 版本控制     | Git + GitHub                  |

## 📦 快速开始

### 克隆项目

```bash
git clone git@github.com:7h1n9/personal-blog.git
cd personal-blog
```

### 项目结构
```
personal-blog/
├── .github/workflows/        # GitHub Actions 部署配置
│   └── deploy.yml
├── public/                   # 静态资源（自动生成 sitemap.xml）
│   └── sitemap.xml
├── src/
│   ├── app/                  # 应用根组件
│   │   └── App.tsx
│   ├── components/           # 可复用UI组件
│   │   ├── DinoGame.tsx      # 恐龙小游戏组件
│   │   ├── EntryGate.tsx     # 入口门组件
│   │   ├── Footer.tsx        # 页脚组件
│   │   ├── Header.tsx        # 页头组件
│   │   ├── MainContent.tsx   # 主要内容区域组件
│   │   ├── Nav.tsx           # 导航组件
│   │   ├── PseudoTerminal.tsx # 伪终端组件
│   │   ├── ScrollReveal.tsx  # 滚动揭示动画组件
│   │   ├── Sidebar.tsx       # 侧边栏组件
│   │   ├── TiltCard.tsx      # 3D倾斜卡片组件
│   │   └── *.module.css      # 对应的CSS模块文件
│   ├── context/              # 全局主题 Context
│   │   └── ThemeContext.tsx
│   ├── data/                 # 文章数据
│   │   └── articles.ts
│   ├── pages/                # 路由页面组件
│   │   ├── AboutPage.tsx
│   │   ├── ArticleDetailPage.tsx
│   │   ├── ArticlesPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── SubscribePage.tsx
│   │   ├── WhiteoutPage.tsx
│   │   └── Pages.module.css
│   ├── App.module.css        # 全局 Grid 布局
│   ├── App.tsx               # 根组件入口
│   ├── index.css             # 全局样式 + 主题变量
│   └── main.tsx              # 应用入口文件
├── generate-sitemap.js       # 自动生成 sitemap 脚本
├── package.json
├── vite.config.ts            # Vite 配置
└── README.md
```

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

> 访问 http://www.cfpnist.shop/ 即可预览。

### 项目展示



## 开源协议
- 本项目仅用于教学和个人学习，可自由修改和使用。