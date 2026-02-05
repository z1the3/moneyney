# Cloudflare Pages 部署指南

本项目已配置支持 Cloudflare Pages + Workers 部署方式，可以替代 Vercel。

## 📋 前置要求

1. 拥有 Cloudflare 账号（[免费注册](https://dash.cloudflare.com/sign-up)）
2. 安装 Wrangler CLI（Cloudflare 官方命令行工具）

```bash
# 安装 Wrangler
npm install -g wrangler

# 或使用 pnpm
pnpm add -g wrangler

# 登录 Cloudflare 账号
wrangler login
```

## 🚀 部署方式

### 方式一：通过 Cloudflare Dashboard（推荐）

1. **连接 GitHub 仓库**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 `Workers & Pages` → `创建应用程序` → `Pages` → `连接到 Git`
   - 授权并选择你的 `moneyney` 仓库

2. **配置构建设置**
   - **框架预设**: `Vite`
   - **构建命令**: `pnpm build` 或 `npm run build`
   - **构建输出目录**: `dist`
   - **Node.js 版本**: `18` 或更高

3. **部署**
   - 点击 `保存并部署`
   - Cloudflare 会自动构建并部署你的应用
   - 每次推送到 GitHub 都会自动触发重新部署

### 方式二：通过 GitHub Actions（自动化）

使用 GitHub Actions 实现 CI/CD 自动部署：

详见 **[GitHub Actions 配置指南](./.github/CLOUDFLARE_ACTIONS_SETUP.md)**

优势：

- ✅ 完全自动化部署流程
- ✅ PR 预览部署
- ✅ 自定义构建流程
- ✅ 更好的版本控制

### 方式三：通过 Wrangler CLI

```bash
# 1. 构建项目
pnpm build

# 2. 部署到 Cloudflare Pages
pnpm pages:deploy

# 或直接使用 wrangler
wrangler pages deploy dist --project-name=moneyney
```

## 🔧 本地测试 Cloudflare Functions

```bash
# 1. 构建项目
pnpm build

# 2. 启动 Cloudflare Pages 开发服务器
pnpm pages:dev

# 3. 访问 http://localhost:8788 测试
```

## 📁 项目结构说明

```
├── functions/              # Cloudflare Pages Functions（服务端函数）
│   ├── api-sina/[[path]].ts   # 新浪行情 API 代理
│   └── api-fund/[[path]].ts   # 天天基金 API 代理
├── _headers               # HTTP 响应头配置（CORS、缓存等）
├── _redirects             # 重定向规则（SPA 路由）
├── wrangler.toml          # Cloudflare Workers 配置
└── dist/                  # 构建输出目录
```

## 🌐 API 路由

部署后，以下 API 路由会自动可用：

- `/api-sina/*` - 代理新浪行情接口（处理 CORS、添加必要请求头）
- `/api-fund/*` - 代理天天基金接口（处理 CORS）

这些路由由 `functions/` 目录下的 Cloudflare Pages Functions 处理。

## ⚙️ 环境变量（可选）

如果需要配置环境变量：

1. **通过 Dashboard**:
   - 进入你的 Pages 项目 → `设置` → `环境变量`
   - 添加需要的变量

2. **通过 wrangler.toml**:
   ```toml
   [vars]
   ENVIRONMENT = "production"
   ```

## 🔍 监控与日志

- **实时日志**: `wrangler pages deployment tail`
- **Dashboard**: Cloudflare Dashboard → Workers & Pages → 你的项目 → 分析

## 🆚 Cloudflare Pages vs Vercel

| 特性      | Cloudflare Pages | Vercel |
| --------- | ---------------- | ------ |
| 免费额度  | 更大             | 较小   |
| CDN 节点  | 全球 300+        | 全球   |
| Functions | 支持             | 支持   |
| 构建时间  | 无限制           | 有限制 |
| 带宽      | 无限制           | 有限制 |
| 价格      | 更便宜           | 较贵   |

## 📚 相关文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Pages Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## ⚠️ 注意事项

1. **首次部署**: 需要在 Cloudflare Dashboard 创建项目
2. **自定义域名**: 可在 Dashboard 中配置
3. **Functions 限制**:
   - CPU 时间: 50ms（免费）/ 更长（付费）
   - 内存: 128MB
   - 请求大小: 100MB
4. **构建时间**: 无限制（相比 Vercel 的限制）

## 🎉 完成！

部署完成后，你会获得一个 `*.pages.dev` 域名，或者可以绑定自己的域名。
