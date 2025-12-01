# 2048.city - Reddit集成架构设计

## 概述

本项目将在保留原有2048游戏功能的基础上，添加Reddit API集成，支持用户通过Reddit账号登录并分享游戏成绩到r/2048city社区。

## 技术栈

### 前端
- **HTML5/CSS3**: 保留原有的液态玻璃效果UI
- **Vanilla JavaScript**: 游戏核心逻辑（复用现有代码）
- **Fetch API**: 与后端API通信
- **LocalStorage**: 存储游戏状态和用户token

### 后端
- **Node.js + Express**: RESTful API服务器
- **Axios**: Reddit API客户端
- **express-session**: 会话管理
- **dotenv**: 环境变量管理
- **cors**: 跨域资源共享

## 项目结构

```
2048/
├── public/                      # 前端静态文件（新）
│   ├── app.html                 # 带Reddit集成的主应用页面
│   ├── app.js                   # 应用逻辑（集成原game logic + Reddit功能）
│   ├── reddit-auth.js           # Reddit认证客户端模块
│   ├── style.css                # 复用现有样式
│   ├── game-core.js             # 游戏核心逻辑（从script.js提取）
│   └── asset/                   # 静态资源（复用）
│       └── wallpaper/
│
├── server/                      # 后端服务器（新）
│   ├── index.js                 # Express服务器入口
│   ├── routes/
│   │   ├── auth.js              # Reddit OAuth路由
│   │   ├── scores.js            # 分数提交路由
│   │   └── user.js              # 用户信息路由
│   ├── services/
│   │   ├── reddit-api.js        # Reddit API封装
│   │   └── score-formatter.js  # 分数格式化服务
│   ├── middleware/
│   │   ├── auth.js              # 认证中间件
│   │   └── error-handler.js    # 错误处理中间件
│   └── config/
│       └── reddit.js            # Reddit配置
│
├── index.html                   # 原始游戏（保持不变）
├── script.js                    # 原始游戏逻辑（保持不变）
├── style.css                    # 原始样式（保持不变）
├── how-to-play.html            # 使用说明（保持不变）
├── how-to-play.css             # 使用说明样式（保持不变）
│
├── .env.example                 # 环境变量模板（新）
├── .gitignore                   # Git忽略配置（新）
├── package.json                 # 项目依赖（新）
├── README.md                    # 项目说明（更新）
├── ARCHITECTURE.md              # 本文档（新）
└── DEPLOYMENT.md                # 部署指南（新）
```

## Reddit OAuth 2.0 流程

### 1. 用户授权流程

```
用户 -> 点击"Login with Reddit"
  -> 前端重定向到Reddit授权页面
  -> 用户在Reddit授权
  -> Reddit重定向回应用（带授权码）
  -> 后端exchange授权码为access_token
  -> 后端返回token给前端
  -> 前端存储token到LocalStorage
```

### 2. 授权URL构建

```
https://www.reddit.com/api/v1/authorize?
  client_id=YOUR_CLIENT_ID
  &response_type=code
  &state=RANDOM_STRING
  &redirect_uri=YOUR_REDIRECT_URI
  &duration=permanent
  &scope=identity submit
```

**所需权限（scopes）**:
- `identity`: 获取用户基本信息（用户名）
- `submit`: 提交帖子到subreddit

### 3. Token Exchange

```javascript
// 后端代码示例
POST https://www.reddit.com/api/v1/access_token
Headers:
  Authorization: Basic base64(client_id:client_secret)
  Content-Type: application/x-www-form-urlencoded
Body:
  grant_type=authorization_code
  code=AUTHORIZATION_CODE
  redirect_uri=YOUR_REDIRECT_URI
```

## API设计

### 后端API端点

#### 1. 认证相关

**GET /api/auth/reddit**
- 描述: 发起Reddit OAuth流程
- 响应: 重定向到Reddit授权页面

**GET /api/auth/reddit/callback**
- 描述: Reddit OAuth回调
- 参数: `code`, `state`
- 响应: 
  ```json
  {
    "success": true,
    "token": "access_token",
    "username": "reddit_username",
    "expiresIn": 3600
  }
  ```

**POST /api/auth/refresh**
- 描述: 刷新access token
- 请求体:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- 响应: 新的access token

**GET /api/auth/user**
- 描述: 获取当前用户信息
- Headers: `Authorization: Bearer <token>`
- 响应:
  ```json
  {
    "username": "reddit_username",
    "karma": 1234,
    "created": "2020-01-01"
  }
  ```

#### 2. 分数相关

**POST /api/scores/share**
- 描述: 分享分数到r/2048city
- Headers: `Authorization: Bearer <token>`
- 请求体:
  ```json
  {
    "score": 12345,
    "bestTile": 2048,
    "moves": 1234,
    "playTime": 360
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "postId": "abc123",
    "postUrl": "https://reddit.com/r/2048city/comments/..."
  }
  ```

**GET /api/scores/leaderboard**
- 描述: 获取排行榜（可选功能）
- 参数: `period` (day/week/month/all)
- 响应:
  ```json
  {
    "scores": [
      {
        "username": "player1",
        "score": 50000,
        "timestamp": "2024-12-01T10:00:00Z"
      }
    ]
  }
  ```

