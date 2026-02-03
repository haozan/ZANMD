# 用户认证与云端存储系统

## 概述

红中排版现已支持用户注册/登录功能和云端存储模式。您的文章将安全存储在云端服务器，随时随地可以访问。

## 功能特性

### 1. 用户认证系统

- ✅ 用户注册：使用邮箱和密码创建账户
- ✅ 用户登录：JWT token认证，7天有效期
- ✅ 自动登录：认证状态持久化保存
- ✅ 退出登录：清除本地认证信息

### 2. 云端存储

- ✅ 文档自动同步到云端服务器
- ✅ 支持多设备访问同一账户的文档
- ✅ 文档列表查看
- ✅ 文档创建、读取、更新、删除（CRUD）
- ✅ 文档重命名功能

## 使用方法

### 启动后端服务器

```bash
# 进入服务器目录
cd apps/server

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

服务器将在 `http://localhost:4000` 启动

### 启动前端应用

```bash
# 在项目根目录
pnpm install

# 启动开发服务器
pnpm run dev
```

应用将在浏览器中自动打开

### 使用步骤

1. **注册账户**
   - 点击右上角的"登录/注册"按钮
   - 选择"注册"标签
   - 输入用户名、邮箱和密码（至少6位）
   - 点击"注册"按钮

2. **登录账户**
   - 点击"登录/注册"按钮
   - 输入邮箱和密码
   - 点击"登录"按钮

3. **使用云端存储**
   - 登录后，系统自动切换到云端存储模式
   - 所有文档自动保存到云端
   - 可以在"存储模式"设置中查看当前状态

4. **退出登录**
   - 点击右上角的用户头像
   - 选择"退出登录"

## API接口

### 认证接口

**注册**

```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "123456",
  "username": "用户名"
}
```

**登录**

```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "123456"
}
```

**获取当前用户信息**

```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer <token>"
}
```

### 文档接口

**获取文档列表**

```
GET /api/documents
Headers: {
  "Authorization": "Bearer <token>"
}
```

**获取单个文档**

```
GET /api/documents/<path>
Headers: {
  "Authorization": "Bearer <token>"
}
```

**保存文档**

```
POST /api/documents
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "path": "/文档.md",
  "name": "文档.md",
  "content": "文档内容",
  "meta": {}
}
```

**删除文档**

```
DELETE /api/documents/<path>
Headers: {
  "Authorization": "Bearer <token>"
}
```

## 技术栈

### 后端

- **NestJS**: 渐进式Node.js框架
- **JWT**: JSON Web Token认证
- **Passport**: 认证中间件
- **bcrypt**: 密码加密

### 前端

- **React 18**: UI框架
- **Zustand**: 状态管理
- **TypeScript**: 类型安全
- **Vite**: 构建工具

## 注意事项

1. **当前实现使用内存存储**
   - 用户数据和文档数据当前存储在服务器内存中
   - 服务器重启后数据会丢失
   - 生产环境应该使用数据库（MongoDB、PostgreSQL等）

2. **JWT密钥**
   - 默认密钥：`wemd-secret-key-change-in-production`
   - 生产环境请在 `.env` 文件中设置 `JWT_SECRET`

3. **CORS配置**
   - 当前允许所有源访问
   - 生产环境应该配置具体的允许域名

## 未来计划

- [ ] 集成数据库（MongoDB/PostgreSQL）
- [ ] 邮箱验证功能
- [ ] 密码重置功能
- [ ] 用户头像上传
- [ ] 文档分享功能
- [ ] 协作编辑功能
- [ ] 文档版本历史

## 故障排除

### 登录失败

- 确保后端服务器正在运行（http://localhost:4000）
- 检查浏览器控制台是否有网络错误
- 验证邮箱和密码是否正确

### 文档保存失败

- 确保已登录
- 检查认证token是否过期（7天有效期）
- 查看后端服务器日志

### 无法切换到云端存储

- 必须先登录账户
- 检查浏览器控制台错误信息
- 确认后端API可访问

## 相关文件

### 后端

- `apps/server/src/auth/` - 认证模块
- `apps/server/src/documents/` - 文档管理模块
- `apps/server/src/app.module.ts` - 主模块配置

### 前端

- `apps/web/src/store/authStore.ts` - 认证状态管理
- `apps/web/src/components/Auth/` - 认证UI组件
- `apps/web/src/storage/adapters/CloudAdapter.ts` - 云端存储适配器
- `apps/web/src/components/Header/Header.tsx` - Header集成
