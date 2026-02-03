import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import "./AuthModal.css";

export function UserMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  if (!user) return null;

  const getInitial = () => {
    return user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <div
        className="auth-user-info"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="auth-user-avatar">{getInitial()}</div>
        <span className="auth-user-name">{user.username || user.email}</span>
      </div>

      {showDropdown && (
        <div className="auth-dropdown">
          <button className="auth-dropdown-item">
            <UserIcon size={16} />
            <span>个人信息</span>
          </button>
          <button className="auth-dropdown-item danger" onClick={handleLogout}>
            <LogOut size={16} />
            <span>退出登录</span>
          </button>
        </div>
      )}
    </div>
  );
}
