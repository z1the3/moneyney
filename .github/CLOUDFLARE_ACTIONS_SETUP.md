# Cloudflare GitHub Actions 自动部署配置

本项目已配置 GitHub Actions 自动部署到 Cloudflare Pages。

## 🔧 配置步骤

### 1. 获取 Cloudflare API Token

#### 方式一：使用预设模板（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击右上角头像 → `我的个人资料` → `API 令牌`
3. 点击 `创建令牌` → 使用 **`编辑 Cloudflare Workers`** 模板
4. 确认权限并创建
5. 复制 API Token（只显示一次，请妥善保存）

#### 方式二：自定义令牌（精细控制）

如果需要自定义权限，创建令牌时选择 `创建自定义令牌`，并配置以下权限：

**必需权限：**

- **Account**
  - `Cloudflare Pages` → **Edit** ✅

**可选权限（用于更完整的功能）：**

- **Account**
  - `Account Settings` → **Read** （查看账户信息）

**账户资源：**

- 选择你要部署的账户
- 或选择 `All accounts`（如果有多个账户）

**客户端 IP 地址过滤（可选）：**

- 留空（允许所有 IP）
- 或添加 GitHub Actions 的 IP 范围

**TTL（令牌有效期）：**

- 建议选择 `1 year` 或更长
- 到期前记得续期

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

## ✅ 验证 API Token 权限

创建 Token 后，可以使用以下命令验证权限是否正确：

```bash
# 安装 wrangler（如果还没有）
pnpm add -g wrangler

# 设置环境变量
export CLOUDFLARE_API_TOKEN=你的_API_Token
export CLOUDFLARE_ACCOUNT_ID=你的_Account_ID

# 验证 Token
wrangler whoami

# 测试部署权限（不会真正部署）
wrangler pages project list
```

如果命令执行成功，说明权限配置正确。

## 🔍 查看部署状态

- **GitHub**: 仓库 → `Actions` 标签页
- **Cloudflare**: Dashboard → Workers & Pages → moneyney → 部署

## ⚠️ 注意事项

1. **首次部署**: 必须先在 Cloudflare Dashboard 创建项目
2. **项目名称**: 确保 `projectName` 与 Cloudflare 中的项目名一致
3. **Secrets 安全**: 不要在代码中硬编码 API Token
4. **权限要求**:
   - ✅ 最低权限：`Account - Cloudflare Pages: Edit`
   - ⚠️ 不要使用 Global API Key（安全风险高）
   - 💡 推荐使用预设的 "编辑 Cloudflare Workers" 模板
   - 🔒 定期轮换 API Token（建议每 6-12 个月）
5. **令牌安全最佳实践**:
   - 只授予必需的最小权限
   - 设置合理的 TTL（有效期）
   - 定期审查和清理未使用的令牌
   - 泄露后立即在 Dashboard 中撤销

## 🔗 相关链接

- [Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action)
- [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- [GitHub Actions 文档](https://docs.github.com/actions)

## 🔧 权限问题排查

### 错误：`Authentication error` 或 `Invalid API Token`

**原因**：API Token 无效或权限不足

**解决方案**：

1. 确认 Token 没有过期
2. 检查 GitHub Secrets 中的 `CLOUDFLARE_API_TOKEN` 是否正确
3. 重新创建 API Token，确保选择了正确的权限
4. 使用 `wrangler whoami` 验证 Token

### 错误：`You do not have permission to deploy to this project`

**原因**：Token 没有 Cloudflare Pages 编辑权限

**解决方案**：

1. 进入 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 找到你的 Token，点击编辑
3. 确保有 `Account - Cloudflare Pages: Edit` 权限
4. 或重新创建一个使用 "编辑 Cloudflare Workers" 模板的 Token

### 错误：`Account ID not found`

**原因**：Account ID 配置错误

**解决方案**：

1. 登录 Cloudflare Dashboard
2. 进入 `Workers & Pages`
3. 在右侧栏查看正确的 Account ID
4. 更新 GitHub Secrets 中的 `CLOUDFLARE_ACCOUNT_ID`

### 错误：`Project not found: moneyney`

**原因**：项目还未在 Cloudflare 创建

**解决方案**：

1. 首次部署需要先在 Cloudflare Dashboard 手动创建项目
2. 或使用 CLI 创建：`wrangler pages project create moneyney`
3. 确保项目名称与 workflow 配置中的 `projectName` 一致
