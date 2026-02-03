import { FolderOpen } from "lucide-react";
import { useFileSystem } from "../../hooks/useFileSystem";
import "./Welcome.css";

export function Welcome() {
  const { selectWorkspace } = useFileSystem();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img
          src={`${import.meta.env.BASE_URL}favicon-dark.png`}
          alt="红中排版 Logo"
          className="welcome-logo"
        />
        <h1>欢迎使用红中排版</h1>
        <p>请选择一个文件夹作为工作区以开始写作</p>
        <button className="btn-primary" onClick={selectWorkspace}>
          <FolderOpen size={20} />
          选择工作区文件夹
        </button>
      </div>
    </div>
  );
}
