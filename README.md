# Personal Learning Site

一个前后端分离、可本地开发也可部署到远程 Linux 服务器的个人学习网站。第一阶段 MVP 已实现公开学习内容、管理员认证和基础内容发布。

## 1. 项目方案

系统采用 pnpm workspace monorepo：

- `apps/web`：Next.js 前台与管理员 UI。
- `apps/api`：NestJS REST API、JWT 鉴权和业务逻辑。
- `packages/shared`：前后端共享 TypeScript 类型。
- PostgreSQL：持久化管理员、学习板块、文章、照片和随笔。
- Caddy：生产环境统一入口、反向代理并自动申请 HTTPS 证书。

权限边界：

- `GET /categories`、`GET /articles`、`GET /photos`、`GET /moments` 为公开接口。
- 新增、修改、删除和 Dashboard 接口由全局 JWT Guard 保护。
- `@Public()` 只标记允许匿名访问的接口，避免漏加鉴权。

## 2. 技术栈

- Node.js 20.19+，推荐 Node.js 22 LTS
- pnpm 11
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui 设计方式 + Framer Motion
- NestJS 11 + Prisma ORM 7
- PostgreSQL 17
- Passport JWT + bcrypt
- Docker Compose + Caddy

选择理由：App Router 适合内容站的服务端渲染；NestJS 的模块化结构适合持续扩展；Prisma 提供类型安全数据访问；PostgreSQL 对数组标签、全文搜索和后续统计扩展友好；Caddy 可以显著降低个人服务器配置 HTTPS 的成本。

## 3. 目录结构

```text
personal-learning-site/
├─ apps/
│  ├─ web/
│  │  ├─ app/
│  │  │  ├─ (site)/                 # 前台路由
│  │  │  └─ admin/                  # 登录与后台路由
│  │  ├─ components/
│  │  │  ├─ admin/
│  │  │  ├─ home/
│  │  │  ├─ layout/
│  │  │  └─ ui/                     # shadcn/ui 风格基础组件
│  │  └─ lib/
│  └─ api/
│     ├─ prisma/
│     │  ├─ schema.prisma
│     │  └─ seed.ts
│     └─ src/
│        ├─ auth/
│        ├─ categories/
│        ├─ articles/
│        ├─ photos/
│        ├─ moments/
│        ├─ dashboard/
│        ├─ prisma/
│        └─ common/
├─ packages/shared/
├─ deploy/Caddyfile
├─ docker-compose.yml
└─ docker-compose.prod.yml
```

## 4. 数据模型

完整 Prisma 模型见 `apps/api/prisma/schema.prisma`：

- `AdminUser`：管理员账号与 bcrypt 密码摘要。
- `Category`：学习板块，`slug` 唯一，支持排序。
- `Article`：Markdown 正文、标签数组、发布状态及所属板块。
- `Photo`：第二阶段生活照片元数据。
- `Moment`：第二阶段吐槽与随笔。

删除有文章的板块会被 API 拒绝，避免误删造成孤立数据。

## 5. REST API

API 统一前缀为 `/api`，响应格式：

```json
{
  "success": true,
  "data": {},
  "message": "请求成功",
  "timestamp": "2026-06-21T00:00:00.000Z"
}
```

主要接口：

```text
POST   /api/auth/login
GET    /api/auth/profile
GET    /api/categories
GET    /api/categories/:idOrSlug
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
GET    /api/articles
GET    /api/articles/:idOrSlug
GET    /api/articles/admin/all
POST   /api/articles
PATCH  /api/articles/:id
DELETE /api/articles/:id
GET    /api/photos
POST   /api/photos
PATCH  /api/photos/:id
DELETE /api/photos/:id
GET    /api/moments
POST   /api/moments
PATCH  /api/moments/:id
DELETE /api/moments/:id
GET    /api/dashboard/stats
```

保护接口使用请求头：

```text
Authorization: Bearer <JWT_TOKEN>
```

## 6. 本地运行

先复制环境变量：

```powershell
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```

启动 PostgreSQL：

```powershell
docker compose up -d postgres
```

安装依赖、生成客户端、迁移和初始化：

