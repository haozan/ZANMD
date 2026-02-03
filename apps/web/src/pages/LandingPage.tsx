import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Cloud, ImageIcon, TrendingUp, ArrowRight } from "lucide-react";
import "./LandingPage.css";

const AuthModal = lazy(() =>
  import("../components/Auth/AuthModal").then((m) => ({
    default: m.AuthModal,
  })),
);
const UserMenu = lazy(() =>
  import("../components/Auth/UserMenu").then((m) => ({
    default: m.UserMenu,
  })),
);

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/editor");
    } else {
      // 未登录时显示登录弹窗
      setAuthMode("login");
      setShowAuthModal(true);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img
              src={`${import.meta.env.BASE_URL}favicon-dark.png`}
              alt="红中排版 Logo"
              width={32}
              height={32}
            />
            <span className="nav-brand">红中排版</span>
          </div>
          <div className="nav-actions">
            <button
              className="nav-test-btn"
              onClick={() => navigate("/test-login")}
              style={{
                marginRight: "10px",
                padding: "8px 16px",
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
              }}
            >
              🧪 测试登录
            </button>
            {isAuthenticated ? (
              <Suspense fallback={null}>
                <UserMenu />
              </Suspense>
            ) : (
              <>
                <button
                  className="nav-login-btn"
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                >
                  登录
                </button>
                <button
                  className="nav-register-btn"
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuthModal(true);
                  }}
                >
                  注册
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-logo">
            <img
              src={`${import.meta.env.BASE_URL}favicon-dark.png`}
              alt="红中排版 Logo"
              width={80}
              height={80}
            />
          </div>
          <h1 className="hero-title">红中排版 篇篇爆红</h1>
          <h2 className="hero-subtitle">公众号排版运营神器</h2>
          <p className="hero-description">
            专业的公众号 Markdown 排版工具，让每一篇文章都能获得最佳呈现效果
          </p>
          <button className="hero-cta" onClick={handleGetStarted}>
            开始创作
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-heading">为什么选择红中排版？</h2>
          <div className="features-grid">
            {/* Feature 1: 云端存储 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Cloud size={32} strokeWidth={2} />
              </div>
              <h3 className="feature-title">云端存储 随时随地</h3>
              <p className="feature-description">
                文章安全存储在云端服务器，无论何时何地，登录即可访问你的所有创作内容，永不丢失。
              </p>
            </div>

            {/* Feature 2: 图片上传 */}
            <div className="feature-card">
              <div className="feature-icon">
                <ImageIcon size={32} strokeWidth={2} />
              </div>
              <h3 className="feature-title">支持上传图片</h3>
              <p className="feature-description">
                集成多家图床服务（阿里云、腾讯云、七牛云等），一键上传图片，自动生成外链，让文章图文并茂。
              </p>
            </div>

            {/* Feature 3: 运营技能 */}
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} strokeWidth={2} />
              </div>
              <h3 className="feature-title">不仅是排版，还封装了运营技能</h3>
              <p className="feature-description">
                内置多款精美主题模板，支持代码高亮、数学公式、流程图等高级功能，助力内容传播与增长。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-heading">准备好创作爆款文章了吗？</h2>
          <p className="cta-description">
            立即开始使用红中排版，让你的内容脱颖而出
          </p>
          <button className="cta-button" onClick={handleGetStarted}>
            免费开始
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-text">© 2024 红中排版. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authMode}
            onSuccess={() => {
              // 登录成功后跳转到编辑器
              navigate("/editor");
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
