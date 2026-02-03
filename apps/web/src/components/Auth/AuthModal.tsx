import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_BASE_URL } from "../../config/api";
import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  onSuccess?: () => void;
}

const VERSION = "v5.0-FINAL";
const BUILD_TIME = "2025-01-16 11:35";

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    console.log(
      `%c🎯 AuthModal ${VERSION} 已加载`,
      "background: #0f0; color: #000; font-size: 20px; padding: 10px;",
    );
    console.log(
      `%c构建时间: ${BUILD_TIME}`,
      "background: #ff0; color: #000; font-size: 16px; padding: 5px;",
    );
    console.log(
      '%c✅ 已移除所有 type="email" 和 HTML5 验证',
      "color: green; font-weight: bold;",
    );

    // 在页面标题显示版本号
    document.title = `[${VERSION}] ${document.title.replace(/^\[.*?\]\s*/, "")}`;
  }, []);

  useEffect(() => {
    console.log("AuthModal 渲染, isOpen:", isOpen, "mode:", mode);
  }, [isOpen, mode]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`🟢 [${VERSION}] 表单提交开始`);
    console.log("🟢 当前模式:", mode);
    console.log("🟢 输入值:", {
      email,
      password: "***",
      username: mode === "register" ? username : "N/A",
    });

    setError("");

    // 非常宽松的自定义验证
    if (mode === "register" && (!username || username.trim().length < 2)) {
      setError("用户名至少需要2个字符");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("请输入包含@的邮箱地址");
      return;
    }

    if (!password || password.length < 6) {
      setError("密码至少需要6个字符");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email: email.trim(), password }
          : { email: email.trim(), password, username: username.trim() };

      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`[Auth] 发起${mode === "login" ? "登录" : "注册"}请求:`, url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("[Auth] 响应状态:", response.status);

      const data = await response.json();
      console.log("[Auth] 响应数据:", data);

      if (!response.ok) {
        throw new Error(data.message || "操作失败");
      }

      setAuth(data.user, data.token);

      console.log("✅ [Auth] 登录成功");

      setEmail("");
      setPassword("");
      setUsername("");
      onClose();

      onSuccess?.();
    } catch (err) {
      console.error("[Auth] 请求失败:", err);

      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("网络连接失败，请检查后端服务器是否启动（端口4000）");
      } else {
        setError(err instanceof Error ? err.message : "操作失败，请重试");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 醒目的版本号显示 */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "50px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {VERSION}
        </div>

        <div className="auth-modal-header">
          <h2>{mode === "login" ? "登录" : "注册"}</h2>
          <button
            className="auth-modal-close"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
          <p>{mode === "login" ? "欢迎回来" : "创建新账户"}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="auth-form-group">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="auth-form-group">
            <label htmlFor="email">邮箱 (纯文本输入)</label>
            <input
              id="email"
              type="text"
              placeholder="例如: test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{ border: "2px solid #10b981" }}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {mode === "login" ? "还没有账户？" : "已有账户？"}
            <button type="button" onClick={toggleMode} disabled={loading}>
              {mode === "login" ? "立即注册" : "立即登录"}
            </button>
          </p>
        </div>

        {mode === "login" && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              background: "#f0f9ff",
              borderRadius: "4px",
              fontSize: "0.85rem",
              color: "#0369a1",
              borderLeft: "4px solid #0ea5e9",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
              💡 测试账号
            </div>
            <div>邮箱: test@example.com</div>
            <div>密码: 123456</div>
          </div>
        )}

        {/* 构建时间戳 */}
        <div
          style={{
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.7rem",
            color: "#999",
          }}
        >
          Build: {BUILD_TIME}
        </div>
      </div>
    </div>
  );
}
