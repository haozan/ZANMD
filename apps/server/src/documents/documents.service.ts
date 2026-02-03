import { Injectable, NotFoundException } from '@nestjs/common';

export interface Document {
  id: string;
  userId: string;
  path: string;
  name: string;
  content: string;
  size: number;
  updatedAt: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

// 临时内存存储，生产环境应该使用数据库
const documents: Map<string, Document> = new Map();

@Injectable()
export class DocumentsService {
  // 获取用户的所有文档
  async listDocuments(userId: string): Promise<Omit<Document, 'content'>[]> {
    return Array.from(documents.values())
      .filter((doc) => doc.userId === userId)
      .map(({ content, ...doc }) => ({ ...doc, size: content.length }));
  }

  // 获取单个文档
  async getDocument(userId: string, path: string): Promise<Document> {
    const doc = Array.from(documents.values()).find(
      (d) => d.userId === userId && d.path === path,
    );
    if (!doc) {
      throw new NotFoundException('文档不存在');
    }
    return doc;
  }

  // 创建或更新文档
  async saveDocument(
    userId: string,
    path: string,
    name: string,
    content: string,
    meta?: Record<string, unknown>,
  ): Promise<Document> {
    // 查找是否已存在
    const existingDoc = Array.from(documents.values()).find(
      (d) => d.userId === userId && d.path === path,
    );

    if (existingDoc) {
      // 更新现有文档
      existingDoc.content = content;
      existingDoc.name = name;
      existingDoc.size = content.length;
      existingDoc.updatedAt = new Date().toISOString();
      if (meta) existingDoc.meta = { ...existingDoc.meta, ...meta };
      documents.set(existingDoc.id, existingDoc);
      return existingDoc;
    } else {
      // 创建新文档
      const newDoc: Document = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        path,
        name,
        content,
        size: content.length,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        meta: meta || {},
      };
      documents.set(newDoc.id, newDoc);
      return newDoc;
    }
  }

  // 删除文档
  async deleteDocument(userId: string, path: string): Promise<void> {
    const doc = Array.from(documents.values()).find(
      (d) => d.userId === userId && d.path === path,
    );
    if (!doc) {
      throw new NotFoundException('文档不存在');
    }
    documents.delete(doc.id);
  }

  // 批量删除文档
  async deleteDocuments(userId: string, paths: string[]): Promise<void> {
    for (const path of paths) {
      try {
        await this.deleteDocument(userId, path);
      } catch (e) {
        // 忽略不存在的文档
      }
    }
  }
}
