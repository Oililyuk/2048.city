# Vercel 部署指南

## 步骤 1: 准备 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit"
```

将代码推送到 GitHub/GitLab/Bitbucket

## 步骤 2: 在 Vercel 创建项目

1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 导入你的 Git 仓库
4. Vercel 会自动检测 Next.js 项目

## 步骤 3: 配置 Vercel Postgres 数据库

1. 在 Vercel 项目中，进入 "Storage" 标签
2. 点击 "Create Database"
3. 选择 "Postgres"
4. 点击 "Continue" 创建数据库
5. 数据库创建后，Vercel 会自动添加以下环境变量：
   - `POSTGRES_URL` (这将作为 `DATABASE_URL`)
   - `POSTGRES_URL_NON_POOLING` (这将作为 `DIRECT_URL`)

## 步骤 4: 配置环境变量

在 Vercel 项目的 "Settings" -> "Environment Variables" 中添加：

### 必需的环境变量：

1. **DATABASE_URL**
   - 值：从 Vercel Postgres 自动生成的 `POSTGRES_URL`
   - 或手动复制连接字符串

2. **DIRECT_URL**
   - 值：从 Vercel Postgres 自动生成的 `POSTGRES_URL_NON_POOLING`

3. **NEXTAUTH_URL**
   - 值：`https://2048.city` (你的域名)
   - 如果还没配置域名，先用 Vercel 提供的域名如 `https://your-project.vercel.app`

4. **NEXTAUTH_SECRET**
   - 生成新的密钥：
   ```bash
   openssl rand -base64 32
   ```
   - 将生成的字符串作为值

5. **GOOGLE_CLIENT_ID**
   - 从 Google Cloud Console 获取
   - https://console.cloud.google.com/apis/credentials

6. **GOOGLE_CLIENT_SECRET**
   - 从 Google Cloud Console 获取

## 步骤 5: 配置 Google OAuth

1. 访问 https://console.cloud.google.com/apis/credentials
2. 编辑你的 OAuth 2.0 客户端
3. 在 "已授权的重定向 URI" 中添加：
   ```
   https://2048.city/api/auth/callback/google
   https://your-project.vercel.app/api/auth/callback/google
   ```

## 步骤 6: 运行数据库迁移

有两种方式：

### 方式 A: 本地运行迁移（推荐）

1. 更新本地 `.env.local`，临时使用 Vercel Postgres 连接字符串：
   ```bash
   DATABASE_URL="postgres://..."
   DIRECT_URL="postgres://..."
   ```

2. 运行迁移：
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 方式 B: 通过 Vercel 部署自动运行

在 `vercel.json` 中已经配置了 `prisma generate`，首次部署时会自动生成客户端。

但需要手动在 Vercel 项目设置中添加构建命令：
```
prisma generate && prisma db push && next build
```

## 步骤 7: 部署

1. 提交所有更改：
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```

2. Vercel 会自动检测到新的提交并开始部署

3. 等待部署完成（通常 2-3 分钟）

## 步骤 8: 配置自定义域名

1. 在 Vercel 项目中，进入 "Settings" -> "Domains"
2. 添加 `2048.city` 和 `www.2048.city`
3. 按照 Vercel 的指示配置 DNS 记录：
   - A 记录指向 Vercel 的 IP
   - CNAME 记录指向 `cname.vercel-dns.com`

4. 等待 DNS 传播（通常 5-30 分钟）

5. 更新环境变量 `NEXTAUTH_URL` 为 `https://2048.city`

6. 重新部署项目

## 步骤 9: 验证部署

访问 https://2048.city（或你的 Vercel 域名）：

- ✅ 游戏正常加载
- ✅ 可以登录 Google
- ✅ 排行榜功能正常
- ✅ 分数保存到数据库

## 故障排查

### 数据库连接错误

如果看到 "Can't reach database server" 错误：
1. 确认环境变量正确设置
2. 检查 Prisma schema 中的 `directUrl` 配置
3. 在 Vercel 日志中查看详细错误信息

### OAuth 回调错误

如果登录后出现 "Callback URL mismatch" 错误：
1. 检查 Google Cloud Console 中的授权重定向 URI
2. 确保 `NEXTAUTH_URL` 环境变量正确

### 构建失败

查看 Vercel 构建日志，常见问题：
1. 缺少环境变量
2. Prisma 生成失败 - 运行 `npx prisma generate`
3. TypeScript 错误 - 本地运行 `npm run build` 检查

## 性能优化

部署后可以考虑：

1. **启用 Edge Functions**（可选）
   - 将 API 路由移至 Edge Runtime
   - 更快的全球响应速度

2. **配置 CDN 缓存**
   - 静态资源自动通过 Vercel CDN 分发

3. **数据库连接池**
   - Vercel Postgres 自动提供连接池
   - 使用 `DATABASE_URL` 而不是 `DIRECT_URL` 进行查询

## 监控和分析

1. Vercel Analytics - 访问统计
2. Vercel Speed Insights - 性能监控
3. 在 Vercel 项目中查看实时日志

---

部署完成后，你的 Free 2048 游戏就可以在 https://2048.city 上运行了！
