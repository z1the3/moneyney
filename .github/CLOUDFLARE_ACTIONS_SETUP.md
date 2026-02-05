# Cloudflare GitHub Actions 自动部署配置

本项目已配置 GitHub Actions 自动部署到 Cloudflare Pages。

## 🔧 配置步骤

### 1. 获取 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击右上角头像 → `我的个人资料` → `API 令牌`
3. 点击 `创建令牌` → 使用 `编辑 Cloudflare Workers` 模板
4. 或者创建自定义令牌，需要以下权限：
   - **Account** - Cloudflare Pages: Edit
5. 创建后复制 API Token（只显示一次）

### 2. 获取 Account ID

1. 在 Cloudflare Dashboard 中
2. 进入 `Workers & Pages`
3. 在右侧可以看到 `Account ID`
4. 复制 Account ID

### 3. 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`，添加以下两个密钥：
   - **Name**: `CLOUDFLARE_API_TOKEN`  
     **Value**: 你的 Cloudflare API Token
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`  
     **Value**: 你的 Cloudflare Account ID

### 4. 首次创建项目

在 GitHub Actions 自动部署之前，需要先在 Cloudflare Dashboard 手动创建项目：

1. 进入 `Workers & Pages`
2. 创建一个名为 `moneyney` 的 Pages 项目
3. 或者修改 `.github/workflows/deploy-cloudflare.yml` 中的 `projectName` 为你的项目名

## 🚀 自动部署

配置完成后：

- ✅ 每次推送到 `main` 分支时自动部署到生产环境
- ✅ Pull Request 时自动创建预览部署
- ✅ 部署状态会显示在 GitHub Actions 中

## 📝 手动触发部署

```bash
# 推送到 main 分支即可触发
git push origin main
```

## 🔍 查看部署状态

- **GitHub**: 仓库 → `Actions` 标签页
- **Cloudflare**: Dashboard → Workers & Pages → moneyney → 部署

## ⚠️ 注意事项

1. **首次部署**: 必须先在 Cloudflare Dashboard 创建项目
2. **项目名称**: 确保 `projectName` 与 Cloudflare 中的项目名一致
3. **Secrets 安全**: 不要在代码中硬编码 API Token
4. **权限**: 确保 API Token 有足够的权限

## 🔗 相关链接

- [Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action)
- [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- [GitHub Actions 文档](https://docs.github.com/actions)
