import { useState, useEffect } from "react";
import "../pages/LandingPage.css";
import { getApiBaseUrl } from "../config/api";

const VERSION = "v5.1-DIAGNOSTIC";
const BUILD_TIME = "2025-01-16 12:10";

export function TestLogin() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [logs, setLogs] = useState<
    Array<{ msg: string; color: string; time: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    // 页面加载时显示环境信息
    const detectedApiUrl = getApiBaseUrl();
    setApiUrl(detectedApiUrl);

    log("✅ 页面加载完成", "#10b981");
    log(`🌍 当前域名: ${window.location.hostname}`, "#3b82f6");
    log(`🔌 当前端口: ${window.location.port || "默认"}`, "#3b82f6");
    log(`🔗 完整URL: ${window.location.href}`, "#3b82f6");
    log(`🎯 检测到的API地址: ${detectedApiUrl}`, "#8b5cf6");
    log(`📋 登录地址: ${detectedApiUrl}/auth/login`, "#8b5cf6");
  }, []);

  const log = (msg: string, color = "#10b981") => {
    const time = new Date().toLocaleTimeString("zh-CN");
    setLogs((prev) => [...prev, { msg, color, time }]);
    console.log(`[${time}] ${msg}`);
  };

  const testConnection = async () => {
    log("🔍 开始测试后端连接...", "#f59e0b");

    try {
      const testUrl = `${apiUrl}/auth/users`;
      log(`📡 测试URL: ${testUrl}`, "#3b82f6");

      const response = await fetch(testUrl, {
        method: "GET",
      });

      log(`✅ 连接成功! HTTP ${response.status}`, "#10b981");
      const data = await response.json();
      log(
        `📦 返回数据: ${JSON.stringify(data).substring(0, 100)}...`,
        "#10b981",
      );
    } catch (error: any) {
      log(`❌ 连接失败: ${error.message}`, "#ef4444");
      log(`🔧 可能原因: 后端服务未启动或端口未暴露`, "#f59e0b");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    log("🚀 开始登录流程...", "#3b82f6");
    log(`📧 邮箱: ${email}`, "#6366f1");
    log(`🔑 密码长度: ${password.length} 字符`, "#6366f1");

    try {
      log("📡 正在发送请求到后端...", "#8b5cf6");

      const loginUrl = `${apiUrl}/auth/login`;
      log(`🌐 登录地址: ${loginUrl}`, "#8b5cf6");

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        mode: "cors", // 明确指定CORS模式
      });

      log(
        `📥 收到响应: HTTP ${response.status} ${response.statusText}`,
        "#10b981",
      );

      const data = await response.json();
      log(`📦 响应数据: ${JSON.stringify(data)}`, "#10b981");

      if (response.ok) {
        log("✅ 登录成功！", "#10b981");
        log("🎉 没有出现 HTML5 验证错误！", "#10b981");
        alert(
          '登录成功！\n\n✅ 没有看到任何 "The string did not match the expected pattern" 错误！\n\n这说明表单验证已经正常了！',
        );
      } else {
        log(`❌ 登录失败: ${data.message}`, "#ef4444");
      }
    } catch (error: any) {
      log(`❌ 网络错误: ${error.message}`, "#ef4444");
      log(
        `💡 提示: 这可能是因为后端服务在 Clacky 环境中端口未正确暴露`,
        "#f59e0b",
      );
      log(`🔧 建议: 请检查后端是否正在运行`, "#f59e0b");

      // 显示更友好的错误信息
      alert(
        `网络连接失败\n\n错误详情: ${error.message}\n\n可能原因:\n1. 后端服务器未启动\n2. 端口配置不正确\n3. CORS跨域问题\n\n请查看页面底部的日志了解详情`,
      );
    } finally {
      setLoading(false);
      log("🏁 登录流程结束", "#6b7280");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* 版本标识 */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "12px",
          fontSize: "0.9rem",
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        {VERSION}
      </div>

      {/* 诊断信息卡片 */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto 20px",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
          🧪 登录表单诊断工具
        </h2>
        <div
          style={{
            margin: "10px 0",
            padding: "10px",
            background: "#fef3c7",
            borderRadius: "8px",
            border: "1px solid #fbbf24",
          }}
        >
          <p style={{ margin: "5px 0", color: "#92400e", fontSize: "0.9rem" }}>
            <strong>环境信息:</strong>
            <br />
            域名: {window.location.hostname}
            <br />
            端口: {window.location.port || "默认"}
            <br />
            API地址: {apiUrl || "检测中..."}
          </p>
        </div>
        <button
          onClick={testConnection}
          style={{
            padding: "8px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          🔍 测试后端连接
        </button>
      </div>

      {/* 登录表单 */}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            margin: "0 0 30px 0",
            fontSize: "2rem",
            color: "#1f2937",
            textAlign: "center",
          }}
        >
          测试登录
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "500",
                fontSize: "0.95rem",
              }}
            >
              邮箱地址
              <span
                style={{
                  marginLeft: "8px",
                  color: "#10b981",
                  fontSize: "0.85rem",
                  background: "#d1fae5",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                type="text"
              </span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                log(`📝 邮箱输入改变: ${e.target.value}`, "#3b82f6");
              }}
              onFocus={() => log("👆 邮箱输入框获得焦点", "#8b5cf6")}
              onBlur={() => log("👋 邮箱输入框失去焦点", "#8b5cf6")}
              placeholder="例如: test@example.com"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #10b981",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "500",
                fontSize: "0.95rem",
              }}
            >
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                log(
                  `🔐 密码输入改变 (长度: ${e.target.value.length})`,
                  "#3b82f6",
                );
              }}
              placeholder="请输入密码"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #fbbf24",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400e" }}>
              <strong>测试账号:</strong>
              <br />
              邮箱: test@example.com
              <br />
              密码: 123456
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>

      {/* 日志面板 */}
      <div
        style={{
          maxWidth: "800px",
          margin: "30px auto 0",
          background: "#1f2937",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            margin: "0 0 15px 0",
            color: "#f3f4f6",
            fontSize: "1.1rem",
            fontWeight: "600",
          }}
        >
          📊 实时日志
        </h3>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.85rem",
          }}
        >
          {logs.length === 0 ? (
            <div
              style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}
            >
              等待操作...
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 0",
                  borderBottom: "1px solid #374151",
                  color: log.color,
                }}
              >
                <span style={{ color: "#9ca3af" }}>[{log.time}]</span> {log.msg}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 底部说明 */}
      <div
        style={{
          maxWidth: "800px",
          margin: "20px auto 0",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "0.9rem",
        }}
      >
        <p style={{ margin: "5px 0" }}>
          ⚡ 版本: <strong>{VERSION}</strong> | 构建时间: {BUILD_TIME}
        </p>
        <p style={{ margin: "5px 0" }}>
          🔍 所有表单交互和网络请求都会记录在日志面板中
        </p>
        <p style={{ margin: "5px 0" }}>
          💡 如果出现网络错误，点击"测试后端连接"按钮进行诊断
        </p>
      </div>
    </div>
  );
}
