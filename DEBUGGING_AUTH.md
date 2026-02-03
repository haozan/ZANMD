# 注册登录功能调试指南

## 问题现象

用户点击注册时提示 "Load failed"

## 已实施的修复

### 1. 动态API URL配置

创建了 `apps/web/src/config/api.ts`，根据运行环境自动检测后端URL：

- **本地开发环境** (localhost): 使用 `http://localhost:4000/api`
- **Clacky平台环境** (\*.clackypaas.com): 自动替换端口为4000
- **其他环境**: 使用相对路径 `/api`

### 2. 增强的错误处理

- 添加详细的控制台日志，记录每个请求步骤
- 网络错误时提供更明确的错误提示
- 区分网络连接失败和API返回错误

## 调试步骤

### 步骤1: 打开浏览器开发者工具

1. 按 `F12` 或右键点击页面选择"检查"
2. 切换到 "Console" (控制台) 标签页

### 步骤2: 尝试注册

1. 点击注册按钮
2. 填写表单信息
3. 提交表单
4. 观察控制台输出

### 步骤3: 查看日志信息

控制台会显示以下信息：

```
[API Config] 环境检测:
  isDev: true/false
  hostname: "localhost" 或 "xxx.clackypaas.com"
  protocol: "http:" 或 "https:"
  fullUrl: 完整的页面URL

[API Config] 使用xxx URL: http://...

[Auth] 发起注册请求: http://localhost:4000/api/auth/register
[Auth] 请求数据: { email: "...", username: "...", password: "***" }
[Auth] 响应状态: 201 Created
[Auth] 响应数据: { user: {...}, token: "..." }
```

### 步骤4: 分析问题

#### 情况A: 没有看到 [API Config] 日志

- 说明页面没有加载API配置文件
- 可能需要刷新浏览器（Ctrl+Shift+R 强制刷新）

#### 情况B: 看到错误 "Failed to fetch" 或 "Network error"

- 后端服务器可能没有启动
- 检查后端是否在4000端口运行：`ps aux | grep nest`
- 检查CORS配置是否正确

#### 情况C: 响应状态码不是 2xx

- API返回了错误
- 查看响应数据中的错误信息

#### 情况D: hostname不是预期的值

- 在Clacky平台上，hostname应该包含 "clackypaas.com"
- 确认URL替换逻辑是否正确

## 后端服务器检查

### 检查后端是否运行

```bash
# 检查进程
ps aux | grep nest

# 检查端口
netstat -tlnp | grep 4000

# 测试API
curl http://localhost:4000/api/auth/users
```

### 手动测试注册API

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "username": "testuser"
  }'
```

预期返回：

```json
{
  "user": {
    "id": "user_xxx",
    "email": "test@example.com",
    "username": "testuser"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 常见问题

### Q1: 为什么使用硬编码的localhost:4000？

A: 只在本地开发环境（DEV模式 + localhost域名）时使用。在Clacky平台或生产环境会自动切换到正确的URL。

### Q2: Clacky平台的端口映射是如何工作的？

A: Clacky平台会为每个端口创建不同的URL：

- 5173端口 (前端): `https://xxx-5173.clackypaas.com`
- 4000端口 (后端): `https://xxx-4000.clackypaas.com`

代码会自动将前端URL中的 `-5173` 替换为 `-4000`。

### Q3: 如果还是失败怎么办？

A: 请将浏览器控制台的完整日志截图或复制出来，包括：

- [API Config] 开头的日志
- [Auth] 开头的日志
- 任何红色的错误信息

## 下一步

如果以上步骤都无法解决问题，请提供：

1. 浏览器控制台的完整日志
2. 当前访问的URL（前端地址）
3. 后端服务器的状态（是否运行、端口号）
