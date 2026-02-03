import type { StorageAdapter } from "../StorageAdapter";
import type { FileItem, StorageInitResult } from "../types";
import { useAuthStore } from "../../store/authStore";
import { API_BASE_URL } from "../../config/api";

const API_BASE = API_BASE_URL;

export class CloudAdapter implements StorageAdapter {
  private userId: string | null = null;
  private token: string | null = null;

  async init(): Promise<StorageInitResult> {
    // 从auth store获取认证信息
    const authState = useAuthStore.getState();

    if (!authState.isAuthenticated || !authState.token) {
      return {
        ready: false,
        message: "请先登录以使用云端存储",
      };
    }

    this.userId = authState.user?.id || null;
    this.token = authState.token;

    return {
      ready: true,
      message: "云端存储已连接",
    };
  }

  private getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

  async listFiles(): Promise<FileItem[]> {
    const response = await fetch(`${API_BASE}/documents`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("获取文档列表失败");
    }

    const documents = await response.json();
    return documents.map((doc: any) => ({
      path: doc.path,
      name: doc.name,
      size: doc.size,
      updatedAt: doc.updatedAt,
      meta: doc.meta,
    }));
  }

  async readFile(path: string): Promise<string> {
    const encodedPath = encodeURIComponent(path);
    const response = await fetch(`${API_BASE}/documents/${encodedPath}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("文档不存在");
      }
      throw new Error("读取文档失败");
    }

    const document = await response.json();
    return document.content;
  }

  async writeFile(path: string, content: string): Promise<void> {
    const name = path.split("/").pop() || path;

    const response = await fetch(`${API_BASE}/documents`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        path,
        name,
        content,
        meta: {
          size: content.length,
          updatedAt: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("保存文档失败");
    }
  }

  async deleteFile(path: string): Promise<void> {
    const encodedPath = encodeURIComponent(path);
    const response = await fetch(`${API_BASE}/documents/${encodedPath}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("删除文档失败");
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    // 读取旧文件内容
    const content = await this.readFile(oldPath);

    // 写入新文件
    await this.writeFile(newPath, content);

    // 删除旧文件
    await this.deleteFile(oldPath);
  }

  async teardown(): Promise<void> {
    this.userId = null;
    this.token = null;
  }
}