```powershell
pnpm install
pnpm db:generate
pnpm db:migrate --name init
pnpm db:seed
```

启动前后端：

```powershell
pnpm dev
```

- 前台：http://localhost:3000
- API：http://localhost:4000/api
- 后台：http://localhost:3000/admin/login

默认管理员来自 `.env` 的 `ADMIN_USERNAME` 与 `ADMIN_PASSWORD`。首次部署后请立即使用高强度密码重新执行 seed。

## 7. 远程服务器部署

建议服务器：Ubuntu 24.04 LTS、2 核 CPU、2 GB 以上内存、已安装 Docker Engine 与 Compose 插件。先将域名 A/AAAA 记录指向服务器，并开放 80、443 端口。

在服务器项目目录创建 `.env`：

```dotenv
DOMAIN=learn.example.com
POSTGRES_DB=learning_site
POSTGRES_USER=learning_user
POSTGRES_PASSWORD=替换为高强度数据库密码
JWT_SECRET=替换为至少32字节随机字符串
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=替换为高强度管理员密码
```

构建并启动：

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d postgres
docker compose -f docker-compose.prod.yml run --rm api pnpm prisma migrate deploy
docker compose -f docker-compose.prod.yml run --rm api pnpm prisma db seed
docker compose -f docker-compose.prod.yml up -d
```

Caddy 会根据 `DOMAIN` 自动申请和续期 HTTPS 证书。数据库只处于内部 Docker 网络，不映射公网端口。

更新部署：

```bash
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml run --rm api pnpm prisma migrate deploy
docker compose -f docker-compose.prod.yml up -d
```

生产建议：

- 使用云厂商安全组仅开放 22、80、443。
- SSH 禁止密码登录，改用密钥并限制 root。
- 定时执行 `pg_dump`，备份到另一台机器或对象存储。
- 照片模块使用 S3、Cloudflare R2、阿里云 OSS 或腾讯云 COS，不把大量图片直接写进容器。
- 接入 Sentry/GlitchTip 与基础可用性监控。

## 8. MVP 与后续路线

已完成：

- 深色科技风响应式首页。
- 学习板块、文章列表、Markdown 文章详情。
- 管理员登录、JWT、Dashboard。
- 后台新增学习板块和文章。
- Photo/Moment 数据模型与 REST CRUD。
- Docker 化远程部署基础。

第二阶段建议：

1. 后台分类和文章列表、编辑、删除 UI。
2. 对象存储直传、照片瀑布流和灯箱。
3. 随笔时间线和管理 UI。
4. Markdown 编辑器预览、草稿自动保存。
5. 分页、搜索、SEO、RSS、站点地图。
6. Refresh Token、登录限流、操作审计。

## 9. 常用命令

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## 10. 自动部署、监控与备份

生产运维文件位于 `deploy/`：

- `.github/workflows/deploy.yml`：推送 `main` 后通过 SSH 自动部署。
- `deploy/deploy.sh`：拉取指定提交、构建 Docker 镜像、重启、健康检查，失败自动回滚。
- `deploy/ops/monitor.py`：检测首页/API 响应时间、容器状态和磁盘空间，通过 SMTP 发出异常与恢复邮件。
- `deploy/ops/backup.sh`：备份 PostgreSQL 和上传图片，默认保留 14 天。
- `deploy/ops/*.timer`：systemd 每 5 分钟监控、每天 03:30 备份。

GitHub 仓库需要配置以下 Actions Secrets：

```text
DEPLOY_HOST
DEPLOY_PORT
DEPLOY_USER
DEPLOY_SSH_KEY
DEPLOY_KNOWN_HOSTS
```

服务器安装定时任务：

```bash
cd /opt/apps/personal-learning-site
bash deploy/ops/install.sh
nano deploy/ops/monitor.env
systemctl enable --now personal-learning-monitor.timer
systemctl start personal-learning-monitor.service
systemctl list-timers 'personal-learning-*'
```

手动测试备份：

```bash
systemctl start personal-learning-backup.service
journalctl -u personal-learning-backup.service -n 50 --no-pager
ls -lah /var/backups/personal-learning-site
```
