import { useEffect, useState } from "react";
import type { StorageType } from "../../storage/types";
import { useStorageContext } from "../../storage/StorageContext";
import { useAuthStore } from "../../store/authStore";
import "./StorageModeSelector.css";

const OPTIONS: {
  type: StorageType;
  label: string;
  description: string;
  notice: string;
}[] = [
  {
    type: "cloud",
    label: "云端存储模式",
    description: "文章安全存储在云端服务器，随时随地访问，永不丢失。",
    notice: "✨ 需要登录账号才能使用云端存储功能。",
  },
];

export function StorageModeSelector() {
  const { type, message, select, ready } = useStorageContext();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready) setLoading(false);
  }, [ready]);

  const handleSelect = async (nextType: StorageType) => {
    if (nextType === "cloud" && !isAuthenticated) {
      alert("请先登录账号");
      return;
    }
    setLoading(true);
    await select(nextType);
    setLoading(false);
  };

  return (
    <div className="storage-mode-selector">
      <p className="storage-mode-tip">
        文章默认保存在云端服务器，安全可靠，随时随地访问。
      </p>
      <div className="storage-mode-options">
        {OPTIONS.map((option) => {
          const disabled = option.type === "cloud" && !isAuthenticated;
          return (
            <button
              key={option.type}
              className={`storage-mode-option ${type === option.type ? "active" : ""}`}
              disabled={disabled || loading}
              onClick={() => handleSelect(option.type)}
            >
              <div className="storage-mode-option__label">
                <span>{option.label}</span>
                {type === option.type && <small>当前</small>}
              </div>
              <p>
                {disabled ? "请先登录账号以使用云端存储" : option.description}
              </p>
              <p className="storage-mode-notice">{option.notice}</p>
            </button>
          );
        })}
      </div>
      {message && <div className="storage-mode-status">{message}</div>}
    </div>
  );
}
