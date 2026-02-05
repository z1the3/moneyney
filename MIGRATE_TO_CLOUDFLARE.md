# 从 Vercel 迁移到 Cloudflare Pages

本指南帮助你将 moneyney 项目从 Vercel 迁移到 Cloudflare Pages。

## 📊 迁移对比

| 功能                | Vercel           | Cloudflare Pages                            |
| ------------------- | ---------------- | ------------------------------------------- |
| **Serverless 函数** | `api/sina.js`    | `functions/api-sina/[[path]].ts`            |
| **配置文件**        | `vercel.json`    | `wrangler.toml` + `_headers` + `_redirects` |
| **API 路由**        | `/api/sina`      | `/api-sina/*`                               |
| **部署方式**        | `vercel deploy`  | `wrangler pages deploy`                     |
| **环境变量**        | Vercel Dashboard | Cloudflare Dashboard                        |

## 🔄 已完成的迁移工作

项目已经完成以下 Cloudflare 适配：

✅ **Serverless Functions**

- `api/sina.js` (Vercel) → `functions/api-sina/[[path]].ts` (Cloudflare)
- `vercel.json` 代理规则 → `functions/api-fund/[[path]].ts` (Cloudflare)

✅ **配置文件**

- 创建 `wrangler.toml` - Workers 配置
- 创建 `_headers` - HTTP 响应头（CORS、缓存）
- 创建 `_redirects` - SPA 路由回退

✅ **部署脚本**

- 添加 `pages:dev` - 本地测试 Functions
- 添加 `pages:deploy` - 部署到 Cloudflare

✅ **自动化**

- 配置 GitHub Actions 自动部署

## 🚀 迁移步骤

### 1. 清理（可选）

如果要完全迁移到 Cloudflare，可以删除 Vercel 相关文件：

```bash
# 删除 Vercel 配置和函数（可选，保留也不影响）
rm vercel.json
rm -rf api/
```

### 2. 安装 Wrangler

```bash
# 全局安装
pnpm add -g wrangler

# 登录 Cloudflare
wrangler login
```

### 3. 测试本地 Functions

```bash
# 构建项目
pnpm build

# 启动 Cloudflare Pages 开发服务器
pnpm pages:dev

# 访问 http://localhost:8788 测试
```

### 4. 部署到 Cloudflare

**选项 A: 通过 CLI**

```bash
pnpm pages:deploy
```

**选项 B: 通过 Dashboard**

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → 创建应用 → 连接 Git
3. 选择仓库并配置构建设置
4. 部署

**选项 C: 通过 GitHub Actions**

1. 配置 GitHub Secrets（详见 `.github/CLOUDFLARE_ACTIONS_SETUP.md`）
2. 推送到 main 分支自动部署

### 5. 配置域名（可选）

在 Cloudflare Dashboard：

1. 进入你的 Pages 项目
2. `自定义域` → 添加你的域名
3. Cloudflare 会自动配置 DNS 和 SSL

### 6. 验证功能

部署后测试以下功能：

- ✅ 基金价格更新（`/api-fund/*`）
- ✅ 大盘指数显示（`/api-sina/*`）
- ✅ 页面路由正常（SPA 路由）
- ✅ 静态资源加载

## 🔍 API 路由变化

### Vercel

```javascript
// vercel.json
{
  "rewrites": [
    { "source": "/api-sina/(.*)", "destination": "/api/sina?path=$1" }
  ]
}

// api/sina.js
export default async function handler(req, res) { ... }
```

### Cloudflare

```typescript
// functions/api-sina/[[path]].ts
export async function onRequest(context) {
  const { params } = context;
  const path = params.path?.join("/") || "";
  // ...
}
```

Cloudflare Pages Functions 使用文件系统路由：

- `functions/api-sina/[[path]].ts` → `/api-sina/*`
- `[[path]]` 是捕获所有路径的语法

## ⚙️ 环境变量迁移

如果你在 Vercel 中配置了环境变量：

1. 在 Cloudflare Dashboard:
   - 进入 Pages 项目 → 设置 → 环境变量
   - 添加相同的变量

2. 或在 `wrangler.toml`:
   ```toml
   [vars]
   YOUR_VAR = "value"
   ```

## 🎯 性能优化建议

Cloudflare 特有的优化：

1. **缓存策略**
   - 已在 `_headers` 中配置静态资源缓存
   - Functions 响应缓存 60s-300s

2. **全球加速**
   - Cloudflare 有 300+ 个边缘节点
   - 自动就近访问

3. **Workers KV**（可选）
   - 如需持久化数据，可使用 Workers KV
   - 比 Vercel Edge Config 更灵活

## ❌ 删除 Vercel 项目（可选）

完成迁移后，在 Vercel Dashboard：

1. 进入项目设置
2. 删除项目（不会影响 GitHub 仓库）

## 📈 成本对比

| 项目           | Vercel 免费版 | Cloudflare Pages 免费版 |
| -------------- | ------------- | ----------------------- |
| 带宽           | 100GB/月      | **无限制**              |
| 构建时间       | 6000分钟/月   | **无限制**              |
| Functions 请求 | 100GB-小时    | **10万次/天**           |
| 并发请求       | 100           | **无限制**              |
| 部署数量       | 100/天        | **500/月**              |

Cloudflare Pages 对个人项目更友好！

## 🆘 常见问题

### Q: 能否同时支持 Vercel 和 Cloudflare？

A: 可以！两套配置可以共存：

- Vercel: `vercel.json` + `api/`
- Cloudflare: `wrangler.toml` + `functions/`

### Q: 本地开发如何测试 Functions？

A: 使用 `pnpm pages:dev` 而不是 `pnpm dev`

- `pnpm dev` - Vite 开发服务器（通过代理）
- `pnpm pages:dev` - Cloudflare Pages 本地环境

### Q: 如何迁移旧域名？

A:

1. 在 Cloudflare 添加自定义域名
2. 更新 DNS 记录指向 Cloudflare
3. 等待 DNS 传播（通常几分钟）

### Q: Functions 有什么限制？

A: Cloudflare Workers 限制：

- CPU 时间: 50ms（免费）
- 内存: 128MB
- 请求体: 100MB
- 对于本项目足够了

## 🔗 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Pages Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Vercel 迁移指南](https://developers.cloudflare.com/pages/migrations/migrating-from-vercel/)
- [项目部署指南](./CLOUDFLARE_DEPLOY.md)

## ✅ 迁移完成检查清单

- [ ] 安装 Wrangler CLI
- [ ] 登录 Cloudflare 账号
- [ ] 本地测试 Functions (`pnpm pages:dev`)
- [ ] 部署到 Cloudflare
- [ ] 验证 API 功能正常
- [ ] 配置自定义域名（可选）
- [ ] 设置 GitHub Actions（可选）
- [ ] 删除 Vercel 项目（可选）

---

**恭喜！** 🎉 你已成功从 Vercel 迁移到 Cloudflare Pages。
