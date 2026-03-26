# 个人技术博客

这是一个基于 React 和 TypeScript 的个人技术博客项目，使用 Vite 构建工具进行快速开发。

## 功能特性

- 响应式设计，支持移动设备
- 使用 CSS Modules 进行样式隔离
- 清晰的组件结构
- 语义化 HTML 结构

## 技术栈

- React 18
- TypeScript
- Vite
- CSS Modules

## 安装和运行

1. 克隆项目
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

## 开发指南

在开发过程中，您可以按以下步骤添加新功能：

1. 在 `src/components` 中创建新的组件
2. 在 `src/App.tsx` 中引入并使用新组件
3. 为组件编写对应的样式文件（建议使用 CSS Modules）

## 项目结构

```
personal-blog/
├── node_modules/          # 项目依赖包
├── src/                   # 源代码主目录
│   ├── assets/          # 静态资源（图片、字体等）
│   ├── components/      # 可复用的 React 组件
│   ├── App.tsx          # 根组件
│   ├── App.css          # 根组件样式
│   ├── main.tsx         # 应用入口文件
│   └── index.css        # 全局样式
├── .gitignore           # Git 忽略文件配置
├── eslint.config.js     # ESLint 代码检查配置
├── index.html           # 项目入口 HTML 文件
├── package.json         # 项目元数据和依赖管理
├── package-lock.json    # 锁定依赖版本
├── README.md            # 项目说明文档
├── tsconfig.app.json    # TypeScript 编译配置（针对应用代码）
├── tsconfig.json        # TypeScript 基础配置
├── tsconfig.node.json   # TypeScript 编译配置（针对 Node.js 环境）
└── vite.config.ts       # Vite 构建工具配置文件
```