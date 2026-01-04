# Keke的新西兰之旅 (New Zealand Journey Tracker)

这是一个基于 React 开发的网页应用，用于追踪入境新西兰的天数、RV签证倒计时以及记录日常工作进度。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **数据存储**: LocalStorage (浏览器本地存储)

---

## 部署指南 (Cloudflare Pages)

本项目完全适配 **Cloudflare Pages** 免费托管服务。以下是详细部署步骤：

### 第一步：准备代码仓库

1. 确保你已经安装了 [Node.js](https://nodejs.org/)。
2. 在本地文件夹打开终端（Terminal），初始化 Git 仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. 在 GitHub (或 GitLab) 上创建一个新的**私有仓库**（Private Repository）。
4. 将本地代码推送到 GitHub：
   ```bash
   git remote add origin <你的GitHub仓库地址>
   git branch -M main
   git push -u origin main
   ```

### 第二步：配置 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 在左侧菜单选择 **Workers & Pages** -> **Overview**。
3. 点击 **Create application** -> **Pages** -> **Connect to Git**。
4. 选择你刚刚创建的 GitHub 仓库，点击 **Begin setup**。

### 第三步：构建设置 (关键步骤)

在 "Set up builds and deployments" 页面，请确保以下设置正确：

- **Project name**: (随意填写，例如 `keke-nz-tracker`)
- **Production branch**: `main`
- **Framework preset (框架预设)**: 选择 **Vite** (如果没有 Vite 选项，请选择 React 或手动填写下方内容)
- **Build command (构建命令)**: `npm run build`
- **Build output directory (输出目录)**: `dist`

点击 **Save and Deploy**。

### 第四步：完成

Cloudflare 会自动下载依赖并构建项目。等待约 1 分钟，当看到 "Success!" 时，点击生成的 URL (例如 `https://keke-nz-tracker.pages.dev`) 即可访问你的应用。

---

## 本地开发

如果你需要在本地运行项目进行修改：

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

## 注意事项

- **数据安全**: 该应用使用浏览器本地存储 (`localStorage`) 保存工作日志。清理浏览器缓存或更换设备会导致数据丢失。建议定期使用页面上的“备份”功能下载 JSON 文件。
- **Tailwind CSS**: 目前项目使用 CDN 引入 Tailwind CSS 以简化配置。如果需要更高的加载性能，可以在未来迁移到 PostCSS 构建流程。
