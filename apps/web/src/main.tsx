import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { TestLogin } from "./pages/TestLogin.tsx";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.tsx";
import { StorageProvider } from "./storage/StorageContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* 落地页 */}
          <Route path="/" element={<LandingPage />} />

          {/* 测试登录诊断页面 - 无需登录 */}
          <Route path="/test-login" element={<TestLogin />} />

          {/* 编辑器页面 - 需要登录 */}
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <StorageProvider>
                  <App />
                </StorageProvider>
              </ProtectedRoute>
            }
          />

          {/* 默认重定向到落地页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