### 前端API调用

```javascript
// reddit-auth.js
class RedditAuth {
  async login() {
    // 重定向到 /api/auth/reddit
  }
  
  async handleCallback(code) {
    // 处理回调，获取token
  }
  
  async getUserInfo() {
    // 获取用户信息
  }
  
  isAuthenticated() {
    // 检查是否已登录
  }
  
  logout() {
    // 清除本地存储的token
  }
}

// app.js
class GameWithReddit extends Game2048 {
  async shareScore() {
    // 调用 POST /api/scores/share
  }
  
  showShareDialog() {
    // 显示分享对话框
  }
}
```

## 用户体验流程

### 1. 首次访问

```
1. 用户访问 app.html
2. 看到游戏界面，右上角显示 "Login with Reddit" 按钮
3. 可以直接玩游戏（离线模式）
4. 游戏结束后，提示 "登录Reddit分享你的成绩"
```

### 2. Reddit登录

```
1. 用户点击 "Login with Reddit"
2. 跳转到Reddit授权页面
3. 用户授权后返回游戏
4. 显示用户名和登出按钮
5. 游戏结束后自动显示 "分享到r/2048city" 按钮
```

### 3. 分享成绩

```
1. 游戏结束（Game Over或Win）
2. 弹出分享对话框
3. 显示分数、最高方块、移动次数等信息
4. 用户可以编辑分享标题（可选）
5. 点击 "Share to Reddit" 按钮
6. 后端提交帖子到r/2048city
7. 显示分享成功，提供Reddit帖子链接
```

## Reddit帖子格式

### 标题格式
```
[Score: 12345] Just reached 2048! 🎮
```

### 内容格式
```markdown
I just scored **12,345** points in Wicked 2048!

📊 Game Stats:
- 🏆 Best Tile: 2048
- 🎯 Total Moves: 1,234
- ⏱️ Play Time: 6m 0s

Play now at https://wicked.today

---
*This score was shared from [2048.city](https://wicked.today)*
```

## 安全考虑

### 1. Token安全
- Access token存储在LocalStorage（仅客户端）
- Refresh token存储在HttpOnly cookie（服务器端）
- 使用HTTPS传输所有敏感数据

### 2. CSRF保护
- OAuth state参数验证
- 使用随机生成的state参数

### 3. Rate Limiting
- 限制分享频率（每用户每小时最多3次）
- 使用express-rate-limit中间件

### 4. 输入验证
- 验证分数合理性（防止作弊）
- 清理用户输入的标题

## 环境变量配置

```env
# .env.example

# Reddit API Credentials
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_REDIRECT_URI=http://localhost:3000/api/auth/reddit/callback
REDDIT_USER_AGENT=2048.city/1.0

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your_random_secret_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Subreddit Configuration
TARGET_SUBREDDIT=2048city
```

## 部署考虑

### 1. 开发环境
- 前端: 通过Express静态服务提供（public文件夹）
- 后端: Node.js Express服务器
- 端口: 3000

### 2. 生产环境
- 前端: 部署到Vercel/Netlify（静态托管）
- 后端: 部署到Vercel Serverless Functions或Railway
- 使用环境变量配置不同的redirect_uri

### 3. Reddit App配置
- 在 https://www.reddit.com/prefs/apps 创建应用
- 类型: "web app"
- Redirect URI: 设置为你的回调URL
- 记录 client_id 和 client_secret

## 向后兼容

- 原有的 `index.html` 保持完全不变
- 用户仍可访问原版游戏（无需Reddit账号）
- 新功能仅在 `app.html` 中可用
- 所有原有链接继续有效

## 扩展功能（可选）

### Phase 2 功能
1. **排行榜系统**: 从r/2048city抓取所有分享的分数
2. **成就系统**: 解锁不同成就（首次2048、连续游戏等）
3. **好友系统**: 关注其他Reddit玩家
4. **回放功能**: 记录游戏过程，分享游戏回放

### Phase 3 功能
1. **多人对战模式**: 实时PvP
2. **每日挑战**: 固定种子的每日挑战
3. **自定义主题**: 用户可上传自定义皮肤

## 开发路线图

### Milestone 1: 基础架构（1-2天）
- ✅ 架构设计文档
- [ ] 项目结构搭建
- [ ] 后端服务器基础框架
- [ ] Reddit API封装

### Milestone 2: 认证功能（2-3天）
- [ ] Reddit OAuth实现
- [ ] Token管理
- [ ] 用户状态管理

### Milestone 3: 分享功能（2-3天）
- [ ] 分享API实现
- [ ] 分享UI设计
- [ ] 帖子格式化

### Milestone 4: 测试和优化（2-3天）
- [ ] 功能测试
- [ ] 安全审查
- [ ] 性能优化
- [ ] 文档完善

### Milestone 5: 部署上线（1-2天）
- [ ] 生产环境配置
- [ ] Reddit App注册
- [ ] 域名配置
- [ ] 监控设置

## 相关文档

- [Reddit API Documentation](https://www.reddit.com/dev/api)
- [Reddit OAuth2 Guide](https://github.com/reddit-archive/reddit/wiki/OAuth2)
- [Express.js Documentation](https://expressjs.com/)
- [Original Game README](./README.md)
