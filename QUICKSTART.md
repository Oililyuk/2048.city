# 2048.city - Quick Start Guide

快速开始使用带Reddit集成的2048游戏！

## 🚀 快速开始（5分钟）

### 1. 安装依赖

```bash
cd /Users/yidongzhang/Downloads/2048
npm install
```

### 2. 准备游戏核心代码

将 `script.js` 中的完整 `Game2048` 类复制到 `public/game-core.js`:

```bash
# 方法1: 手动复制
# 打开 script.js，复制整个 Game2048 类（约1500行）到 public/game-core.js

# 方法2: 使用脚本（快速但可能需要调整）
# 这会复制前1500行，包含大部分游戏逻辑
head -n 1500 script.js > public/game-core.js
```

### 3. 复制静态资源

```bash
# 复制样式表
cp style.css public/style.css

# 复制资源文件夹
cp -r asset public/asset

# 如果有icon.png
cp icon.png public/icon.png 2>/dev/null || true
```

### 4. 配置Reddit API（开发环境）

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，暂时使用测试配置：

```env
REDDIT_CLIENT_ID=test_client_id
REDDIT_CLIENT_SECRET=test_secret
REDDIT_REDIRECT_URI=http://localhost:3000/api/auth/reddit/callback
SESSION_SECRET=development_secret_change_in_production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
TARGET_SUBREDDIT=2048city
```

### 5. 启动服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

### 6. 访问应用

- **新应用（带Reddit集成）**: http://localhost:3000/app
- **原版游戏（无需登录）**: http://localhost:3000/
- **API健康检查**: http://localhost:3000/api/health

## 📝 获取真实的Reddit API密钥

要启用Reddit功能，你需要创建Reddit应用：

### 步骤：

1. 访问 https://www.reddit.com/prefs/apps
2. 点击 "Create App" 或 "Create Another App"
3. 填写表单：
   - **Name**: 2048.city
   - **App type**: 选择 "web app"
   - **Description**: 2048 game with score sharing
   - **About URL**: http://localhost:3000
   - **Redirect URI**: `http://localhost:3000/api/auth/reddit/callback`
4. 点击 "Create app"
5. 记下 **client ID**（显示在应用名称下方）和 **client secret**
6. 更新 `.env` 文件中的 `REDDIT_CLIENT_ID` 和 `REDDIT_CLIENT_SECRET`
7. 重启服务器

## 🎮 使用说明

### 玩游戏（无需登录）
1. 访问 http://localhost:3000/app
2. 使用方向键或滑动操作
3. 到达2048获胜！

### Reddit登录和分享
1. 点击右上角 "Login with Reddit"
2. 授权应用访问你的Reddit账号
3. 玩游戏直到结束
4. 点击 "Share to Reddit" 分享成绩到 r/2048city
5. 也可以使用快捷键 `Ctrl+S` (或 `Cmd+S`) 随时分享

## 📁 项目结构

```
2048/
├── server/              # 后端API服务器
│   ├── index.js        # 主服务器文件
│   ├── routes/         # API路由
│   ├── services/       # 业务逻辑
│   ├── middleware/     # 中间件
│   └── config/         # 配置
│
├── public/             # 前端文件
│   ├── app.html       # 带Reddit的主应用
│   ├── app.js         # 应用逻辑
│   ├── reddit-auth.js # Reddit认证
│   ├── game-core.js   # 游戏核心（需要从script.js复制）
│   ├── style.css      # 样式（从根目录复制）
│   └── asset/         # 资源（从根目录复制）
│
├── index.html         # 原版游戏（保持不变）
├── script.js          # 原版游戏逻辑（保持不变）
├── style.css          # 原版样式（保持不变）
│
├── .env.example       # 环境变量模板
├── package.json       # 项目配置
├── ARCHITECTURE.md    # 架构文档
└── DEPLOYMENT.md      # 部署指南
```

## 🔧 常见问题

### Q: Reddit登录不工作？
A: 确保：
1. `.env` 中的Reddit credentials正确
2. Redirect URI完全匹配（包括http://）
3. Reddit应用类型是 "web app"
4. 服务器正在运行

### Q: 游戏界面显示但不能玩？
A: 检查：
1. `public/game-core.js` 是否包含完整的Game2048类
2. 浏览器控制台是否有JavaScript错误
3. `public/style.css` 是否存在

### Q: 分享到Reddit失败？
A: 确认：
1. 已经登录Reddit
2. Token未过期（页面刷新会丢失token）
3. 查看服务器日志了解详细错误
4. 每小时最多分享3次

### Q: 原版游戏还能用吗？
A: 是的！原版文件（index.html, script.js, style.css）完全不受影响，可以继续在 http://localhost:3000/ 访问。

## 📚 下一步

1. **开发**: 阅读 `ARCHITECTURE.md` 了解系统架构
2. **部署**: 查看 `DEPLOYMENT.md` 部署到生产环境
3. **定制**: 修改UI、添加功能、调整样式

## 🐛 调试

### 查看服务器日志
服务器会输出详细日志，包括：
- API请求
- Reddit API调用
- 错误信息

### 测试API端点
```bash
# 健康检查
curl http://localhost:3000/api/health

# 认证状态
curl http://localhost:3000/api/auth/status \
  -H "Cookie: connect.sid=YOUR_SESSION_ID"
```

### 浏览器开发工具
1. 打开浏览器开发者工具（F12）
2. 查看Console标签页的错误
3. 查看Network标签页的API请求
4. 查看Application > Local Storage 中的token

## 💡 提示

- 开发时使用 `npm run dev`，它会自动重启服务器
- LocalStorage中的token在页面刷新后保留
- 使用 `Ctrl+S` (Cmd+S) 快速分享分数
- 查看控制台获取调试信息

## 🎉 准备就绪！

现在你可以：
✅ 玩2048游戏
✅ 用Reddit账号登录
✅ 分享成绩到r/2048city
✅ 自定义和扩展功能

祝你游戏愉快！🚀
